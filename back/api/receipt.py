from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, status, HTTPException, Request
from fastapi.responses import FileResponse

from schemas.receipt import CreateReceipt, CreatePerson, CreatePlace, CreateItem, CreateUser
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