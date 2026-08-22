"""
MitrAI (SafeSpeak) FastAPI Gateway & WebSocket Server
Zero-Persistent-Storage Architecture for Real-Time Peer Support.
"""

import json
import asyncio
import time
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from crisis_scanner import crisis_scanner
from sliding_moderator import sliding_moderator
from translation_service import translation_service
from session_scorer import session_scorer
from matchmaker import matchmaker, WaitingPeer

app = FastAPI(title="MitrAI (SafeSpeak) Gateway API", version="1.0.0")

# Enable open CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connection Manager for WebSockets in RAM
class ConnectionManager:
    def __init__(self):
        # Map: client_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)

    async def send_personal_message(self, message: Dict[str, Any], client_id: str):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception:
                pass


manager = ConnectionManager()


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "Hinglish"
    target_lang: str = "English"


class CrisisCheckRequest(BaseModel):
    text: str


class ScoreRequest(BaseModel):
    user_id: str
    messages: list


@app.get("/")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MitrAI SafeSpeak Realtime Gateway",
        "storage": "Volatile RAM Only (Zero Persistent Storage)",
        "crisis_engine": "Aho-Corasick Automaton Active"
    }


@app.post("/api/translate")
async def api_translate(req: TranslateRequest):
    result = translation_service.translate_indic_colloquial(
        text=req.text,
        source_lang=req.source_lang,
        target_lang=req.target_lang
    )
    return result


@app.post("/api/crisis-check")
async def api_crisis_check(req: CrisisCheckRequest):
    result = crisis_scanner.scan(req.text)
    return result


@app.post("/api/session-score")
async def api_session_score(req: ScoreRequest):
    result = session_scorer.analyze_session(req.messages, req.user_id)
    return result


