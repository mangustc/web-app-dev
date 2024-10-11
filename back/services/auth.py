from fastapi import HTTPException, status, Response, Request
from fastapi.responses import JSONResponse
from database import new_session, UserModel
from schemas import Register, GetUser, Login, UserCookie, Inform
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
import jwt
from constants import PRIVATE_KEY, ENCRYPTION_ALG


class Auth:
    @classmethod
    async def register(cls, data: Register):
        async with new_session() as session:
            user_field = UserModel(
                nickname="",
                email=data.email,
                password=data.password,
                blocked=False,
                role="Студент",
            )
            session.add(user_field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't add user to the database, possible: email exists",
                )
            await session.commit()
            return GetUser(**user_field.__dict__)

    @classmethod
    async def login(cls, data: Login):
        async with new_session() as session:
            query = select(UserModel).filter_by(
                email=data.email, password=data.password
            )
            result = await session.execute(query)
            user = result.scalars().first()
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="This user does not exist",
                )

            key = PRIVATE_KEY
            response = JSONResponse(GetUser(**user.__dict__).model_dump(), 200)
            response.set_cookie(
                key="token",
                value=jwt.encode(
                    payload=UserCookie(id=user.id, email=user.email).model_dump(),
                    key=key,
                    algorithm=ENCRYPTION_ALG,
                ),
            )
            return response

    @classmethod
    async def logout(cls, request: Request, response: Response):
        token = request.cookies.get("token")
        if token is None:
            return JSONResponse(Inform(detail="Logged out").model_dump(), 200)
        response = JSONResponse(Inform(detail="Logged out").model_dump(), 200)
        response.delete_cookie("token")
        return response

    @classmethod
    async def get_user_cookie_contents(cls, request: Request):
        token = request.cookies.get("token")
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Login cookie was not found",
            )
        key = PRIVATE_KEY
        cookie: UserCookie = jwt.decode(token, key, algorithms=[ENCRYPTION_ALG])
        return cookie
