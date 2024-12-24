from pydantic import BaseModel, EmailStr


class CreateUser(BaseModel):
    email: EmailStr
    password: str


class GetUser(BaseModel):
    id: int
    email: EmailStr
    password: str
