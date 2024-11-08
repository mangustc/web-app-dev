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

async def get_user(request: Request):
    cookie_encrypted = request.cookies.get("token")
    if cookie_encrypted is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login cookie was not found",
        )
    key = PRIVATE_KEY
    cookie: UserCookie = jwt.decode(cookie_encrypted, key, algorithms=[ENCRYPTION_ALG])

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
