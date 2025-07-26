from typing import Optional, TypedDict

class Task(TypedDict):
    id: Optional[int]
    text: str
    done: bool
