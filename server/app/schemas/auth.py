from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
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
