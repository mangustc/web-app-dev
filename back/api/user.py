from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, status, HTTPException, Request
from fastapi.responses import FileResponse

from schemas.user import CreateUser
from services import User

router = APIRouter(tags=["User"], prefix="/user")


@router.post("/create_user")
async def create_user(request: Request, data: CreateUser):
    return await User.create_user(request, data)


@router.put("/id/{user_id}/change_photo")
async def change_user_photo(
        request: Request, user_id: int, photo: UploadFile = File(...)
):
    return await User.change_user_photo(request, user_id, photo)


@router.get("/id/{user_id}/photo", response_class=FileResponse)
async def get_user_photo(user_id: int):
    return await User.get_user_photo(user_id)
