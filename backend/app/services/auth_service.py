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
            
        # Ensure Prisma is connected
        if not db.is_connected():
            try:
                await db.connect()
            except Exception:
                pass

        user = None
        if db.is_connected():
            try:
                user = await db.user.find_unique(where={"thaid_id": thaid_id})
                if not user:
                    mock_data = MOCK_THAID_CITIZENS.get(
                        thaid_id, 
                        {"first_name": "ผู้ใช้จำลอง", "last_name": f"รหัส-{thaid_id[-4:]}", "phone_number": "0800000000"}
                    )
                    user = await db.user.create(
                        data={
                            "thaid_id": thaid_id,
                            "first_name": mock_data["first_name"],
                            "last_name": mock_data["last_name"],
                            "phone_number": mock_data["phone_number"],
                            "role": Role.ADMIN if thaid_id == "9123456789012" else Role.USER
                        }
                    )
            except Exception as db_err:
                print(f"Warning: Database query fallback applied: {db_err}")

        # Fallback if DB is unavailable
        if not user:
            mock_data = MOCK_THAID_CITIZENS.get(
                thaid_id, 
                {"first_name": "ผู้ใช้จำลอง", "last_name": f"รหัส-{thaid_id[-4:]}", "phone_number": "0800000000"}
            )
            user_id = f"mock-{thaid_id}"
            access_token = create_access_token(data={"sub": user_id})
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=UserResponse(
                    id=user_id,
                    thaid_id=thaid_id,
                    first_name=mock_data["first_name"],
                    last_name=mock_data["last_name"],
                    phone_number=mock_data["phone_number"],
                    role=Role.ADMIN if thaid_id == "9123456789012" else Role.USER
                )
            )

        # Create Access Token for DB user
        access_token = create_access_token(data={"sub": user.id})
        user_response = UserResponse.model_validate(user)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
