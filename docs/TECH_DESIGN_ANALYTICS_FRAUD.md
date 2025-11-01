# Analytics & Fraud Detection Technical Design

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: ❌ Missing - Critical Implementation Required  

## Overview

This document outlines the implementation of analytics and fraud detection capabilities for the Fayda ID Checker, including event tracking, anomaly detection, and risk scoring.

## Current State Analysis

### Missing Components
- **Event Tracking**: ❌ No analytics event model
- **Fraud Detection**: ❌ No anomaly detection rules
- **Risk Scoring**: ❌ No risk assessment algorithms
- **Analytics Dashboard**: ❌ No reporting capabilities
- **Real-time Monitoring**: ❌ No live monitoring

### Existing Foundation
- **Audit Events**: ✅ Basic audit logging exists
- **Multi-tenancy**: ✅ Tenant isolation for analytics
- **Database**: ✅ PostgreSQL ready for analytics

## Solution Architecture

### Analytics Event Model

#### Event Schema Design
```python
# app/models/analytics_event.py
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class AnalyticsEvent(Base):
    __tablename__ = "analytics_event"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False)
    
    # Event details
    event_type = Column(String, nullable=False)  # verification_started, verification_completed, payment_attempted, etc.
    event_category = Column(String, nullable=False)  # user_action, system_event, security_event, business_event
    
    # Actor information
    actor_id = Column(UUID(as_uuid=True), nullable=True)  # User who performed the action
    actor_type = Column(String, nullable=True)  # user, system, api
    
    # Target information
    target_id = Column(String, nullable=True)  # ID of the target object
    target_type = Column(String, nullable=True)  # verification, payment, user, etc.
    
    # Event data
    event_data = Column(JSONB, default={})  # Additional event-specific data
    metadata = Column(JSONB, default={})  # Device info, location, etc.
    
    # Risk and fraud indicators
    risk_score = Column(Float, default=0.0)  # Calculated risk score
    fraud_indicators = Column(JSONB, default=[])  # List of fraud indicators
    is_suspicious = Column(Boolean, default=False)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="analytics_events")
```

#### Fraud Alert Model
```python
# app/models/fraud_alert.py
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class FraudAlert(Base):
    __tablename__ = "fraud_alert"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False)
    
    # Alert details
    alert_type = Column(String, nullable=False)  # duplicate_id, suspicious_pattern, velocity_alert, etc.
    alert_severity = Column(String, nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    alert_status = Column(String, default="open")  # open, investigating, resolved, false_positive
    
    # Trigger information
    triggered_by_event_id = Column(UUID(as_uuid=True), ForeignKey("analytics_event.id"), nullable=True)
    trigger_conditions = Column(JSONB, default={})  # Conditions that triggered the alert
    
    # Risk assessment
    risk_score = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.0)  # Confidence in the alert
    
    # Investigation details
    assigned_to = Column(UUID(as_uuid=True), nullable=True)  # User assigned to investigate
    investigation_notes = Column(String, nullable=True)
    resolution_notes = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="fraud_alerts")
    triggered_by_event = relationship("AnalyticsEvent")
```

### Analytics Service

