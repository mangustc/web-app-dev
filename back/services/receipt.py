from urllib.request import Request

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from starlette import status

from database import new_session, ReceiptModel, PersonModel, PlaceModel, ItemModel, UserModel
from schemas.receipt import CreateReceipt, GetReceipt, CreatePerson, GetPerson, CreatePlace, GetPlace, GetItem, \
    CreateUser, GetUser


class Receipt:
    @classmethod
    async def create_receipt(cls, request: Request, data: CreateReceipt):
        async with new_session() as session:
            # data_dict = data.model_dump()
            receipt_field = ReceiptModel(
                user_id = data.user_id,
                receipt_cost = data.receipt_cost,
                person_id = data.person_id,
                is_user_purchase = data.is_user_purchase,
                place_id = data.place_id
            )
            session.add(receipt_field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't create: bad request",
                )
            await session.commit()
            # return GetReceipt(**field.__dict__)

        async with new_session() as session:
            for i in range(len(data.items)):
                field = ItemModel(
                    receipt_id = receipt_field.id,
                    cost = data.items[i].cost,
                    amount = data.items[i].amount,
                )
                session.add(field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't create: bad request",
                )
            await session.commit()
            # return GetReceipt(**field.__dict__)


    @classmethod
    async def create_person(cls, request: Request, data: CreatePerson):
        async with new_session() as session:
            data_dict = data.model_dump()
            field = PersonModel(**data_dict)
            session.add(field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't create: bad request",
                )
            await session.commit()
            return GetPerson(**field.__dict__)

    @classmethod
    async def create_place(cls, request: Request, data: CreatePlace):
        async with new_session() as session:
            data_dict = data.model_dump()
            field = PlaceModel(**data_dict)
            session.add(field)
            try:
                await session.flush()
            except IntegrityError:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "Can't create: bad request",
                )
            await session.commit()
            return GetPlace(**field.__dict__)

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
