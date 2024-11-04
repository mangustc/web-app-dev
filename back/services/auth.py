from uuid import uuid4

from fastapi import HTTPException, status, Response, Request
from fastapi.responses import JSONResponse
from database import new_session, UserModel, SessionModel
from schemas.auth import Register, Login, UserCookie
from schemas.user import GetUser
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
import jwt

# from constants import PRIVATE_KEY, ENCRYPTION_ALG
PRIVATE_KEY = "YZNmiML4Eb"
ENCRYPTION_ALG = "HS256"
AUTH_COOKIE_NAME = "session"


class Auth:
    @classmethod
    async def register(cls, data: Register):
        async with new_session() as session:
            user_field = UserModel(
                email=data.email,
                password=data.password
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

        session_uuid=str(uuid4())

        async with new_session() as session:
            session_field = SessionModel(
                session_uuid=session_uuid,
                user_id=user.id
            )
            session.add(session_field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't add user to the database, possible: email exists",
                )
            await session.commit()

        key = PRIVATE_KEY
        response = JSONResponse(GetUser(**user.__dict__).model_dump(), 200)
        response.set_cookie(
            key="token",
            value=jwt.encode(
                payload=UserCookie(session_uuid=session_uuid).model_dump(),
                key=key,
                algorithm=ENCRYPTION_ALG,
            ),
        )
        return response

    @classmethod
    async def logout(cls, request: Request, response: Response):
        token = request.cookies.get("token")
        if token is None:
            return JSONResponse({}, 200)
        response = JSONResponse({}, 200)
        response.delete_cookie("token")
        return response

    @classmethod
    async def get_user(cls, request: Request):
        cookie_encrypted = request.cookies.get("token")
        if cookie_encrypted is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Login cookie was not found",
            )
        key = PRIVATE_KEY
        cookie: UserCookie = jwt.decode(cookie_encrypted, key, algorithms=[ENCRYPTION_ALG])
        print(cookie)

        async with new_session() as session:
            query = select(SessionModel).filter_by(
                session_uuid=cookie['session_uuid']
            )
            result = await session.execute(query)
            session = result.scalars().first()
            if session is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="This user session does not exist",
                )

        return GetUser(**session.user.__dict__)