#### Core Analytics Service
```python
# app/services/analytics_service.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.models.analytics_event import AnalyticsEvent
from app.models.fraud_alert import FraudAlert
from app.models.verification import Verification
from app.models.user import User
import datetime

class AnalyticsService:
    """Service for analytics and event tracking"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def track_event(self, tenant_id: str, event_type: str, event_category: str,
                   actor_id: Optional[str] = None, actor_type: Optional[str] = None,
                   target_id: Optional[str] = None, target_type: Optional[str] = None,
                   event_data: Optional[Dict] = None, metadata: Optional[Dict] = None) -> AnalyticsEvent:
        """Track analytics event"""
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(tenant_id, event_type, event_data, metadata)
        
        # Check for fraud indicators
        fraud_indicators = self._detect_fraud_indicators(tenant_id, event_type, event_data, metadata)
        is_suspicious = len(fraud_indicators) > 0
        
        # Create analytics event
        event = AnalyticsEvent(
            tenant_id=tenant_id,
            event_type=event_type,
            event_category=event_category,
            actor_id=actor_id,
            actor_type=actor_type,
            target_id=target_id,
            target_type=target_type,
            event_data=event_data or {},
            metadata=metadata or {},
            risk_score=risk_score,
            fraud_indicators=fraud_indicators,
            is_suspicious=is_suspicious
        )
        
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        
        # Check for fraud alerts
        if is_suspicious:
            self._check_fraud_alerts(event)
        
        return event
    
    def get_tenant_analytics(self, tenant_id: str, start_date: datetime.datetime,
                           end_date: datetime.datetime) -> Dict[str, Any]:
        """Get analytics for tenant"""
        
        # Get event counts by type
        event_counts = self.db.query(
            AnalyticsEvent.event_type,
            func.count(AnalyticsEvent.id).label('count')
        ).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.created_at.between(start_date, end_date)
        ).group_by(AnalyticsEvent.event_type).all()
        
        # Get risk score distribution
        risk_scores = self.db.query(AnalyticsEvent.risk_score).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.created_at.between(start_date, end_date)
        ).all()
        
        # Get suspicious events
        suspicious_events = self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.is_suspicious == True,
            AnalyticsEvent.created_at.between(start_date, end_date)
        ).count()
        
        # Calculate metrics
        total_events = sum(count for _, count in event_counts)
        avg_risk_score = sum(score[0] for score in risk_scores) / len(risk_scores) if risk_scores else 0
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "total_events": total_events,
            "event_counts": dict(event_counts),
            "avg_risk_score": avg_risk_score,
            "suspicious_events": suspicious_events,
            "suspicious_rate": suspicious_events / total_events if total_events > 0 else 0
        }
    
    def _calculate_risk_score(self, tenant_id: str, event_type: str,
                            event_data: Optional[Dict], metadata: Optional[Dict]) -> float:
        """Calculate risk score for event"""
        base_score = 0.0
        
        # Event type risk weights
        event_risk_weights = {
            "verification_started": 1.0,
            "verification_completed": 2.0,
            "payment_attempted": 3.0,
            "payment_failed": 4.0,
            "login_attempt": 1.5,
            "login_failed": 3.0,
            "data_access": 2.5,
            "consent_withdrawn": 1.0
        }
        
        base_score += event_risk_weights.get(event_type, 1.0)
        
        # Device risk factors
        if metadata:
            # New device
            if metadata.get("is_new_device", False):
                base_score += 2.0
            
            # Suspicious location
            if metadata.get("location_risk", "low") in ["medium", "high"]:
                base_score += metadata.get("location_risk_score", 0)
            
            # Suspicious user agent
            if metadata.get("suspicious_user_agent", False):
                base_score += 1.5
        
        # Time-based risk
        current_hour = datetime.datetime.utcnow().hour
        if current_hour < 6 or current_hour > 22:  # Off-hours
            base_score += 1.0
        
        # Velocity risk
        velocity_score = self._calculate_velocity_risk(tenant_id, event_type)
        base_score += velocity_score
        
        return min(base_score, 10.0)  # Cap at 10.0
    
    def _calculate_velocity_risk(self, tenant_id: str, event_type: str) -> float:
        """Calculate velocity-based risk score"""
        # Check events in last hour
        one_hour_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        
        recent_events = self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.event_type == event_type,
            AnalyticsEvent.created_at >= one_hour_ago
        ).count()
        
        # Velocity thresholds
        velocity_thresholds = {
            "verification_started": 10,
            "verification_completed": 5,
            "payment_attempted": 3,
            "login_attempt": 5
        }
        
        threshold = velocity_thresholds.get(event_type, 5)
        
        if recent_events > threshold * 2:
            return 3.0  # High velocity risk
        elif recent_events > threshold:
            return 1.5  # Medium velocity risk
        
        return 0.0
    
    def _detect_fraud_indicators(self, tenant_id: str, event_type: str,
                               event_data: Optional[Dict], metadata: Optional[Dict]) -> List[str]:
        """Detect fraud indicators in event"""
        indicators = []
        
        # Check for duplicate ID
        if event_type == "verification_started" and event_data:
            id_number = event_data.get("id_number")
            if id_number and self._is_duplicate_id(tenant_id, id_number):
                indicators.append("duplicate_id_number")
        
        # Check for suspicious patterns
        if self._is_suspicious_pattern(tenant_id, event_type, event_data, metadata):
            indicators.append("suspicious_pattern")
        
        # Check for velocity violations
        if self._is_velocity_violation(tenant_id, event_type):
            indicators.append("velocity_violation")
        
        # Check for device anomalies
        if metadata and self._is_device_anomaly(tenant_id, metadata):
            indicators.append("device_anomaly")
        
        return indicators
    
    def _is_duplicate_id(self, tenant_id: str, id_number: str) -> bool:
        """Check if ID number has been used recently"""
        # Check for same ID in last 24 hours
        one_day_ago = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        
        recent_verifications = self.db.query(Verification).join(AnalyticsEvent).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.event_type == "verification_started",
            AnalyticsEvent.event_data.contains({"id_number": id_number}),
            AnalyticsEvent.created_at >= one_day_ago
        ).count()
        
        return recent_verifications > 1
    
    def _is_suspicious_pattern(self, tenant_id: str, event_type: str,
                             event_data: Optional[Dict], metadata: Optional[Dict]) -> bool:
        """Check for suspicious patterns"""
        # Implement pattern detection logic
        # This could include:
        # - Unusual timing patterns
        # - Suspicious data combinations
        # - Known fraud patterns
        
        return False  # Placeholder
    
    def _is_velocity_violation(self, tenant_id: str, event_type: str) -> bool:
        """Check for velocity violations"""
        # Check events in last minute
        one_minute_ago = datetime.datetime.utcnow() - datetime.timedelta(minutes=1)
        
        recent_events = self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.event_type == event_type,
            AnalyticsEvent.created_at >= one_minute_ago
        ).count()
        
        # Strict velocity limits
        strict_limits = {
            "verification_started": 3,
            "payment_attempted": 2,
            "login_attempt": 3
        }
        
        return recent_events > strict_limits.get(event_type, 5)
    
    def _is_device_anomaly(self, tenant_id: str, metadata: Dict) -> bool:
        """Check for device anomalies"""
        # Check if device is new for this tenant
        device_id = metadata.get("device_id")
        if not device_id:
            return False
        
        # Check if device has been used before
        existing_events = self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.tenant_id == tenant_id,
            AnalyticsEvent.metadata.contains({"device_id": device_id})
        ).count()
        
        return existing_events == 0
    
    def _check_fraud_alerts(self, event: AnalyticsEvent):
        """Check if event should trigger fraud alerts"""
        alert_rules = [
            self._check_duplicate_id_alert,
            self._check_velocity_alert,
            self._check_pattern_alert,
            self._check_device_alert
        ]
        
        for rule in alert_rules:
            alert = rule(event)
            if alert:
                self.db.add(alert)
        
        self.db.commit()
    
    def _check_duplicate_id_alert(self, event: AnalyticsEvent) -> Optional[FraudAlert]:
        """Check for duplicate ID alert"""
        if "duplicate_id_number" in event.fraud_indicators:
            return FraudAlert(
                tenant_id=event.tenant_id,
                alert_type="duplicate_id",
                alert_severity="HIGH",
                triggered_by_event_id=event.id,
                trigger_conditions={"id_number": event.event_data.get("id_number")},
                risk_score=event.risk_score,
                confidence_score=0.8
            )
        return None
    
    def _check_velocity_alert(self, event: AnalyticsEvent) -> Optional[FraudAlert]:
        """Check for velocity alert"""
        if "velocity_violation" in event.fraud_indicators:
            return FraudAlert(
                tenant_id=event.tenant_id,
                alert_type="velocity_violation",
                alert_severity="MEDIUM",
                triggered_by_event_id=event.id,
                trigger_conditions={"event_type": event.event_type},
                risk_score=event.risk_score,
                confidence_score=0.7
            )
        return None
```

