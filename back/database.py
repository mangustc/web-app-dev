from sqlalchemy import ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import Optional
from datetime import date

engine = create_async_engine("sqlite+aiosqlite:///./site.db")
new_session = async_sessionmaker(engine, expire_on_commit=False)


class Model(DeclarativeBase):
    pass


class UserModel(Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    photo: Mapped[Optional[str]]
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]

    receipts: Mapped[list["ReceiptModel"]] = relationship()


class ReceiptModel(Model):
    __tablename__ = "receipt"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    receipt_cost: Mapped[float]
    person_id: Mapped[int] = mapped_column(ForeignKey("person.id", ondelete="CASCADE"))
    is_user_purchase: Mapped[bool]
    place_id: Mapped[int] = mapped_column(ForeignKey("place.id", ondelete="CASCADE"))

    items: Mapped[list["ItemModel"]] = relationship()
    person: Mapped["PersonModel"] = relationship()
    place: Mapped["PlaceModel"] = relationship()


class ItemModel(Model):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(primary_key=True)
    receipt_id: Mapped[int] = mapped_column(ForeignKey("receipt.id", ondelete="CASCADE"))
    name: Mapped[Optional[str]]
    cost: Mapped[float]
    amount: Mapped[float]

    receipt: Mapped["ReceiptModel"] = relationship()


class PersonModel(Model):
    __tablename__ = "person"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    person_name: Mapped[str]

    user: Mapped["UserModel"] = relationship()


class PlaceModel(Model):
    __tablename__ = "place"

    id: Mapped[int] = mapped_column(primary_key=True)
    place_name: Mapped[str]


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)
