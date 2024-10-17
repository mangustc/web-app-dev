from fastapi import UploadFile, HTTPException, status, Request
from fastapi.responses import FileResponse
from sqlalchemy.exc import IntegrityError

from database import new_session, UserModel
from sqlalchemy.orm import joinedload
from sqlalchemy import select, delete, Select
from uuid import uuid4
import shutil
import os

from schemas.user import CreateUser, GetUser


class User:
    @classmethod
    async def create_user(cls, request: Request, data: CreateUser):
        async with new_session() as session:
            data_dict = data.model_dump()
            field = UserModel(**data_dict)
            session.add(field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't create: bad request",
                )
            await session.commit()
            return GetUser(**field.__dict__)

    @classmethod
    async def change_user_photo(cls, request: Request, user_id: int, photo: UploadFile):

        if photo.content_type != "image/png" and photo.content_type != "image/jpeg":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="File should be one of these image types: png, jpg, jpeg",
            )

        if photo.content_type == "image/png":
            photo.filename = str(uuid4()) + ".png"
        else:
            photo.filename = str(uuid4()) + ".jpg"
        path = f"media/{photo.filename}"

        async with new_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.execute(query)
            user_field = result.scalars().first()
            if user_field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id does not exist",
                )
            if user_field.photo is not None:
                os.remove("./" + user_field.photo)
            with open(path, "wb+") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            user_field.photo = path
            await session.flush()
            await session.commit()
            return {}

    @classmethod
    async def get_user_photo(cls, user_id: int):
        async with new_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.execute(query)
            user_field = result.scalars().first()
            if user_field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id has not been found",
                )
            if user_field.photo is None:
                return FileResponse("media/img.png")
            else:
                return FileResponse(user_field.photo)