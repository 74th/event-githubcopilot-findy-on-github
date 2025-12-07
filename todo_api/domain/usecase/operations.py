from todo_api.domain.entity.entity import Task
from todo_api.memdb.memdb import MemDB


class OperationInteractor:
    def __init__(self, memdb: MemDB):
        self._db = memdb

    def show_tasks(self) -> list[Task]:
        return self._db.search_unfinished()

    def create_task(self, task: Task) -> Task:
        task["done"] = False
        task["status"] = "pending"
        self._db.add(task)
        return task

    def start_task(self, task_id: int) -> Task:
        task = self._db.get(task_id)
        if task is None:
            raise Exception("not found")
        task["status"] = "in_progress"
        
        self._db.update(task)
        
        return task

    def done_task(self, task_id: int)-> Task:
        task = self._db.get(task_id)
        if task is None:
            raise Exception("not found")
        task["done"] = True
        task["status"] = "done"

        self._db.update(task)

        return task
