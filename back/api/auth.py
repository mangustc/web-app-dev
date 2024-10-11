from fastapi import APIRouter, status, HTTPException, Response, Request
from schemas import Register, GetUser, Login, Inform, UserCookie
from services import Auth


router = APIRouter(tags=["Authentication"], prefix="/auth")


@router.post("/register", response_model=GetUser, status_code=status.HTTP_201_CREATED)
async def register(data: Register):
    if data.password != data.re_password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Passwords do not match",
        )
    return await Auth.register(data)


@router.put("/login", response_model=GetUser, status_code=status.HTTP_200_OK)
async def login(data: Login):
    return await Auth.login(data)


@router.put("/logout", response_model=Inform, status_code=status.HTTP_200_OK)
async def logout(request: Request, response: Response):
    return await Auth.logout(request, response)


@router.get(
    "/get_logged_user", response_model=UserCookie, status_code=status.HTTP_200_OK
)
async def get_user_cookie_contents(request: Request):
    return await Auth.get_user_cookie_contents(request)