### Fraud Detection Service

#### Advanced Fraud Detection
```python
# app/services/fraud_detection_service.py
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.models.fraud_alert import FraudAlert
from app.models.analytics_event import AnalyticsEvent
from app.models.verification import Verification
import datetime
import json

class FraudDetectionService:
    """Advanced fraud detection service"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def analyze_verification_risk(self, verification_id: str) -> Dict[str, Any]:
        """Analyze risk for a specific verification"""
        
        # Get verification data
        verification = self.db.query(Verification).filter(
            Verification.id == verification_id
        ).first()
        
        if not verification:
            return {"error": "Verification not found"}
        
        # Get all events for this verification
        events = self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.target_id == verification_id
        ).all()
        
        # Calculate risk factors
        risk_factors = {
            "total_events": len(events),
            "suspicious_events": sum(1 for e in events if e.is_suspicious),
            "avg_risk_score": sum(e.risk_score for e in events) / len(events) if events else 0,
            "fraud_indicators": list(set([indicator for e in events for indicator in e.fraud_indicators])),
            "time_pattern": self._analyze_time_pattern(events),
            "device_pattern": self._analyze_device_pattern(events),
            "behavior_pattern": self._analyze_behavior_pattern(events)
        }
        
        # Calculate overall risk score
        overall_risk = self._calculate_overall_risk(risk_factors)
        
        return {
            "verification_id": verification_id,
            "overall_risk_score": overall_risk,
            "risk_level": self._get_risk_level(overall_risk),
            "risk_factors": risk_factors,
            "recommendations": self._get_risk_recommendations(risk_factors)
        }
    
    def get_fraud_alerts(self, tenant_id: str, status: Optional[str] = None,
                        severity: Optional[str] = None, limit: int = 100) -> List[FraudAlert]:
        """Get fraud alerts with filtering"""
        
        query = self.db.query(FraudAlert).filter(FraudAlert.tenant_id == tenant_id)
        
        if status:
            query = query.filter(FraudAlert.alert_status == status)
        
        if severity:
            query = query.filter(FraudAlert.alert_severity == severity)
        
        return query.order_by(FraudAlert.created_at.desc()).limit(limit).all()
    
    def update_alert_status(self, alert_id: str, status: str, notes: Optional[str] = None) -> bool:
        """Update fraud alert status"""
        
        alert = self.db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
        
        if not alert:
            return False
        
        alert.alert_status = status
        alert.investigation_notes = notes
        
        if status == "resolved":
            alert.resolved_at = datetime.datetime.utcnow()
        
        alert.updated_at = datetime.datetime.utcnow()
        
        self.db.commit()
        return True
    
    def get_fraud_statistics(self, tenant_id: str, start_date: datetime.datetime,
                           end_date: datetime.datetime) -> Dict[str, Any]:
        """Get fraud statistics for tenant"""
        
        # Get alert counts by type
        alert_counts = self.db.query(
            FraudAlert.alert_type,
            func.count(FraudAlert.id).label('count')
        ).filter(
            FraudAlert.tenant_id == tenant_id,
            FraudAlert.created_at.between(start_date, end_date)
        ).group_by(FraudAlert.alert_type).all()
        
        # Get alert counts by severity
        severity_counts = self.db.query(
            FraudAlert.alert_severity,
            func.count(FraudAlert.id).label('count')
        ).filter(
            FraudAlert.tenant_id == tenant_id,
            FraudAlert.created_at.between(start_date, end_date)
        ).group_by(FraudAlert.alert_severity).all()
        
        # Get resolution statistics
        resolved_alerts = self.db.query(FraudAlert).filter(
            FraudAlert.tenant_id == tenant_id,
            FraudAlert.alert_status == "resolved",
            FraudAlert.created_at.between(start_date, end_date)
        ).count()
        
        total_alerts = sum(count for _, count in alert_counts)
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "total_alerts": total_alerts,
            "resolved_alerts": resolved_alerts,
            "resolution_rate": resolved_alerts / total_alerts if total_alerts > 0 else 0,
            "alert_counts_by_type": dict(alert_counts),
            "alert_counts_by_severity": dict(severity_counts)
        }
    
    def _analyze_time_pattern(self, events: List[AnalyticsEvent]) -> Dict[str, Any]:
        """Analyze time patterns in events"""
        if not events:
            return {}
        
        # Group events by hour
        hour_counts = {}
        for event in events:
            hour = event.created_at.hour
            hour_counts[hour] = hour_counts.get(hour, 0) + 1
        
        # Check for unusual timing
        unusual_hours = [hour for hour, count in hour_counts.items() 
                        if hour < 6 or hour > 22 and count > 1]
        
        return {
            "hour_distribution": hour_counts,
            "unusual_hours": unusual_hours,
            "is_suspicious_timing": len(unusual_hours) > 0
        }
    
    def _analyze_device_pattern(self, events: List[AnalyticsEvent]) -> Dict[str, Any]:
        """Analyze device patterns in events"""
        if not events:
            return {}
        
        # Extract device information
        devices = []
        for event in events:
            if event.metadata and "device_id" in event.metadata:
                devices.append(event.metadata["device_id"])
        
        unique_devices = set(devices)
        
        return {
            "total_devices": len(unique_devices),
            "device_list": list(unique_devices),
            "is_multiple_devices": len(unique_devices) > 1
        }
    
    def _analyze_behavior_pattern(self, events: List[AnalyticsEvent]) -> Dict[str, Any]:
        """Analyze behavior patterns in events"""
        if not events:
            return {}
        
        # Check for rapid succession of events
        events.sort(key=lambda x: x.created_at)
        
        rapid_events = 0
        for i in range(1, len(events)):
            time_diff = (events[i].created_at - events[i-1].created_at).total_seconds()
            if time_diff < 60:  # Less than 1 minute apart
                rapid_events += 1
        
        return {
            "total_events": len(events),
            "rapid_events": rapid_events,
            "is_rapid_behavior": rapid_events > len(events) * 0.5
        }
    
    def _calculate_overall_risk(self, risk_factors: Dict[str, Any]) -> float:
        """Calculate overall risk score"""
        score = 0.0
        
        # Suspicious events weight
        if risk_factors["suspicious_events"] > 0:
            score += risk_factors["suspicious_events"] * 2.0
        
        # Average risk score weight
        score += risk_factors["avg_risk_score"] * 0.5
        
        # Fraud indicators weight
        score += len(risk_factors["fraud_indicators"]) * 1.5
        
        # Time pattern weight
        if risk_factors["time_pattern"].get("is_suspicious_timing", False):
            score += 2.0
        
        # Device pattern weight
        if risk_factors["device_pattern"].get("is_multiple_devices", False):
            score += 1.5
        
        # Behavior pattern weight
        if risk_factors["behavior_pattern"].get("is_rapid_behavior", False):
            score += 2.0
        
        return min(score, 10.0)  # Cap at 10.0
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Get risk level from score"""
        if risk_score >= 8.0:
            return "CRITICAL"
        elif risk_score >= 6.0:
            return "HIGH"
        elif risk_score >= 4.0:
            return "MEDIUM"
        elif risk_score >= 2.0:
            return "LOW"
        else:
            return "MINIMAL"
    
    def _get_risk_recommendations(self, risk_factors: Dict[str, Any]) -> List[str]:
        """Get recommendations based on risk factors"""
        recommendations = []
        
        if risk_factors["suspicious_events"] > 0:
            recommendations.append("Review suspicious events for potential fraud")
        
        if len(risk_factors["fraud_indicators"]) > 0:
            recommendations.append("Investigate fraud indicators")
        
        if risk_factors["time_pattern"].get("is_suspicious_timing", False):
            recommendations.append("Review off-hours activity")
        
        if risk_factors["device_pattern"].get("is_multiple_devices", False):
            recommendations.append("Verify device ownership")
        
        if risk_factors["behavior_pattern"].get("is_rapid_behavior", False):
            recommendations.append("Review rapid event sequence")
        
        if not recommendations:
            recommendations.append("No immediate action required")
        
        return recommendations
```

