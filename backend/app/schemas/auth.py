from pydantic import BaseModel, Field
from app.models.enums import Role

class LoginRequest(BaseModel):
    thaid_id: str = Field(..., min_length=13, max_length=13, description="เลขบัตรประชาชน 13 หลัก (ThaID)")

class UserResponse(BaseModel):
    id: str
    thaid_id: str
    first_name: str
    last_name: str
    phone_number: str | None = None
    role: Role

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
