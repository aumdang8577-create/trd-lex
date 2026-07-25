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
        resolved_role = Role.INVESTOR

        if db.is_connected():
            try:
                # 1. Check if user is an official admin
                if thaid_id == "9123456789012":
                    resolved_role = Role.ADMIN
                else:
                    # 2. Check if user has active lease contract in the system
                    lease = await db.leasecontract.find_first(
                        where={"lessee_thaid_id": thaid_id, "is_active": True}
                    )
                    if lease:
                        resolved_role = Role.SELLER
                    else:
                        resolved_role = Role.INVESTOR

                user = await db.user.find_unique(where={"thaid_id": thaid_id})
                mock_data = MOCK_THAID_CITIZENS.get(
                    thaid_id, 
                    {"first_name": "ผู้สนใจลงทุน", "last_name": f"รหัส-{thaid_id[-4:]}", "phone_number": "0800000000"}
                )

                if not user:
                    user = await db.user.create(
                        data={
                            "thaid_id": thaid_id,
                            "first_name": mock_data["first_name"],
                            "last_name": mock_data["last_name"],
                            "phone_number": mock_data["phone_number"],
                            "role": resolved_role
                        }
                    )
                else:
                    # Update role if status changed
                    if user.role != resolved_role:
                        user = await db.user.update(
                            where={"id": user.id},
                            data={"role": resolved_role}
                        )

                # 3. If user is an INVESTOR, ensure InvestorProfile record exists
                if resolved_role == Role.INVESTOR:
                    try:
                        investor_profile = await db.investorprofile.find_unique(
                            where={"userId": user.id}
                        )
                        if not investor_profile:
                            await db.investorprofile.create(
                                data={
                                    "userId": user.id,
                                    "interests": ["พาณิชยกรรม", "ที่อยู่อาศัย"],
                                    "note": "ผู้ลงทะเบียนใหม่ในฐานะผู้สนใจลงทุนผ่านระบบ ThaID"
                                }
                            )
                    except Exception as inv_err:
                        print(f"Warning: Failed to create InvestorProfile: {inv_err}")

            except Exception as db_err:
                print(f"Warning: Database query fallback applied: {db_err}")

        # Fallback if DB is unavailable
        if not user:
            if thaid_id == "9123456789012":
                resolved_role = Role.ADMIN
            elif thaid_id in ["1123456789012", "2123456789012"]:
                resolved_role = Role.SELLER
            else:
                resolved_role = Role.INVESTOR

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
                    role=resolved_role
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
