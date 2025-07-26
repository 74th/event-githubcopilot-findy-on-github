from copy import copy
from typing import Optional
from todo_api.domain.entity import Task


class MemDB:
    """ インメモリDB """


    def __init__(self):
        self._tasks: list[Task] = [
            {
                "id": 0,
                "text": "task1",
                "done": False,
            },
            {
                "id": 1,
                "text": "task2",
                "done": False,
            }
        ]

    def add(self, task: Task) -> int:
        task["id"] = len(self._tasks)
        self._tasks.append(copy(task))
        assert task["id"] is not None
        return task["id"]

    def search_unfinished(self) -> list[Task]:
        return [copy(task) for task in self._tasks if not task["done"]]

    def update(self, task:Task):
        assert task["id"] is not None
        self._tasks[task["id"]] = copy(task)

    def get(self, id: int) -> Optional[Task]:
        for task in self._tasks:
            if task["id"] == id:
                return copy(task)
        return None
