"""
Evidence Upload/Download API Endpoints

Provides endpoints for managing evidence files (images, documents)
for KYC verifications.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.core.storage import get_storage, EvidenceStorage
from app.models.evidence_object import EvidenceObject
from app.models.verification import Verification
from app.deps.tenant import get_current_tenant_id

router = APIRouter()


@router.post("/upload/{verification_id}")
async def upload_evidence(
    verification_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Upload evidence file for a verification.
    
    Args:
        verification_id: UUID of the verification
        file: Uploaded file
        tenant_id: Current tenant ID (from auth)
    
    Returns:
        Evidence object with upload details
    """
    # Verify verification exists and belongs to tenant
    verification = db.query(Verification).filter(
        Verification.id == verification_id,
        Verification.tenant_id == tenant_id
    ).first()
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is required"
        )
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum of {max_size / 1024 / 1024}MB"
        )
    
    try:
        # Get storage instance
        storage = get_storage()
        
        # Generate object key
        object_key = storage.generate_object_key(
            tenant_id=str(tenant_id),
            verification_id=str(verification_id),
            filename=file.filename
        )
        
        # Upload file
        storage.upload_file(
            file_data=file_content,
            object_key=object_key,
            content_type=file.content_type or "application/octet-stream"
        )
        
        # Create evidence object record
        evidence_obj = EvidenceObject(
            verification_id=verification_id,
            tenant_id=tenant_id,
            object_key=object_key,
            media_type=file.content_type or "application/octet-stream"
        )
        
        db.add(evidence_obj)
        db.commit()
        db.refresh(evidence_obj)
        
        return {
            "id": str(evidence_obj.id),
            "verification_id": str(verification_id),
            "object_key": object_key,
            "media_type": file.content_type,
            "file_size": file_size,
            "filename": file.filename,
            "created_at": evidence_obj.created_at.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )


@router.get("/download/{evidence_id}")
async def download_evidence(
    evidence_id: UUID,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Download evidence file.
    
    Args:
        evidence_id: UUID of the evidence object
        tenant_id: Current tenant ID (from auth)
    
    Returns:
        File download response
    """
    from fastapi.responses import Response
    
    # Verify evidence exists and belongs to tenant
    evidence = db.query(EvidenceObject).filter(
        EvidenceObject.id == evidence_id,
        EvidenceObject.tenant_id == tenant_id
    ).first()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    try:
        # Get storage instance
        storage = get_storage()
        
        # Download file
        file_data = storage.download_file(evidence.object_key)
        
        return Response(
            content=file_data,
            media_type=evidence.media_type,
            headers={
                "Content-Disposition": f"attachment; filename=evidence_{evidence_id}"
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download file: {str(e)}"
        )


@router.get("/presigned-url/{evidence_id}")
async def get_presigned_url(
    evidence_id: UUID,
    expires_in: int = 3600,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Get presigned URL for temporary file access.
    
    Args:
        evidence_id: UUID of the evidence object
        expires_in: URL expiration time in seconds (default: 1 hour)
        tenant_id: Current tenant ID (from auth)
    
    Returns:
        Presigned URL
    """
    # Verify evidence exists and belongs to tenant
    evidence = db.query(EvidenceObject).filter(
        EvidenceObject.id == evidence_id,
        EvidenceObject.tenant_id == tenant_id
    ).first()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    try:
        # Get storage instance
        storage = get_storage()
        
        # Generate presigned URL
        url = storage.generate_presigned_url(
            evidence.object_key,
            expires_in=expires_in
        )
        
        return {
            "evidence_id": str(evidence_id),
            "url": url,
            "expires_in": expires_in,
            "media_type": evidence.media_type
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate presigned URL: {str(e)}"
        )


@router.delete("/{evidence_id}")
async def delete_evidence(
    evidence_id: UUID,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Delete evidence file.
    
    Args:
        evidence_id: UUID of the evidence object
        tenant_id: Current tenant ID (from auth)
    
    Returns:
        Success message
    """
    # Verify evidence exists and belongs to tenant
    evidence = db.query(EvidenceObject).filter(
        EvidenceObject.id == evidence_id,
        EvidenceObject.tenant_id == tenant_id
    ).first()
    
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
    
    try:
        # Get storage instance
        storage = get_storage()
        
        # Delete file from storage
        storage.delete_file(evidence.object_key)
        
        # Delete database record
        db.delete(evidence)
        db.commit()
        
        return {
            "message": "Evidence deleted successfully",
            "evidence_id": str(evidence_id)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.get("/verification/{verification_id}")
async def list_verification_evidence(
    verification_id: UUID,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    List all evidence files for a verification.
    
    Args:
        verification_id: UUID of the verification
        tenant_id: Current tenant ID (from auth)
    
    Returns:
        List of evidence objects
    """
    # Verify verification exists and belongs to tenant
    verification = db.query(Verification).filter(
        Verification.id == verification_id,
        Verification.tenant_id == tenant_id
    ).first()
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    # Get all evidence for this verification
    evidence_list = db.query(EvidenceObject).filter(
        EvidenceObject.verification_id == verification_id,
        EvidenceObject.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(e.id),
            "object_key": e.object_key,
            "media_type": e.media_type,
            "created_at": e.created_at.isoformat()
        }
        for e in evidence_list
    ]

