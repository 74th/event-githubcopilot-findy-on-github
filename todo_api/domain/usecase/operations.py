from todo_api.domain.entity.entity import Task
from todo_api.memdb.memdb import MemDB


class OperationInteractor:
    def __init__(self, memdb: MemDB):
        self._db = memdb

    def show_tasks(self) -> list[Task]:
        return self._db.search_unfinished()

    def create_task(self, task: Task) -> Task:
        task["done"] = False
        self._db.add(task)
        return task

    def done_task(self, task_id: int)-> Task:
        task = self._db.get(task_id)
        if task is None:
            raise Exception("not found")
        task["done"] = True

        self._db.update(task)

        return task
