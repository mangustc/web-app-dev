from datetime import date
from fastapi import HTTPException, Request
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from starlette import status

from database import new_session, ReceiptModel, PersonModel, PlaceModel, ItemModel, UserModel
from schemas.receipt import CreateReceipt, GetReceipt, CreatePerson, GetPerson, CreatePlace, GetPlace, GetItem, \
    CreateUser, GetUser, UpdateReceipt


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
                place_id = data.place_id,
                creation_date = date.today()
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

    @classmethod
    async def get_receipt(cls, request: Request, id: int):
        async with new_session() as session:
            query = select(ReceiptModel).filter_by(id=id)
            result = await session.execute(query)
            field = result.scalars().first()
            if field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Field with this ID does not exist",
                )
            return field

    @classmethod
    async def get_receipts(cls, request: Request, user_id: int):
        async with new_session() as session:
            query = select(ReceiptModel).filter_by(user_id=user_id)
            result = await session.execute(query)
            fields = result.scalars().all()
            return fields

    @classmethod
    async def update_receipt(cls, request: Request, data: UpdateReceipt):
        async with new_session() as session:
            query = select(ReceiptModel).filter_by(id=data.id)
            result = await session.execute(query)
            field = result.scalars().first()
            if field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User with this user id does not exist",
                )
            field.receipt_cost = data.receipt.receipt_cost
            field.person_id = data.receipt.person_id
            field.is_user_purchase = data.receipt.is_user_purchase
            field.place_id = data.receipt.place_id
            await session.flush()
            await session.commit()

        async with new_session() as session:
            query = delete(ItemModel).filter_by(receipt_id=data.id)
            await session.execute(query)
            await session.flush()
            await session.commit()

        async with new_session() as session:
            for i in range(len(data.receipt.items)):
                field = ItemModel(
                    receipt_id = data.id,
                    cost = data.receipt.items[i].cost,
                    amount = data.receipt.items[i].amount,
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

        return {}
        # return cls.get_receipt(request, data.id)

    @classmethod
    async def delete_receipt(cls, request: Request, id: int):
        async with new_session() as session:
            query = delete(ItemModel).filter_by(receipt_id=id)
            await session.execute(query)
            await session.flush()
            await session.commit()

        async with new_session() as session:
            query = delete(ReceiptModel).filter_by(id=id)
            await session.execute(query)
            await session.flush()
            await session.commit()

        return {}
        # return cls.get_receipt(request, data.id)
