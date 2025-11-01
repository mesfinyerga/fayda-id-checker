"""
Evidence Storage Module using MinIO/S3-compatible object storage.

This module provides file storage functionality for evidence objects
(images, documents, etc.) related to KYC verifications.

Supports:
- MinIO (for local development)
- AWS S3 (for production)
- S3-compatible services
"""

import os
import uuid
from typing import Optional, BinaryIO, Tuple
from datetime import timedelta
from pathlib import Path

try:
    from minio import Minio
    from minio.error import S3Error
    MINIO_AVAILABLE = True
except ImportError:
    MINIO_AVAILABLE = False

try:
    import boto3
    from botocore.exceptions import ClientError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False


class EvidenceStorage:
    """Evidence storage using MinIO or S3"""
    
    def __init__(self):
        self.storage_type = self._detect_storage_type()
        self.client = self._create_client()
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME") or os.getenv("S3_BUCKET_NAME", "fayda-evidence")
        self._ensure_bucket()
    
    def _detect_storage_type(self) -> str:
        """Detect whether to use MinIO or S3"""
        if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
            return "s3"
        elif os.getenv("MINIO_ENDPOINT"):
            return "minio"
        else:
            raise ValueError(
                "Storage configuration missing. Set either:\n"
                "- MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY (for MinIO)\n"
                "- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (for S3)"
            )
    
    def _create_client(self):
        """Create storage client based on type"""
        if self.storage_type == "minio":
            if not MINIO_AVAILABLE:
                raise ImportError(
                    "minio package not installed. Install with: pip install minio"
                )
            
            endpoint = os.getenv("MINIO_ENDPOINT", "localhost:9000")
            access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
            secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
            secure = os.getenv("MINIO_SECURE", "false").lower() == "true"
            
            return Minio(
                endpoint,
                access_key=access_key,
                secret_key=secret_key,
                secure=secure
            )
        
        elif self.storage_type == "s3":
            if not BOTO3_AVAILABLE:
                raise ImportError(
                    "boto3 package not installed. Install with: pip install boto3"
                )
            
            return boto3.client(
                's3',
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "us-east-1")
            )
    
    def _ensure_bucket(self):
        """Ensure bucket exists, create if not"""
        try:
            if self.storage_type == "minio":
                if not self.client.bucket_exists(self.bucket_name):
                    self.client.make_bucket(self.bucket_name)
            elif self.storage_type == "s3":
                self.client.head_bucket(Bucket=self.bucket_name)
        except (S3Error, ClientError) as e:
            # Bucket doesn't exist, create it
            if self.storage_type == "minio":
                self.client.make_bucket(self.bucket_name)
            elif self.storage_type == "s3":
                self.client.create_bucket(Bucket=self.bucket_name)
    
    def generate_object_key(
        self, 
        tenant_id: str, 
        verification_id: str, 
        filename: str
    ) -> str:
        """
        Generate object key following structure: {tenant_id}/{verification_id}/{uuid}.{ext}
        
        Args:
            tenant_id: Tenant UUID
            verification_id: Verification UUID
            filename: Original filename
        
        Returns:
            Object key string
        """
        file_ext = Path(filename).suffix or ""
        object_uuid = str(uuid.uuid4())
        
        return f"{tenant_id}/{verification_id}/{object_uuid}{file_ext}"
    
    def upload_file(
        self, 
        file_data: bytes, 
        object_key: str, 
        content_type: str = "application/octet-stream"
    ) -> str:
        """
        Upload file to storage.
        
        Args:
            file_data: File content as bytes
            object_key: Object key (path) in storage
            content_type: MIME type of the file
        
        Returns:
            Object key (for confirmation)
        """
        from io import BytesIO
        
        try:
            if self.storage_type == "minio":
                self.client.put_object(
                    self.bucket_name,
                    object_key,
                    BytesIO(file_data),
                    length=len(file_data),
                    content_type=content_type
                )
            elif self.storage_type == "s3":
                self.client.put_object(
                    Bucket=self.bucket_name,
                    Key=object_key,
                    Body=file_data,
                    ContentType=content_type
                )
            
            return object_key
        except (S3Error, ClientError) as e:
            raise ValueError(f"Failed to upload file: {str(e)}")
    
    def download_file(self, object_key: str) -> bytes:
        """
        Download file from storage.
        
        Args:
            object_key: Object key (path) in storage
        
        Returns:
            File content as bytes
        """
        try:
            if self.storage_type == "minio":
                response = self.client.get_object(self.bucket_name, object_key)
                data = response.read()
                response.close()
                response.release_conn()
                return data
            elif self.storage_type == "s3":
                response = self.client.get_object(
                    Bucket=self.bucket_name,
                    Key=object_key
                )
                return response['Body'].read()
        except (S3Error, ClientError) as e:
            raise ValueError(f"Failed to download file: {str(e)}")
    
    def delete_file(self, object_key: str) -> bool:
        """
        Delete file from storage.
        
        Args:
            object_key: Object key (path) in storage
        
        Returns:
            True if deleted successfully
        """
        try:
            if self.storage_type == "minio":
                self.client.remove_object(self.bucket_name, object_key)
            elif self.storage_type == "s3":
                self.client.delete_object(
                    Bucket=self.bucket_name,
                    Key=object_key
                )
            return True
        except (S3Error, ClientError) as e:
            raise ValueError(f"Failed to delete file: {str(e)}")
    
    def generate_presigned_url(
        self, 
        object_key: str, 
        expires_in: int = 3600
    ) -> str:
        """
        Generate presigned URL for temporary file access.
        
        Args:
            object_key: Object key (path) in storage
            expires_in: URL expiration time in seconds (default: 1 hour)
        
        Returns:
            Presigned URL string
        """
        try:
            if self.storage_type == "minio":
                from datetime import datetime, timedelta
                expiry = timedelta(seconds=expires_in)
                url = self.client.presigned_get_object(
                    self.bucket_name,
                    object_key,
                    expires=expiry
                )
                return url
            elif self.storage_type == "s3":
                url = self.client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': self.bucket_name,
                        'Key': object_key
                    },
                    ExpiresIn=expires_in
                )
                return url
        except (S3Error, ClientError) as e:
            raise ValueError(f"Failed to generate presigned URL: {str(e)}")
    
    def file_exists(self, object_key: str) -> bool:
        """
        Check if file exists in storage.
        
        Args:
            object_key: Object key (path) in storage
        
        Returns:
            True if file exists
        """
        try:
            if self.storage_type == "minio":
                self.client.stat_object(self.bucket_name, object_key)
                return True
            elif self.storage_type == "s3":
                self.client.head_object(
                    Bucket=self.bucket_name,
                    Key=object_key
                )
                return True
        except (S3Error, ClientError):
            return False


def get_storage() -> EvidenceStorage:
    """
    Get evidence storage instance.
    
    Usage:
        storage = get_storage()
        object_key = storage.generate_object_key(tenant_id, verification_id, filename)
        storage.upload_file(file_data, object_key, content_type)
        file_data = storage.download_file(object_key)
    """
    return EvidenceStorage()

