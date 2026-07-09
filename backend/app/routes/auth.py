from fastapi import APIRouter, Depends
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """
    จำลองการเข้าสู่ระบบผ่าน ThaID ด้วยเลขบัตรประชาชน 13 หลัก
    """
    return await AuthService.login(login_data)
