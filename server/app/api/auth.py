from fastapi import APIRouter, HTTPException, Depends
from app.schemas.common import SuccessResponse, ErrorResponse
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, LogoutResponse
from app.core.database import get_supabase
from supabase import Client
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/login", response_model=SuccessResponse[AuthResponse])
async def login(request: LoginRequest):
    """User login endpoint"""
    try:
        supabase = get_supabase()

        # Authenticate user with Supabase
        auth_response = supabase.auth.sign_in_with_password(
            {"email": request.email, "password": request.password}
        )

        user = auth_response.user
        session = auth_response.session

        if not user or not session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Get user profile from profiles table
        profile_response = (
            supabase.table("profiles").select("*").eq("id", user.id).single().execute()
        )
        profile = profile_response.data if profile_response.data else {}

        return SuccessResponse(
            data=AuthResponse(
                user_id=user.id,
                email=user.email,
                first_name=profile.get("first_name", ""),
                last_name=profile.get("last_name", ""),
                access_token=session.access_token,
                refresh_token=session.refresh_token,
            )
        )

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        if "Invalid login credentials" in str(e):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.post("/register", response_model=SuccessResponse[AuthResponse])
async def register(request: RegisterRequest):
    """User registration endpoint"""
    try:
        supabase = get_supabase()

        logger.info(f"Attempting to register user: {request.email}")

        # Create user account with Supabase
        auth_response = supabase.auth.sign_up(
            {"email": request.email, "password": request.password}
        )

        user = auth_response.user
        session = auth_response.session

        if not user:
            raise HTTPException(
                status_code=400, detail="Registration failed - no user created"
            )

        logger.info(f"User created successfully: {user.id}")

        # Create user profile in profiles table
        profile_data = {
            "id": user.id,
            "email": request.email,
            "first_name": request.first_name,
            "last_name": request.last_name,
        }

        logger.info(f"Creating profile with data: {profile_data}")
        profile_result = supabase.table("profiles").insert(profile_data).execute()
        logger.info(f"Profile creation result: {profile_result}")

        return SuccessResponse(
            data=AuthResponse(
                user_id=user.id,
                email=user.email,
                first_name=request.first_name,
                last_name=request.last_name,
                access_token=session.access_token if session else "",
                refresh_token=session.refresh_token if session else "",
            )
        )

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        if "User already registered" in str(e):
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/logout", response_model=SuccessResponse[LogoutResponse])
async def logout():
    """User logout endpoint"""
    try:
        supabase = get_supabase()

        # Sign out user
        supabase.auth.sign_out()

        return SuccessResponse(data=LogoutResponse(message="Successfully logged out"))

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")
