from datetime import date
from fastapi import HTTPException, Request
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from starlette import status

import functions
from database import new_session, ReceiptModel, PersonModel, PlaceModel, ItemModel, UserModel
from schemas.receipt import CreateReceipt, GetReceipt, CreatePerson, GetPerson, CreatePlace, GetPlace, GetItem, UpdateReceipt

class Receipt:
    @classmethod
    async def create_receipt(cls, request: Request, data: CreateReceipt):
        user = await functions.get_user(request)

        async with new_session() as session:
            query = select(PersonModel).filter_by(user_id=user.id)
            result = await session.execute(query)
            persons = result.scalars().all()

        result = 0
        for person in persons:
            if person.id == data.person_id:
                result = 1
                break
        if result == 0:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Can't create: bad request",
            )

        async with new_session() as session:
            receipt_field = ReceiptModel(
                user_id=user.id,
                receipt_cost=data.receipt_cost,
                person_id=data.person_id,
                is_user_purchase=data.is_user_purchase,
                place_id=data.place_id,
                creation_date=date.today()
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
                    receipt_id=receipt_field.id,
                    cost=data.items[i].cost,
                    amount=data.items[i].amount,
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
        user = await functions.get_user(request)

        async with new_session() as session:
            field = PersonModel(
                user_id=user.id,
                person_name=data.person_name
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
    async def get_receipt(cls, request: Request, id: int):
        user = await functions.get_user(request)

        async with new_session() as session:
            query = select(ReceiptModel).filter_by(id=id, user_id=user.id)
            result = await session.execute(query)
            field = result.scalars().first()
            if field is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Field with this ID does not exist",
                )
            return field

    @classmethod
    async def get_receipts(cls, request: Request):
        user = await functions.get_user(request)

        async with new_session() as session:
            query = select(ReceiptModel).filter_by(user_id=user.id)
            result = await session.execute(query)
            fields = result.scalars().all()
            return fields

    @classmethod
    async def update_receipt(cls, request: Request, data: UpdateReceipt):
        user = await functions.get_user(request)

        async with new_session() as session:
            query = select(ReceiptModel).filter_by(id=data.id, user_id=user.id)
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
                    receipt_id=data.id,
                    cost=data.receipt.items[i].cost,
                    amount=data.receipt.items[i].amount,
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
        user = await functions.get_user(request)

        async with new_session() as session:
            query = delete(ReceiptModel).filter_by(id=id, user_id=user.id)
            result = await session.execute(query)
            await session.flush()
            await session.commit()

        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No sufficient rights",
            )

        async with new_session() as session:
            query = delete(ItemModel).filter_by(receipt_id=id)
            await session.execute(query)
            await session.flush()
            await session.commit()

        return {}
        # return cls.get_receipt(request, data.id)
