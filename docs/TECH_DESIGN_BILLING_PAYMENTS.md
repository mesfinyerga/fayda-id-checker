# Billing & Payments Technical Design

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: 🟡 Partial - Basic Payment Model Exists  

## Overview

This document outlines the implementation of a comprehensive billing and payment system for the Fayda ID Checker, including subscription management, usage metering, and integration with Ethiopian payment gateways (Telebirr and Chapa).

## Current State Analysis

### Existing Implementation
- **Basic Payment Model**: ✅ `fayda_backend/app/models/payment.py:8-22` - Simple payment tracking
- **Payment CRUD**: ✅ `fayda_backend/app/crud/payment.py:1-26` - Basic payment operations
- **Payment API**: ✅ `fayda_backend/app/api/endpoints/payment.py:1-28` - Simple payment endpoints

### Missing Components
- **Subscription Management**: ❌ No subscription model or lifecycle
- **Usage Metering**: ❌ No verification completion tracking
- **Payment Gateways**: ❌ No Telebirr/Chapa integration
- **Invoice Management**: ❌ No invoice generation or VAT handling
- **Plan Management**: ❌ No pricing plans or feature limits

## Solution Architecture

### Database Schema Design

#### Core Billing Tables
```sql
-- Plans and pricing
CREATE TABLE plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    verification_limit_monthly INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '{}',
    status VARCHAR NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    plan_id UUID NOT NULL REFERENCES plan(id),
    status VARCHAR NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    subscription_id UUID REFERENCES subscription(id),
    verification_id UUID NOT NULL REFERENCES verification(id),
    event_type VARCHAR NOT NULL, -- verification_completed, api_call, etc.
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    subscription_id UUID REFERENCES subscription(id),
    invoice_number VARCHAR NOT NULL UNIQUE,
    status VARCHAR NOT NULL DEFAULT 'draft', -- draft, open, paid, void, uncollectible
    amount_subtotal DECIMAL(10,2) NOT NULL,
    amount_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_total DECIMAL(10,2) NOT NULL,
    currency VARCHAR NOT NULL DEFAULT 'ETB',
    due_date TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    vat_number VARCHAR, -- ERCA VAT number
    billing_address JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice items
CREATE TABLE invoice_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoice(id),
    description VARCHAR NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 15.00, -- Ethiopian VAT rate
    vat_amount DECIMAL(10,2) DEFAULT 0,
    usage_event_id UUID REFERENCES usage_event(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced payment tracking
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    invoice_id UUID REFERENCES invoice(id),
    subscription_id UUID REFERENCES subscription(id),
    payment_method VARCHAR NOT NULL, -- telebirr, chapa, card, bank_transfer
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR NOT NULL DEFAULT 'ETB',
    status VARCHAR NOT NULL, -- pending, completed, failed, refunded
    gateway_reference VARCHAR, -- External payment gateway reference
    gateway_response JSONB, -- Full gateway response
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Configuration
```bash
# .env
# Billing Configuration
BILLING_CURRENCY=ETB
BILLING_VAT_RATE=15.00
BILLING_INVOICE_PREFIX=FAYDA
BILLING_DUE_DAYS=30

# Telebirr Configuration
TELEBIRR_API_URL=https://api.telebirr.et
TELEBIRR_APP_ID=your-telebirr-app-id
TELEBIRR_APP_KEY=your-telebirr-app-key
TELEBIRR_PUBLIC_KEY=your-telebirr-public-key
TELEBIRR_CALLBACK_URL=https://your-domain.com/api/webhooks/telebirr

# Chapa Configuration
CHAPA_API_URL=https://api.chapa.co
CHAPA_SECRET_KEY=your-chapa-secret-key
CHAPA_PUBLIC_KEY=your-chapa-public-key
CHAPA_CALLBACK_URL=https://your-domain.com/api/webhooks/chapa

