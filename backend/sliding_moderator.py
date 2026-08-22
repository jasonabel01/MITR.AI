"""
MitrAI Sliding Window Moderation Module
Maintains an ephemeral circular sliding buffer (4-5 messages) per session in RAM.
Monitors conversation flow for:
1. Medical Misinformation & Dangerous Folk Remedies (inline flagging)
2. Repeated Aggression / Harassment (room auto-termination warning / trigger)
"""

from collections import deque
from typing import Dict, List, Any, Optional
import time

# Keywords for dangerous medical / health misinformation
MISINFO_PATTERNS = [
    ("stop insulin", "Dangerous medical advice: Discontinuing prescribed insulin"),
    ("stop taking medicine", "Unverified advice: Advising cessation of prescription meds"),
    ("bleach cures", "Hazardous substance claim"),
    ("drink kerosene", "Hazardous substance claim"),
    ("magic powder", "Unverified alternative remedy"),
    ("babaji powder", "Unverified alternative remedy"),
    ("cure cancer with lemon", "Unverified oncology claim"),
    ("cure depression instantly by drinking", "Unverified home remedy"),
    ("don't go to doctor", "Advising against professional medical consultation"),
    ("doctor is fraud just eat raw", "Medical misinformation"),
    ("dawa mat lo", "Advising cessation of medication"),
]

# Keywords for aggressive harassment / bullying
HARASSMENT_PATTERNS = [
    "you are worthless",
    "nobody likes you",
    "get lost loser",
    "tu pagal hai",
    "teri aukat nahi",
    "shut up idiot",
    "go die",
    "you deserve pain",
    "bloody idiot",
]


class SlidingWindowModerator:
    def __init__(self, buffer_size: int = 5):
        self.buffer_size = buffer_size
        # Map: room_id -> deque of recent messages {"sender": str, "text": str, "timestamp": float}
        self.sessions: Dict[str, deque] = {}

    def get_or_create_buffer(self, room_id: str) -> deque:
        if room_id not in self.sessions:
            self.sessions[room_id] = deque(maxlen=self.buffer_size)
        return self.sessions[room_id]

    def purge_room(self, room_id: str):
        """Zero-trace purge of room buffer from memory."""
        if room_id in self.sessions:
            self.sessions[room_id].clear()
            del self.sessions[room_id]

    def evaluate_message(self, room_id: str, sender_id: str, text: str) -> Dict[str, Any]:
        """
        Evaluates current message in context of the sliding window.
        Returns:
            {
                "status": "clean" | "flagged" | "blocked",
                "flag_type": Optional[str],
                "flag_label": Optional[str],
                "moderation_reason": Optional[str],
                "action_required": "none" | "inline_badge" | "terminate_room"
            }
        """
        buffer = self.get_or_create_buffer(room_id)
        lower_text = text.lower()
        now = time.time()

        # Check 1: Medical Misinformation Detection
        for pattern, reason in MISINFO_PATTERNS:
            if pattern in lower_text:
                buffer.append({"sender": sender_id, "text": text, "timestamp": now, "flag": "misinfo"})
                return {
                    "status": "flagged",
                    "flag_type": "misinformation",
                    "flag_label": "[Flagged: Unverified Health Remedy]",
                    "moderation_reason": reason,
                    "action_required": "inline_badge"
                }

        # Check 2: Harassment & Toxicity Check
        is_harassing = any(h in lower_text for h in HARASSMENT_PATTERNS)
        if is_harassing:
            buffer.append({"sender": sender_id, "text": text, "timestamp": now, "flag": "harassment"})
            # Count recent harassment in sliding window
            harassment_count = sum(1 for m in buffer if m.get("flag") == "harassment")
            if harassment_count >= 2:
                return {
                    "status": "blocked",
                    "flag_type": "harassment_repeat",
                    "flag_label": "[Terminated: Repeated Harassment]",
                    "moderation_reason": "Multiple violations of safe space peer guidelines",
                    "action_required": "terminate_room"
                }
            return {
                "status": "flagged",
                "flag_type": "harassment_warning",
                "flag_label": "[Warning: Potentially Hostile Phrasing]",
                "moderation_reason": "Please maintain a compassionate and respectful tone",
                "action_required": "inline_badge"
            }

        # Append clean message to sliding buffer
        buffer.append({"sender": sender_id, "text": text, "timestamp": now, "flag": "clean"})
        return {
            "status": "clean",
            "flag_type": None,
            "flag_label": None,
            "moderation_reason": None,
            "action_required": "none"
        }


# Global singleton instance
sliding_moderator = SlidingWindowModerator(buffer_size=5)
