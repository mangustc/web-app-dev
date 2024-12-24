from pydantic import BaseModel, EmailStr


class UserCookie(BaseModel):
    session_uuid: str


class Register(BaseModel):
    email: EmailStr
    password: str
    re_password: str


class Login(BaseModel):
    email: EmailStr
    password: str
