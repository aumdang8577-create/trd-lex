from fastapi import HTTPException, status
from app.core.database import db
from app.schemas.contract import ValidateContractResponse, ContractDataResponse
from prisma.models import User

class ContractService:
    @staticmethod
    async def validate_contract(contract_number: str, current_user: User) -> ValidateContractResponse:
        # Search for contract in DB
        contract = await db.leasecontract.find_unique(
            where={"contract_number": contract_number}
        )
        
        if not contract:
            return ValidateContractResponse(
                is_valid=False,
                message="ไม่พบข้อมูลสัญญาเช่าที่ระบุในระบบของกรมธนารักษ์"
            )
            
        if not contract.is_active:
            return ValidateContractResponse(
                is_valid=False,
                message="สัญญาเช่าถูกระงับการใช้งาน หรือสิ้นสุดอายุสัญญาแล้ว"
            )
            
        if contract.lessee_thaid_id != current_user.thaid_id:
            return ValidateContractResponse(
                is_valid=False,
                message="สัญญานี้ไม่ได้ลงทะเบียนภายใต้เลขบัตรประชาชนของคุณ"
            )
            
        # Map to response schema
        contract_data = ContractDataResponse.model_validate(contract)
        
        return ValidateContractResponse(
            is_valid=True,
            message="พบข้อมูลสัญญาเช่าและคุณเป็นเจ้าของสิทธิ์ สามารถลงประกาศได้",
            contract_data=contract_data
        )