# WebSocket Endpoint for Real-Time Peer Streaming & Safety Circuit Breaking
@app.websocket("/ws/chat/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            action = data.get("action")

            if action == "join_queue":
                alias = data.get("alias", f"Peer #{client_id[:4]}")
                native_lang = data.get("native_lang", "Hinglish")
                tags = data.get("tags", [])

                room_id = matchmaker.enqueue(client_id, alias, native_lang, tags)
                if room_id:
                    # Notify both peers
                    room = matchmaker.active_rooms.get(room_id)
                    if room:
                        peer_a = room["peer_a"]
                        peer_b = room["peer_b"]

                        await manager.send_personal_message({
                            "event": "matched",
                            "room_id": room_id,
                            "peer": {
                                "client_id": peer_b.client_id,
                                "alias": peer_b.alias,
                                "native_lang": peer_b.native_lang,
                                "tags": peer_b.tags
                            },
                            "self_alias": peer_a.alias
                        }, peer_a.client_id)

                        await manager.send_personal_message({
                            "event": "matched",
                            "room_id": room_id,
                            "peer": {
                                "client_id": peer_a.client_id,
                                "alias": peer_a.alias,
                                "native_lang": peer_a.native_lang,
                                "tags": peer_a.tags
                            },
                            "self_alias": peer_b.alias
                        }, peer_b.client_id)
                else:
                    await manager.send_personal_message({
                        "event": "queue_waiting",
                        "message": "Matching with an empathetic peer..."
                    }, client_id)

            elif action == "cancel_queue":
                matchmaker.dequeue(client_id)
                await manager.send_personal_message({
                    "event": "queue_cancelled"
                }, client_id)

            elif action == "send_message":
                room_id = data.get("room_id")
                text = data.get("text", "")
                sender_alias = data.get("alias", "Peer")
                source_lang = data.get("source_lang", "Hinglish")

                if not text or not room_id:
                    continue

                # ========================================================
                # STAGE 1: SUB-2ms DETERMINISTIC CRISIS CIRCUIT-BREAKER
                # ========================================================
                crisis_result = crisis_scanner.scan(text)
                if crisis_result["is_crisis"]:
                    # 1. Immediately HALT transmission to peer
                    # 2. Trigger Helpline Emergency Modal to Sender
                    await manager.send_personal_message({
                        "event": "crisis_circuit_breaker",
                        "detected_phrase": crisis_result["detected_phrase"],
                        "helplines": crisis_result["helplines"],
                        "message": "We care deeply about your safety. You are not alone."
                    }, client_id)

                    # 3. Inform peer of a gentle conversation pause
                    peer = matchmaker.get_room_peer(room_id, client_id)
                    if peer:
                        await manager.send_personal_message({
                            "event": "peer_paused",
                            "message": "Your peer has paused the conversation for a moment."
                        }, peer.client_id)

                    # Stop processing this message completely
                    continue

                # ========================================================
                # STAGE 2: SLIDING WINDOW CONTEXT MODERATION
                # ========================================================
                moderation = sliding_moderator.evaluate_message(room_id, client_id, text)
                if moderation["action_required"] == "terminate_room":
                    # Harassment threshold reached: auto-terminate room
                    peer = matchmaker.get_room_peer(room_id, client_id)
                    term_msg = {
                        "event": "room_terminated",
                        "reason": moderation["moderation_reason"]
                    }
                    await manager.send_personal_message(term_msg, client_id)
                    if peer:
                        await manager.send_personal_message(term_msg, peer.client_id)
                    matchmaker.close_room(room_id)
                    sliding_moderator.purge_room(room_id)
                    continue

                # ========================================================
                # STAGE 3: EMOTION-PRESERVING VERNACULAR TRANSLATION
                # ========================================================
                peer = matchmaker.get_room_peer(room_id, client_id)
                target_lang = peer.native_lang if peer else "English"

                translation = translation_service.translate_indic_colloquial(
                    text=text,
                    source_lang=source_lang,
                    target_lang=target_lang
                )

                # Dispatch message payload to both peers (Dual-Bubble stream)
                msg_payload = {
                    "event": "new_message",
                    "id": f"msg_{int(time.time()*1000)}",
                    "sender_id": client_id,
                    "sender_alias": sender_alias,
                    "original_text": text,
                    "translated_text": translation["translated_text"],
                    "source_lang": source_lang,
                    "target_lang": target_lang,
                    "detected_emotion": translation["detected_emotion"],
                    "valence": translation["valence"],
                    "latency_ms": translation["latency_ms"],
                    "flag": moderation["flag_label"],
                    "timestamp": time.time()
                }

                # Save ephemeral message to room memory
                if room_id in matchmaker.active_rooms:
                    matchmaker.active_rooms[room_id]["messages"].append(msg_payload)

                await manager.send_personal_message(msg_payload, client_id)
                if peer:
                    await manager.send_personal_message(msg_payload, peer.client_id)

            elif action == "leave_room":
                room_id = data.get("room_id")
                if room_id:
                    room_data = matchmaker.close_room(room_id)
                    sliding_moderator.purge_room(room_id)
                    peer = matchmaker.get_room_peer(room_id, client_id)

                    # Compute score for sender
                    messages = room_data.get("messages", []) if room_data else []
                    summary = session_scorer.analyze_session(messages, client_id)

                    await manager.send_personal_message({
                        "event": "session_ended",
                        "summary": summary
                    }, client_id)

                    if peer:
                        peer_summary = session_scorer.analyze_session(messages, peer.client_id)
                        await manager.send_personal_message({
                            "event": "session_ended",
                            "summary": peer_summary,
                            "notice": "Your peer has ended the session. Memory purged."
                        }, peer.client_id)

    except WebSocketDisconnect:
        manager.disconnect(client_id)
        matchmaker.dequeue(client_id)
        room_id = matchmaker.client_room_map.get(client_id)
        if room_id:
            peer = matchmaker.get_room_peer(room_id, client_id)
            matchmaker.close_room(room_id)
            sliding_moderator.purge_room(room_id)
            if peer:
                await manager.send_personal_message({
                    "event": "peer_disconnected",
                    "message": "Your peer has disconnected. Session data purged."
                }, peer.client_id)
    except Exception as e:
        manager.disconnect(client_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
