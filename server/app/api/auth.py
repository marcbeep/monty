from fastapi import APIRouter, HTTPException, Depends
from app.schemas.common import SuccessResponse, ErrorResponse
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, LogoutResponse
from app.core.database import get_supabase
from supabase import Client
import logging

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
            logger.warning(
                f"Login failed for email: {request.email} - No user or session"
            )
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Get user profile from profiles table
        try:
            profile_response = (
                supabase.table("profiles")
                .select("*")
                .eq("id", user.id)
                .single()
                .execute()
            )
            profile = profile_response.data if profile_response.data else {}
        except Exception as profile_error:
            logger.warning(
                f"Could not fetch profile for user {user.id}: {profile_error}"
            )
            profile = {}

        logger.info(f"User {user.email} logged in successfully")

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

    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logger.error(f"Login failed for email {request.email}: {e}")
        if (
            "Invalid login credentials" in str(e)
            or "invalid credentials" in str(e).lower()
        ):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/register", response_model=SuccessResponse[AuthResponse])
async def register(request: RegisterRequest):
    """User registration endpoint"""
    try:
        supabase = get_supabase()

        # Create user account with Supabase, passing metadata
        auth_response = supabase.auth.sign_up(
            {
                "email": request.email,
                "password": request.password,
                "options": {
                    "data": {
                        "first_name": request.first_name,
                        "last_name": request.last_name,
                    }
                },
            }
        )

        user = auth_response.user
        session = auth_response.session

        if not user:
            logger.error(
                f"Registration failed for email {request.email} - No user created"
            )
            raise HTTPException(
                status_code=400, detail="Registration failed - no user created"
            )

        # The profile will be automatically created by the SQL trigger
        # But let's verify it was created and get the data
        try:
            # Wait a moment for the trigger to execute, then fetch the profile
            import time

            time.sleep(0.1)  # Small delay to ensure trigger completes

            profile_response = (
                supabase.table("profiles")
                .select("*")
                .eq("id", user.id)
                .single()
                .execute()
            )
            profile = profile_response.data if profile_response.data else {}
            logger.info(f"Profile automatically created for user {user.email}")
        except Exception as profile_error:
            logger.warning(
                f"Could not fetch auto-created profile for user {user.id}: {profile_error}"
            )
            profile = {}

        logger.info(f"User {user.email} registered successfully")

        return SuccessResponse(
            data=AuthResponse(
                user_id=user.id,
                email=user.email,
                first_name=profile.get("first_name", request.first_name),
                last_name=profile.get("last_name", request.last_name),
                access_token=session.access_token if session else "",
                refresh_token=session.refresh_token if session else "",
            )
        )

    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logger.error(f"Registration failed for email {request.email}: {e}")
        if (
            "User already registered" in str(e)
            or "already registered" in str(e).lower()
        ):
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.post("/logout", response_model=SuccessResponse[LogoutResponse])
async def logout():
    """User logout endpoint"""
    try:
        supabase = get_supabase()

        # Sign out user
        supabase.auth.sign_out()
        logger.info("User logged out successfully")

        return SuccessResponse(data=LogoutResponse(message="Successfully logged out"))

    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(status_code=500, detail="Logout failed")
