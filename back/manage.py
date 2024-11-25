import typer
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
import asyncio

from database import new_session, PlaceModel

app = typer.Typer()


@app.command()
def hello():
    print(f'hello world')


async def _create_place(name: str):
    async with new_session() as session:
        field = PlaceModel(place_name=name)
        session.add(field)
        try:
            await session.flush()
        except IntegrityError:
            print("Can't create: bad request")
            exit(0)
        await session.commit()

    print(f'Created place {name}')

@app.command()
def create_place(name: str):
    asyncio.run(_create_place(name))


if __name__ == "__main__":
    app()