from pydantic import BaseModel, EmailStr
from datetime import date
from . import GetProduct
from field_types import Id, Nickname, Role


class GetUser(BaseModel):
    id: int = Id
    blocked: bool
    role: Role
    nickname: Nickname
    email: EmailStr


class GetHistory(BaseModel):
    id: int = Id
    date: date
    product: GetProduct
