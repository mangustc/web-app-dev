from fastapi import APIRouter

from api.receipt import router as receipt_router

router = APIRouter(prefix="/api")

router.include_router(receipt_router)
