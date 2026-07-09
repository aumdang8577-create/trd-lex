from fastapi import HTTPException, status
from app.core.database import db
from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.models.enums import Role

MOCK_THAID_CITIZENS = {
    "1123456789012": {"first_name": "สมชาย", "last_name": "ใจดี", "phone_number": "0812345678"},
    "2123456789012": {"first_name": "สมหญิง", "last_name": "รักดี", "phone_number": "0898765432"},
    "3123456789012": {"first_name": "วิชัย", "last_name": "มั่นคง", "phone_number": "0867891234"}
}

class AuthService:
    @staticmethod
    async def login(login_data: LoginRequest) -> TokenResponse:
        thaid_id = login_data.thaid_id
        
        # Validate that it is a 13-digit number string
        if not thaid_id.isdigit() or len(thaid_id) != 13:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น"
            )
            
        # Check if user already exists in local DB
        user = await db.user.find_unique(where={"thaid_id": thaid_id})
        
        if not user:
            # If user does not exist, get details from MOCK or create a new mock citizen
            mock_data = MOCK_THAID_CITIZENS.get(
                thaid_id, 
                {"first_name": "ผู้ใช้จำลอง", "last_name": f"รหัส-{thaid_id[-4:]}", "phone_number": "0800000000"}
            )
            
            # Create user in local DB
            user = await db.user.create(
                data={
                    "thaid_id": thaid_id,
                    "first_name": mock_data["first_name"],
                    "last_name": mock_data["last_name"],
                    "phone_number": mock_data["phone_number"],
                    "role": Role.USER
                }
            )
            
        # Create Access Token
        access_token = create_access_token(data={"sub": user.id})
        
        # Map DB model to UserResponse
        user_response = UserResponse.model_validate(user)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
