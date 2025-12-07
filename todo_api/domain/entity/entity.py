from typing import Optional, TypedDict, Literal

TaskStatus = Literal["pending", "in_progress", "done"]

class Task(TypedDict):
    id: Optional[int]
    text: str
    done: bool
    status: TaskStatus
