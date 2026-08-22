"""
MitrAI Volatile Matchmaking Queue
Manages an in-memory queue of waiting anonymous peers categorized by intent tags.
Matches peers in O(1) time without persistent database storage.
"""

import time
import asyncio
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field


@dataclass
class WaitingPeer:
    client_id: str
    alias: str
    native_lang: str
    tags: List[str]
    joined_at: float = field(default_factory=time.time)
    matched_room_id: Optional[str] = None


class Matchmaker:
    def __init__(self):
        # Map: tag -> list of client_ids waiting
        self.tag_queues: Dict[str, List[str]] = {}
        # Map: client_id -> WaitingPeer
        self.waiting_peers: Dict[str, WaitingPeer] = {}
        # Map: room_id -> {"peer_a": client_id, "peer_b": client_id, "created_at": float}
        self.active_rooms: Dict[str, Dict[str, Any]] = {}
        # Map: client_id -> room_id
        self.client_room_map: Dict[str, str] = {}

    def enqueue(self, client_id: str, alias: str, native_lang: str, tags: List[str]) -> Optional[str]:
        """
        Enqueues an anonymous peer. If an immediate match is found by tag, creates room and returns room_id.
        Otherwise adds to volatile queue and returns None.
        """
        # Cleanup any existing entry
        self.dequeue(client_id)

        peer = WaitingPeer(
            client_id=client_id,
            alias=alias,
            native_lang=native_lang,
            tags=tags if tags else ["General Support"]
        )
        self.waiting_peers[client_id] = peer

        # Try to find a match sharing at least one tag
        for tag in peer.tags:
            if tag in self.tag_queues and len(self.tag_queues[tag]) > 0:
                other_client_id = self.tag_queues[tag].pop(0)
                if other_client_id in self.waiting_peers and other_client_id != client_id:
                    # Match found!
                    return self._create_room(client_id, other_client_id)

        # Check General queue fallback if tags didn't match immediately
        if "General Support" in self.tag_queues and len(self.tag_queues["General Support"]) > 0:
            other_client_id = self.tag_queues["General Support"].pop(0)
            if other_client_id in self.waiting_peers and other_client_id != client_id:
                return self._create_room(client_id, other_client_id)

        # No instant match: add client to their tag queues
        for tag in peer.tags:
            if tag not in self.tag_queues:
                self.tag_queues[tag] = []
            self.tag_queues[tag].append(client_id)

        return None

    def _create_room(self, peer_a_id: str, peer_b_id: str) -> str:
        room_id = f"room_{int(time.time() * 1000)}_{peer_a_id[:4]}_{peer_b_id[:4]}"
        
        peer_a = self.waiting_peers.pop(peer_a_id, None)
        peer_b = self.waiting_peers.pop(peer_b_id, None)

        self.active_rooms[room_id] = {
            "room_id": room_id,
            "peer_a": peer_a,
            "peer_b": peer_b,
            "created_at": time.time(),
            "messages": []
        }
        self.client_room_map[peer_a_id] = room_id
        self.client_room_map[peer_b_id] = room_id

        # Clean from tag queues
        for q in self.tag_queues.values():
            if peer_a_id in q:
                q.remove(peer_a_id)
            if peer_b_id in q:
                q.remove(peer_b_id)

        return room_id

    def dequeue(self, client_id: str):
        """Removes client from waiting queue."""
        self.waiting_peers.pop(client_id, None)
        for q in self.tag_queues.values():
            if client_id in q:
                q.remove(client_id)

    def get_room_peer(self, room_id: str, client_id: str) -> Optional[WaitingPeer]:
        if room_id in self.active_rooms:
            room = self.active_rooms[room_id]
            if room["peer_a"] and room["peer_a"].client_id == client_id:
                return room["peer_b"]
            elif room["peer_b"] and room["peer_b"].client_id == client_id:
                return room["peer_a"]
        return None

    def close_room(self, room_id: str) -> Optional[Dict[str, Any]]:
        """Purges active room from volatile memory."""
        if room_id in self.active_rooms:
            room = self.active_rooms.pop(room_id)
            if room.get("peer_a"):
                self.client_room_map.pop(room["peer_a"].client_id, None)
            if room.get("peer_b"):
                self.client_room_map.pop(room["peer_b"].client_id, None)
            return room
        return None


# Global singleton instance
matchmaker = Matchmaker()
