from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, status, HTTPException, Request
from fastapi.responses import FileResponse
from services import User
from schemas import GetUser, GetHistory

router = APIRouter(tags=["User"], prefix="/user")


@router.put("/id/{user_id}/change_nickname")
async def change_user_nickname(request: Request, user_id: int, nickname: str):
    return await User.change_user_nickname(request, user_id, nickname)


@router.put("/id/{user_id}/change_photo")
async def change_user_photo(
    request: Request, user_id: int, photo: UploadFile = File(...)
):
    return await User.change_user_photo(request, user_id, photo)


@router.put("/id/{user_id}/change_password")
async def change_user_password(
    request: Request, user_id: int, password: str, repeat_password: str
):
    if password != repeat_password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Passwords do not match",
        )
    return await User.change_user_password(request, user_id, password)


@router.get("/id/{user_id}", response_model=GetUser)
async def get_user(user_id: int):
    return await User.get_user(user_id)


@router.get("/id/{user_id}/photo", response_class=FileResponse)
async def get_user_photo(user_id: int):
    return await User.get_user_photo(user_id)


@router.get("/id/{user_id}/history", response_model=list[GetHistory])
async def get_user_history(request: Request, user_id: int):
    return await User.get_user_history(request, user_id)
