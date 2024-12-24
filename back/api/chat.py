from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter(tags=["Chat"], prefix="/chat")


messages = []


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/{nickname}")
async def websocket_endpoint(websocket: WebSocket, nickname: str):
    await manager.connect(websocket)
    for msg in messages:
        await manager.send_personal_message(msg, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = f"{nickname} says: {data}"
            messages.append(msg)
            await manager.broadcast(msg)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
