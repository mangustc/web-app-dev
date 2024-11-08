from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, status, HTTPException, Request
from fastapi.responses import FileResponse

from schemas.user import CreateUser
from services import User

router = APIRouter(tags=["User"], prefix="/user")


@router.put("/id/{user_id}/change_photo")
async def change_user_photo(
        request: Request, photo: UploadFile = File(...)
):
    return await User.change_user_photo(request, photo)


@router.get("/id/{user_id}/photo", response_class=FileResponse)
async def get_user_photo(user_id: int):
    return await User.get_user_photo(user_id)
