from pydantic import BaseModel, EmailStr
from field_types import Id, PasswordStr


class UserCookie(BaseModel):
    id: int = Id
    email: EmailStr


class Register(BaseModel):
    email: EmailStr = "mail@email.com"
    password: PasswordStr = "aoeuidhtn"
    re_password: PasswordStr = "aoeuidhtn"


class Login(BaseModel):
    email: EmailStr = "mail@email.com"
    password: PasswordStr = "aoeuidhtn"
