from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class AuthResponse(BaseModel):
    user_id: str
    email: str
    first_name: str
    last_name: str
    access_token: str
    refresh_token: str


class LogoutResponse(BaseModel):
    message: str