### API Endpoints

#### Analytics API
```python
# app/api/endpoints/analytics.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.analytics_service import AnalyticsService
from app.services.fraud_detection_service import FraudDetectionService
from app.deps.tenant import set_tenant_context_for_request
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/events")
async def track_event(
    event_data: dict,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Track analytics event"""
    try:
        analytics_service = AnalyticsService(db)
        event = analytics_service.track_event(
            tenant_id=tenant_id,
            event_type=event_data["event_type"],
            event_category=event_data["event_category"],
            actor_id=event_data.get("actor_id"),
            actor_type=event_data.get("actor_type"),
            target_id=event_data.get("target_id"),
            target_type=event_data.get("target_type"),
            event_data=event_data.get("event_data"),
            metadata=event_data.get("metadata")
        )
        
        return {
            "event_id": str(event.id),
            "risk_score": event.risk_score,
            "is_suspicious": event.is_suspicious,
            "fraud_indicators": event.fraud_indicators
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/overview")
async def get_analytics_overview(
    days: int = Query(30, description="Number of days to analyze"),
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get analytics overview"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    analytics_service = AnalyticsService(db)
    fraud_service = FraudDetectionService(db)
    
    analytics_data = analytics_service.get_tenant_analytics(tenant_id, start_date, end_date)
    fraud_data = fraud_service.get_fraud_statistics(tenant_id, start_date, end_date)
    
    return {
        "analytics": analytics_data,
        "fraud": fraud_data
    }

@router.get("/verifications/{verification_id}/risk")
async def analyze_verification_risk(
    verification_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Analyze risk for specific verification"""
    fraud_service = FraudDetectionService(db)
    risk_analysis = fraud_service.analyze_verification_risk(verification_id)
    
    if "error" in risk_analysis:
        raise HTTPException(status_code=404, detail=risk_analysis["error"])
    
    return risk_analysis

@router.get("/fraud/alerts")
async def get_fraud_alerts(
    status: Optional[str] = Query(None, description="Filter by alert status"),
    severity: Optional[str] = Query(None, description="Filter by alert severity"),
    limit: int = Query(100, description="Maximum number of alerts to return"),
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get fraud alerts"""
    fraud_service = FraudDetectionService(db)
    alerts = fraud_service.get_fraud_alerts(tenant_id, status, severity, limit)
    
    return [
        {
            "id": str(alert.id),
            "alert_type": alert.alert_type,
            "alert_severity": alert.alert_severity,
            "alert_status": alert.alert_status,
            "risk_score": alert.risk_score,
            "created_at": alert.created_at
        } for alert in alerts
    ]

@router.put("/fraud/alerts/{alert_id}")
async def update_alert_status(
    alert_id: str,
    status: str,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Update fraud alert status"""
    fraud_service = FraudDetectionService(db)
    success = fraud_service.update_alert_status(alert_id, status, notes)
    
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": "Alert status updated successfully"}
```