# Webhook Security
WEBHOOK_SECRET=your-webhook-secret-key
```

## Implementation Design

### Core Billing Service
```python
# app/services/billing_service.py
from decimal import Decimal
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.plan import Plan
from app.models.subscription import Subscription
from app.models.usage_event import UsageEvent
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.core.config import settings

class BillingService:
    """Core billing service for subscription and usage management"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_subscription(self, tenant_id: str, plan_id: str, 
                          start_date: Optional[datetime] = None) -> Subscription:
        """Create new subscription"""
        plan = self.db.query(Plan).filter(Plan.id == plan_id).first()
        if not plan:
            raise ValueError("Plan not found")
        
        start_date = start_date or datetime.utcnow()
        end_date = start_date + timedelta(days=30)  # Monthly billing
        
        subscription = Subscription(
            tenant_id=tenant_id,
            plan_id=plan_id,
            current_period_start=start_date,
            current_period_end=end_date,
            status="active"
        )
        
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription
    
    def track_usage(self, tenant_id: str, verification_id: str, 
                   event_type: str = "verification_completed",
                   quantity: int = 1) -> UsageEvent:
        """Track usage for billing"""
        # Get active subscription
        subscription = self.db.query(Subscription).filter(
            Subscription.tenant_id == tenant_id,
            Subscription.status == "active"
        ).first()
        
        if not subscription:
            raise ValueError("No active subscription found")
        
        # Get plan pricing
        plan = subscription.plan
        unit_price = plan.price_monthly / plan.verification_limit_monthly
        
        # Check usage limits
        current_usage = self.get_current_month_usage(tenant_id)
        if current_usage + quantity > plan.verification_limit_monthly:
            raise ValueError("Usage limit exceeded")
        
        # Create usage event
        usage_event = UsageEvent(
            tenant_id=tenant_id,
            subscription_id=subscription.id,
            verification_id=verification_id,
            event_type=event_type,
            quantity=quantity,
            unit_price=unit_price,
            total_amount=unit_price * quantity
        )
        
        self.db.add(usage_event)
        self.db.commit()
        self.db.refresh(usage_event)
        
        return usage_event
    
    def get_current_month_usage(self, tenant_id: str) -> int:
        """Get current month usage for tenant"""
        start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
        
        usage = self.db.query(UsageEvent).filter(
            UsageEvent.tenant_id == tenant_id,
            UsageEvent.created_at >= start_of_month
        ).all()
        
        return sum(event.quantity for event in usage)
    
    def generate_invoice(self, tenant_id: str, 
                        period_start: datetime,
                        period_end: datetime) -> Invoice:
        """Generate invoice for billing period"""
        # Get usage events for period
        usage_events = self.db.query(UsageEvent).filter(
            UsageEvent.tenant_id == tenant_id,
            UsageEvent.created_at >= period_start,
            UsageEvent.created_at <= period_end
        ).all()
        
        if not usage_events:
            raise ValueError("No usage events found for period")
        
        # Calculate totals
        subtotal = sum(event.total_amount for event in usage_events)
        vat_amount = subtotal * (settings.billing_vat_rate / 100)
        total = subtotal + vat_amount
        
        # Generate invoice number
        invoice_number = self._generate_invoice_number()
        
        # Create invoice
        invoice = Invoice(
            tenant_id=tenant_id,
            invoice_number=invoice_number,
            amount_subtotal=subtotal,
            amount_tax=vat_amount,
            amount_total=total,
            due_date=datetime.utcnow() + timedelta(days=settings.billing_due_days)
        )
        
        self.db.add(invoice)
        self.db.commit()
        self.db.refresh(invoice)
        
        # Create invoice items
        for event in usage_events:
            item = InvoiceItem(
                invoice_id=invoice.id,
                description=f"{event.event_type} - {event.verification_id}",
                quantity=event.quantity,
                unit_price=event.unit_price,
                amount=event.total_amount,
                vat_amount=event.total_amount * (settings.billing_vat_rate / 100),
                usage_event_id=event.id
            )
            self.db.add(item)
        
        self.db.commit()
        return invoice
    
    def _generate_invoice_number(self) -> str:
        """Generate unique invoice number"""
        import uuid
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        unique_id = str(uuid.uuid4())[:8]
        return f"{settings.billing_invoice_prefix}-{timestamp}-{unique_id}"
```

### Payment Gateway Integration

#### Telebirr Integration
```python
# app/integrations/telebirr.py
import hashlib
import hmac
import json
import requests
from typing import Dict, Any
from app.core.config import settings

class TelebirrGateway:
    """Telebirr payment gateway integration"""
    
    def __init__(self):
        self.api_url = settings.telebirr_api_url
        self.app_id = settings.telebirr_app_id
        self.app_key = settings.telebirr_app_key
        self.public_key = settings.telebirr_public_key
    
    def create_payment(self, amount: float, reference: str, 
                      customer_phone: str, description: str) -> Dict[str, Any]:
        """Create Telebirr payment request"""
        payload = {
            "appId": self.app_id,
            "appKey": self.app_key,
            "outTradeNo": reference,
            "totalAmount": str(amount),
            "subject": description,
            "notifyUrl": settings.telebirr_callback_url,
            "returnUrl": f"{settings.frontend_url}/payment/success",
            "customerPhone": customer_phone,
            "timeoutExpress": "30m"
        }
        
        # Generate signature
        signature = self._generate_signature(payload)
        payload["sign"] = signature
        
        try:
            response = requests.post(
                f"{self.api_url}/v1/payment",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("code") == "0000":
                return {
                    "success": True,
                    "payment_url": result["data"]["paymentUrl"],
                    "transaction_id": result["data"]["transactionId"],
                    "reference": reference
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment creation failed")
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def verify_payment(self, transaction_id: str, signature: str) -> Dict[str, Any]:
        """Verify Telebirr payment"""
        payload = {
            "appId": self.app_id,
            "transactionId": transaction_id
        }
        
        # Verify signature
        expected_signature = self._generate_signature(payload)
        if not hmac.compare_digest(signature, expected_signature):
            return {
                "success": False,
                "error": "Invalid signature"
            }
        
        try:
            response = requests.post(
                f"{self.api_url}/v1/payment/query",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("code") == "0000":
                payment_data = result["data"]
                return {
                    "success": True,
                    "status": payment_data.get("status"),
                    "amount": payment_data.get("totalAmount"),
                    "reference": payment_data.get("outTradeNo")
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment verification failed")
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _generate_signature(self, payload: Dict[str, Any]) -> str:
        """Generate HMAC signature for Telebirr"""
        # Sort payload by key
        sorted_payload = dict(sorted(payload.items()))
        
        # Create signature string
        signature_string = "&".join([
            f"{key}={value}" for key, value in sorted_payload.items()
            if value is not None and value != ""
        ])
        
        # Generate HMAC signature
        signature = hmac.new(
            self.app_key.encode('utf-8'),
            signature_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature
```

#### Chapa Integration
```python
# app/integrations/chapa.py
import requests
from typing import Dict, Any
from app.core.config import settings

class ChapaGateway:
    """Chapa payment gateway integration"""
    
    def __init__(self):
        self.api_url = settings.chapa_api_url
        self.secret_key = settings.chapa_secret_key
        self.public_key = settings.chapa_public_key
    
    def create_payment(self, amount: float, reference: str, 
                      customer_email: str, description: str) -> Dict[str, Any]:
        """Create Chapa payment request"""
        payload = {
            "amount": str(amount),
            "currency": "ETB",
            "email": customer_email,
            "first_name": "Customer",
            "last_name": "Name",
            "tx_ref": reference,
            "callback_url": settings.chapa_callback_url,
            "return_url": f"{settings.frontend_url}/payment/success",
            "customization": {
                "title": "Fayda ID Checker Payment",
                "description": description
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/v1/transaction/initialize",
                json=payload,
                headers={
                    "Authorization": f"Bearer {self.secret_key}",
                    "Content-Type": "application/json"
                }
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("status") == "success":
                return {
                    "success": True,
                    "payment_url": result["data"]["checkout_url"],
                    "transaction_id": result["data"]["reference"],
                    "reference": reference
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment creation failed")
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify Chapa payment"""
        try:
            response = requests.get(
                f"{self.api_url}/v1/transaction/verify/{transaction_id}",
                headers={
                    "Authorization": f"Bearer {self.secret_key}",
                    "Content-Type": "application/json"
                }
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("status") == "success":
                payment_data = result["data"]
                return {
                    "success": True,
                    "status": payment_data.get("status"),
                    "amount": payment_data.get("amount"),
                    "reference": payment_data.get("tx_ref")
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment verification failed")
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
```

### Payment Service
```python
# app/services/payment_service.py
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.models.invoice import Invoice
from app.integrations.telebirr import TelebirrGateway
from app.integrations.chapa import ChapaGateway
from app.core.config import settings

class PaymentService:
    """Payment processing service"""
    
    def __init__(self, db: Session):
        self.db = db
        self.telebirr = TelebirrGateway()
        self.chapa = ChapaGateway()
    
    def create_payment(self, invoice_id: str, payment_method: str,
                      customer_phone: Optional[str] = None,
                      customer_email: Optional[str] = None) -> Dict[str, Any]:
        """Create payment for invoice"""
        # Get invoice
        invoice = self.db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            raise ValueError("Invoice not found")
        
        # Create payment record
        payment = Payment(
            tenant_id=invoice.tenant_id,
            invoice_id=invoice_id,
            payment_method=payment_method,
            amount=invoice.amount_total,
            currency=invoice.currency,
            status="pending"
        )
        
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        
        # Process payment based on method
        if payment_method == "telebirr":
            if not customer_phone:
                raise ValueError("Phone number required for Telebirr")
            
            result = self.telebirr.create_payment(
                amount=float(payment.amount),
                reference=payment.id,
                customer_phone=customer_phone,
                description=f"Invoice {invoice.invoice_number}"
            )
        
        elif payment_method == "chapa":
            if not customer_email:
                raise ValueError("Email required for Chapa")
            
            result = self.chapa.create_payment(
                amount=float(payment.amount),
                reference=payment.id,
                customer_email=customer_email,
                description=f"Invoice {invoice.invoice_number}"
            )
        
        else:
            raise ValueError(f"Unsupported payment method: {payment_method}")
        
        if result["success"]:
            # Update payment with gateway details
            payment.gateway_reference = result["transaction_id"]
            payment.gateway_response = result
            self.db.commit()
            
            return {
                "success": True,
                "payment_id": str(payment.id),
                "payment_url": result["payment_url"],
                "reference": result["reference"]
            }
        else:
            # Update payment status
            payment.status = "failed"
            payment.gateway_response = result
            self.db.commit()
            
            return {
                "success": False,
                "error": result["error"]
            }
    
    def process_webhook(self, payment_method: str, payload: Dict[str, Any],
                       signature: Optional[str] = None) -> bool:
        """Process payment webhook"""
        if payment_method == "telebirr":
            return self._process_telebirr_webhook(payload, signature)
        elif payment_method == "chapa":
            return self._process_chapa_webhook(payload)
        else:
            raise ValueError(f"Unsupported payment method: {payment_method}")
    
    def _process_telebirr_webhook(self, payload: Dict[str, Any], 
                                 signature: str) -> bool:
        """Process Telebirr webhook"""
        # Verify signature
        if not self.telebirr._verify_webhook_signature(payload, signature):
            return False
        
        transaction_id = payload.get("transactionId")
        status = payload.get("status")
        
        # Find payment by transaction ID
        payment = self.db.query(Payment).filter(
            Payment.gateway_reference == transaction_id
        ).first()
        
        if not payment:
            return False
        
        # Update payment status
        if status == "SUCCESS":
            payment.status = "completed"
            payment.gateway_response = payload
            
            # Update invoice
            invoice = payment.invoice
            invoice.status = "paid"
            invoice.paid_at = datetime.utcnow()
        
        elif status == "FAILED":
            payment.status = "failed"
            payment.gateway_response = payload
        
        self.db.commit()
        return True
    
    def _process_chapa_webhook(self, payload: Dict[str, Any]) -> bool:
        """Process Chapa webhook"""
        transaction_id = payload.get("tx_ref")
        status = payload.get("status")
        
        # Find payment by transaction ID
        payment = self.db.query(Payment).filter(
            Payment.gateway_reference == transaction_id
        ).first()
        
        if not payment:
            return False
        
        # Update payment status
        if status == "success":
            payment.status = "completed"
            payment.gateway_response = payload
            
            # Update invoice
            invoice = payment.invoice
            invoice.status = "paid"
            invoice.paid_at = datetime.utcnow()
        
        elif status == "failed":
            payment.status = "failed"
            payment.gateway_response = payload
        
        self.db.commit()
        return True
```

### API Endpoints
```python
# app/api/endpoints/billing.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.billing_service import BillingService
from app.services.payment_service import PaymentService
from app.schemas.billing import (
    SubscriptionCreate, SubscriptionOut,
    InvoiceOut, PaymentCreate, PaymentOut
)
from app.deps.tenant import set_tenant_context_for_request

router = APIRouter()

@router.post("/subscriptions", response_model=SubscriptionOut)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Create new subscription"""
    try:
        billing_service = BillingService(db)
        subscription = billing_service.create_subscription(
            tenant_id, subscription_data.plan_id
        )
        
        return SubscriptionOut(
            id=str(subscription.id),
            plan_id=str(subscription.plan_id),
            status=subscription.status,
            current_period_start=subscription.current_period_start,
            current_period_end=subscription.current_period_end
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subscriptions/current", response_model=SubscriptionOut)
async def get_current_subscription(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get current subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.tenant_id == tenant_id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription")
    
    return SubscriptionOut(
        id=str(subscription.id),
        plan_id=str(subscription.plan_id),
        status=subscription.status,
        current_period_start=subscription.current_period_start,
        current_period_end=subscription.current_period_end
    )

@router.get("/usage/current")
async def get_current_usage(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get current month usage"""
    billing_service = BillingService(db)
    usage = billing_service.get_current_month_usage(tenant_id)
    
    # Get subscription limits
    subscription = db.query(Subscription).filter(
        Subscription.tenant_id == tenant_id,
        Subscription.status == "active"
    ).first()
    
    if subscription:
        limit = subscription.plan.verification_limit_monthly
        remaining = max(0, limit - usage)
    else:
        limit = 0
        remaining = 0
    
    return {
        "current_usage": usage,
        "monthly_limit": limit,
        "remaining": remaining
    }

@router.post("/invoices/{invoice_id}/pay", response_model=PaymentOut)
async def create_payment(
    invoice_id: str,
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Create payment for invoice"""
    try:
        payment_service = PaymentService(db)
        result = payment_service.create_payment(
            invoice_id=invoice_id,
            payment_method=payment_data.payment_method,
            customer_phone=payment_data.customer_phone,
            customer_email=payment_data.customer_email
        )
        
        if result["success"]:
            return PaymentOut(
                payment_id=result["payment_id"],
                payment_url=result["payment_url"],
                reference=result["reference"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/invoices", response_model=list[InvoiceOut])
async def list_invoices(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """List tenant invoices"""
    invoices = db.query(Invoice).filter(
        Invoice.tenant_id == tenant_id
    ).order_by(Invoice.created_at.desc()).all()
    
    return [
        InvoiceOut(
            id=str(invoice.id),
            invoice_number=invoice.invoice_number,
            status=invoice.status,
            amount_total=invoice.amount_total,
            due_date=invoice.due_date,
            created_at=invoice.created_at
        ) for invoice in invoices
    ]
```

### Webhook Endpoints
```python
# app/api/endpoints/webhooks.py
from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.payment_service import PaymentService
from app.db.session import get_db
import hmac
import hashlib

router = APIRouter()

@router.post("/telebirr")
async def telebirr_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Telebirr payment webhook"""
    # Get request body
    payload = await request.json()
    
    # Get signature from headers
    signature = request.headers.get("X-Telebirr-Signature")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature")
    
    # Process webhook
    payment_service = PaymentService(db)
    success = payment_service.process_webhook("telebirr", payload, signature)
    
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Webhook processing failed")

@router.post("/chapa")
async def chapa_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Chapa payment webhook"""
    # Get request body
    payload = await request.json()
    
    # Verify webhook signature
    signature = request.headers.get("Chapa-Signature")
    if signature:
        # Verify signature if provided
        expected_signature = hmac.new(
            settings.webhook_secret.encode(),
            await request.body(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Process webhook
    payment_service = PaymentService(db)
    success = payment_service.process_webhook("chapa", payload)
    
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Webhook processing failed")
```

## ERCA VAT Compliance

### VAT Calculation Service
```python
# app/services/vat_service.py
from decimal import Decimal
from app.core.config import settings

class VATService:
    """ERCA VAT compliance service"""
    
    @staticmethod
    def calculate_vat(amount: Decimal, vat_rate: Decimal = None) -> Decimal:
        """Calculate VAT amount"""
        if vat_rate is None:
            vat_rate = Decimal(str(settings.billing_vat_rate))
        
        return amount * (vat_rate / Decimal("100"))
    
    @staticmethod
    def format_vat_number(vat_number: str) -> str:
        """Format VAT number for ERCA compliance"""
        # Remove spaces and special characters
        cleaned = "".join(c for c in vat_number if c.isalnum())
        
        # Ensure proper format (ET + 9 digits)
        if not cleaned.startswith("ET"):
            cleaned = "ET" + cleaned
        
        return cleaned
    
    @staticmethod
    def generate_vat_report(tenant_id: str, start_date: datetime,
                          end_date: datetime) -> dict:
        """Generate VAT report for ERCA"""
        # Get invoices for period
        invoices = db.query(Invoice).filter(
            Invoice.tenant_id == tenant_id,
            Invoice.created_at >= start_date,
            Invoice.created_at <= end_date,
            Invoice.status == "paid"
        ).all()
        
        total_sales = sum(invoice.amount_subtotal for invoice in invoices)
        total_vat = sum(invoice.amount_tax for invoice in invoices)
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "total_sales": total_sales,
            "total_vat": total_vat,
            "invoice_count": len(invoices),
            "vat_rate": settings.billing_vat_rate
        }
```

## Automated Billing Jobs

### Monthly Billing Job
```python
# app/jobs/billing_jobs.py
from celery import Celery
from datetime import datetime, timedelta
from app.services.billing_service import BillingService
from app.db.session import SessionLocal

celery = Celery('billing')

@celery.task
def generate_monthly_invoices():
    """Generate monthly invoices for all tenants"""
    db = SessionLocal()
    billing_service = BillingService(db)
    
    try:
        # Get all active subscriptions
        subscriptions = db.query(Subscription).filter(
            Subscription.status == "active"
        ).all()
        
        for subscription in subscriptions:
            try:
                # Generate invoice for subscription period
                invoice = billing_service.generate_invoice(
                    subscription.tenant_id,
                    subscription.current_period_start,
                    subscription.current_period_end
                )
                
                print(f"Generated invoice {invoice.invoice_number} for tenant {subscription.tenant_id}")
                
            except Exception as e:
                print(f"Failed to generate invoice for tenant {subscription.tenant_id}: {e}")
        
    finally:
        db.close()

@celery.task
def process_overdue_invoices():
    """Process overdue invoices"""
    db = SessionLocal()
    
    try:
        # Find overdue invoices
        overdue_date = datetime.utcnow() - timedelta(days=settings.billing_due_days)
        overdue_invoices = db.query(Invoice).filter(
            Invoice.status == "open",
            Invoice.due_date < overdue_date
        ).all()
        
        for invoice in overdue_invoices:
            # Update status to overdue
            invoice.status = "overdue"
            
            # Send reminder notification
            # TODO: Implement notification service
        
        db.commit()
        
    finally:
        db.close()
```

## Testing Strategy

### Unit Tests
```python
# tests/test_billing.py
import pytest
from decimal import Decimal
from app.services.billing_service import BillingService
from app.services.payment_service import PaymentService

def test_usage_tracking(db_session):
    """Test usage tracking"""
    billing_service = BillingService(db_session)
    
    # Create subscription
    subscription = billing_service.create_subscription("tenant-123", "plan-456")
    
    # Track usage
    usage = billing_service.track_usage("tenant-123", "verification-789")
    
    assert usage.tenant_id == "tenant-123"
    assert usage.quantity == 1
    assert usage.total_amount > 0

def test_invoice_generation(db_session):
    """Test invoice generation"""
    billing_service = BillingService(db_session)
    
    # Generate invoice
    invoice = billing_service.generate_invoice(
        "tenant-123",
        datetime.utcnow() - timedelta(days=30),
        datetime.utcnow()
    )
    
    assert invoice.tenant_id == "tenant-123"
    assert invoice.amount_total > 0
    assert invoice.amount_tax > 0
```

### Integration Tests
```python
# tests/test_payment_gateways.py
def test_telebirr_payment_creation():
    """Test Telebirr payment creation"""
    telebirr = TelebirrGateway()
    
    result = telebirr.create_payment(
        amount=100.0,
        reference="test-ref",
        customer_phone="+251911234567",
        description="Test payment"
    )
    
    assert result["success"] is True
    assert "payment_url" in result
    assert "transaction_id" in result

def test_chapa_payment_creation():
    """Test Chapa payment creation"""
    chapa = ChapaGateway()
    
    result = chapa.create_payment(
        amount=100.0,
        reference="test-ref",
        customer_email="test@example.com",
        description="Test payment"
    )
    
    assert result["success"] is True
    assert "payment_url" in result
    assert "transaction_id" in result
```

## Implementation Checklist

### Phase 1: Core Billing
- [ ] Implement database schema for billing tables
- [ ] Create BillingService for subscription and usage management
- [ ] Add API endpoints for subscription management
- [ ] Implement usage tracking and limits

### Phase 2: Payment Gateways
- [ ] Integrate Telebirr payment gateway
- [ ] Integrate Chapa payment gateway
- [ ] Implement webhook processing
- [ ] Add payment verification and security

### Phase 3: Invoice Management
- [ ] Implement invoice generation
- [ ] Add ERCA VAT compliance
- [ ] Create invoice PDF generation
- [ ] Set up automated billing jobs

### Phase 4: Production Features
- [ ] Add comprehensive error handling
- [ ] Implement retry mechanisms
- [ ] Set up monitoring and alerting
- [ ] Create compliance reporting

## Conclusion

The comprehensive billing and payment system provides enterprise-grade subscription management, usage tracking, and Ethiopian payment gateway integration. The system ensures ERCA VAT compliance and supports automated billing processes.

**Next Steps**:
1. Implement core billing database schema
2. Set up Telebirr and Chapa integrations
3. Create subscription and usage management
4. Add invoice generation and VAT compliance
5. Deploy automated billing jobs
