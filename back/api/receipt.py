from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, status, HTTPException, Request
from fastapi.responses import FileResponse

from schemas.receipt import CreateReceipt, CreatePerson, CreatePlace, CreateItem, CreateUser, GetReceipt, UpdateReceipt
from services import Receipt

router = APIRouter(tags=["Receipt"], prefix="/receipt")


@router.post("/create_receipt")
async def create_receipt(request: Request, data: CreateReceipt):
    return await Receipt.create_receipt(request, data)


@router.post("/create_person")
async def create_person(request: Request, data: CreatePerson):
    return await Receipt.create_person(request, data)


@router.post("/create_place")
async def create_place(request: Request, data: CreatePlace):
    return await Receipt.create_place(request, data)


@router.post("/create_user")
async def create_user(request: Request, data: CreateUser):
    return await Receipt.create_user(request, data)


@router.get(
    "/get_receipt",
    response_model=GetReceipt,
    status_code=status.HTTP_200_OK,
)
async def get_receipt(request: Request, id: int):
    return await Receipt.get_receipt(request, id)


@router.get(
    "/get_receipts",
    response_model=list[GetReceipt],
    status_code=status.HTTP_200_OK,
)
async def get_receipts(request: Request, user_id: int):
    return await Receipt.get_receipts(request, user_id)


@router.put(
    "/update_receipt",
    status_code=status.HTTP_200_OK,
)
async def update_receipt(request: Request, data: UpdateReceipt):
    return await Receipt.update_receipt(request, data)


@router.delete(
    "/delete_receipt",
    status_code=status.HTTP_200_OK,
)
async def delete_receipt(request: Request, id: int):
    return await Receipt.delete_receipt(request, id)
