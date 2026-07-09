from fastapi import APIRouter, Depends
from app.schemas.contract import ValidateContractRequest, ValidateContractResponse
from app.services.contract_service import ContractService
from app.core.security import get_current_user
from prisma.models import User

router = APIRouter(prefix="/contracts", tags=["Lease Contracts"])

@router.post("/validate", response_model=ValidateContractResponse)
async def validate_contract(
    request: ValidateContractRequest,
    current_user: User = Depends(get_current_user)
):
    """
    ตรวจสอบความถูกต้องของสัญญาเช่าที่ราชพัสดุและกรรมสิทธิ์สำหรับผู้ใช้ปัจจุบัน
    """
    return await ContractService.validate_contract(request.contract_number, current_user)
