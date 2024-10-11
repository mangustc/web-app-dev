from fastapi import UploadFile, HTTPException, status, Request
from fastapi.responses import FileResponse
from database import new_session, UserModel
from schemas import GetUser
from functions import Functions
from sqlalchemy.orm import joinedload
from sqlalchemy import select, delete, Select
from uuid import uuid4
import shutil
import os


class User:
    @classmethod
    async def change_user_nickname(cls, request: Request, user_id: int, nickname: str):
        acc_info = await Functions.get_user_id_and_role(request)
        user_id_check = acc_info["user_id"]

        if user_id_check != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't have sufficient rights for this action",
            )

        async with new_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.execute(query)
            user_field = result.scalars().first()
            if user_field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id does not exist",
                )
            user_field.nickname = nickname
            await session.flush()
            await session.commit()
            return {}

    @classmethod
    async def change_user_photo(cls, request: Request, user_id: int, photo: UploadFile):
        acc_info = await Functions.get_user_id_and_role(request)
        user_id_check = acc_info["user_id"]

        if user_id_check != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't have sufficient rights for this action",
            )

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
    async def change_user_password(cls, request: Request, user_id: int, password: str):
        acc_info = await Functions.get_user_id_and_role(request)
        user_id_check = acc_info["user_id"]

        if user_id_check != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't have sufficient rights for this action",
            )

        async with new_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.execute(query)
            user_field = result.scalars().first()
            if user_field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id does not exist",
                )
            user_field.password = password
            await session.flush()
            await session.commit()
            return {}

    @classmethod
    async def get_user(cls, user_id: int):
        async with new_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.execute(query)
            user_field = result.scalars().first()
            if user_field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id does not exist",
                )
            return GetUser(**user_field.__dict__)

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
                return FileResponse("media/nophoto.jpg")
            else:
                return FileResponse(user_field.photo)

    @classmethod
    async def get_user_history(cls, request: Request, user_id: int):
        acc_info = await Functions.get_user_id_and_role(request)
        user_id_check = acc_info["user_id"]

        if user_id_check != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't have sufficient rights for this action"
            )

        async with new_session() as session:
            query = (
                select(PurchaseHistoryModel)
                .filter_by(user_id=user_id)
                .options(joinedload(PurchaseHistoryModel.product))
            )
            result = await session.execute(query)
            history = result.scalars().all()
            data = []
            for i in range(len(history)):
                temp = {"id": history[i].id,
                        "date": history[i].date,
                        "product": history[i].product}
                data.append(temp)
        return data
