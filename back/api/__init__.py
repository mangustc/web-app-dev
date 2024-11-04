from fastapi import APIRouter

from api.receipt import router as receipt_router
from api.user import router as user_router
from api.auth import router as auth_router

router = APIRouter(prefix="/api")

router.include_router(receipt_router)
router.include_router(user_router)
router.include_router(auth_router)
