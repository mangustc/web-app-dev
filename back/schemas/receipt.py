from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class CreateUser(BaseModel):
    email: EmailStr
    password: str


class GetUser(BaseModel):
    id: int
    email: EmailStr
    password: str


class CreateItem(BaseModel):
    name: Optional[str]
    # receipt_id: Optional[int]
    cost: float
    amount: float


class GetItem(BaseModel):
    id: int
    name: Optional[str]
    cost: float
    amount: float
    receipt_id: int


class CreateReceipt(BaseModel):
    user_id: int
    receipt_cost: float
    person_id: int
    is_user_purchase: bool
    place_id: int
    items: list[CreateItem]


class GetReceipt(BaseModel):
    id: int
    user_id: int
    receipt_cost: float
    person_id: int
    is_user_purchase: bool
    place_id: int
    items: list[GetItem]
    creation_date: date


class CreatePerson(BaseModel):
    user_id: int
    person_name: str


class GetPerson(BaseModel):
    id: int
    user_id: int
    person_name: str


class CreatePlace(BaseModel):
    place_name: str


class GetPlace(BaseModel):
    id: int
    place_name: str


class UpdateReceipt(BaseModel):
    id: int
    receipt: CreateReceipt