### Real-time Monitoring

#### WebSocket Events
```python
# app/api/endpoints/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

class WebSocketManager:
    """Manage WebSocket connections for real-time monitoring"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, tenant_id: str):
        await websocket.accept()
        
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = []
        
        self.active_connections[tenant_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, tenant_id: str):
        if tenant_id in self.active_connections:
            self.active_connections[tenant_id].remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_to_tenant(self, message: str, tenant_id: str):
        if tenant_id in self.active_connections:
            for connection in self.active_connections[tenant_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Remove dead connections
                    self.active_connections[tenant_id].remove(connection)

manager = WebSocketManager()

@router.websocket("/ws/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await manager.connect(websocket, tenant_id)
    
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            
            # Handle any client messages if needed
            # For now, just echo back
            await manager.send_personal_message(f"Message: {data}", websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)
```

### Dashboard Implementation

#### Analytics Dashboard
```python
# app/api/endpoints/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.analytics_service import AnalyticsService
from app.services.fraud_detection_service import FraudDetectionService
from app.deps.tenant import set_tenant_context_for_request
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard/overview")
async def get_dashboard_overview(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get dashboard overview data"""
    
    # Get data for last 30 days
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    
    analytics_service = AnalyticsService(db)
    fraud_service = FraudDetectionService(db)
    
    # Get analytics data
    analytics_data = analytics_service.get_tenant_analytics(tenant_id, start_date, end_date)
    
    # Get fraud data
    fraud_data = fraud_service.get_fraud_statistics(tenant_id, start_date, end_date)
    
    # Get recent alerts
    recent_alerts = fraud_service.get_fraud_alerts(tenant_id, limit=10)
    
    # Calculate KPIs
    kpis = {
        "total_verifications": analytics_data["event_counts"].get("verification_completed", 0),
        "success_rate": self._calculate_success_rate(analytics_data),
        "avg_risk_score": analytics_data["avg_risk_score"],
        "fraud_rate": analytics_data["suspicious_rate"],
        "alert_resolution_rate": fraud_data["resolution_rate"]
    }
    
    return {
        "kpis": kpis,
        "analytics": analytics_data,
        "fraud": fraud_data,
        "recent_alerts": [
            {
                "id": str(alert.id),
                "type": alert.alert_type,
                "severity": alert.alert_severity,
                "created_at": alert.created_at
            } for alert in recent_alerts
        ]
    }

def _calculate_success_rate(self, analytics_data: Dict) -> float:
    """Calculate verification success rate"""
    completed = analytics_data["event_counts"].get("verification_completed", 0)
    started = analytics_data["event_counts"].get("verification_started", 0)
    
    if started == 0:
        return 0.0
    
    return completed / started
```

## Testing Strategy

### Unit Tests
```python
# tests/test_analytics.py
import pytest
from app.services.analytics_service import AnalyticsService
from app.services.fraud_detection_service import FraudDetectionService

def test_event_tracking(db_session):
    """Test event tracking"""
    analytics_service = AnalyticsService(db_session)
    
    event = analytics_service.track_event(
        tenant_id="tenant-123",
        event_type="verification_started",
        event_category="user_action",
        event_data={"id_number": "123456789"}
    )
    
    assert event.event_type == "verification_started"
    assert event.risk_score >= 0
    assert isinstance(event.fraud_indicators, list)

def test_fraud_detection(db_session):
    """Test fraud detection"""
    fraud_service = FraudDetectionService(db_session)
    
    # Create test events
    analytics_service = AnalyticsService(db_session)
    
    # Track multiple events with same ID (should trigger duplicate alert)
    for i in range(3):
        analytics_service.track_event(
            tenant_id="tenant-123",
            event_type="verification_started",
            event_category="user_action",
            event_data={"id_number": "123456789"}
        )
    
    # Check for fraud alerts
    alerts = fraud_service.get_fraud_alerts("tenant-123")
    assert len(alerts) > 0
```

### Integration Tests
```python
# tests/test_analytics_api.py
def test_analytics_api(client, tenant_user):
    """Test analytics API endpoints"""
    # Track event
    response = client.post(
        "/api/analytics/events",
        json={
            "event_type": "verification_started",
            "event_category": "user_action",
            "event_data": {"id_number": "123456789"}
        },
        headers={"Authorization": f"Bearer {tenant_user.token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "event_id" in data
    assert "risk_score" in data
    
    # Get analytics overview
    response = client.get(
        "/api/analytics/overview?days=7",
        headers={"Authorization": f"Bearer {tenant_user.token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "analytics" in data
    assert "fraud" in data
```

## Implementation Checklist

### Phase 1: Core Analytics
- [ ] Implement analytics event model
- [ ] Create analytics service
- [ ] Add event tracking API
- [ ] Implement basic risk scoring

### Phase 2: Fraud Detection
- [ ] Implement fraud detection service
- [ ] Add fraud alert model
- [ ] Create fraud detection rules
- [ ] Add alert management API

### Phase 3: Advanced Features
- [ ] Implement real-time monitoring
- [ ] Add analytics dashboard
- [ ] Create reporting capabilities
- [ ] Add machine learning integration

### Phase 4: Production Features
- [ ] Performance optimization
- [ ] Add monitoring and alerting
- [ ] Create admin interfaces
- [ ] Documentation and training

## Conclusion

Analytics and fraud detection are **essential** for maintaining security and compliance in KYC operations. The implementation provides comprehensive event tracking, risk assessment, and fraud detection capabilities.

**Next Steps**:
1. Implement analytics event tracking
2. Create fraud detection rules
3. Add real-time monitoring
4. Build analytics dashboard
5. Integrate machine learning
