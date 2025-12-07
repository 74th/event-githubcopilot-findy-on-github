from unittest import TestCase
from todo_api.domain.entity.entity import Task

from todo_api.memdb.memdb import MemDB
from .operations import OperationInteractor

class OperationTest(TestCase):

    def test_task_work(self):
        db = MemDB()
        op = OperationInteractor(db)

        tasks = op.show_tasks()

        assert len(tasks) >0, "初期状態のリポジトリからはタスクが引けること"

        new_task = Task(
            id=None,
            text="new task",
            done=False,
            status="pending",
        )
        created_task = op.create_task(new_task)

        assert created_task["id"] is not None, "タスクIDが割り振られること"
        assert created_task["status"] == "pending", "新しいタスクのステータスはpendingであること"
    
    def test_start_task(self):
        db = MemDB()
        op = OperationInteractor(db)
        
        # Create a new task
        new_task = Task(
            id=None,
            text="test task",
            done=False,
            status="pending",
        )
        created_task = op.create_task(new_task)
        task_id = created_task["id"]
        assert task_id is not None
        
        # Start the task
        started_task = op.start_task(task_id)
        
        assert started_task["status"] == "in_progress", "タスクをstartするとステータスがin_progressになること"
        assert started_task["id"] == task_id, "タスクIDが変わらないこと"
    
    def test_done_task_updates_status(self):
        db = MemDB()
        op = OperationInteractor(db)
        
        # Create a new task
        new_task = Task(
            id=None,
            text="test task",
            done=False,
            status="pending",
        )
        created_task = op.create_task(new_task)
        task_id = created_task["id"]
        assert task_id is not None
        
        # Complete the task
        done_task = op.done_task(task_id)
        
        assert done_task["done"] is True, "タスクをdoneにするとdoneフィールドがTrueになること"
        assert done_task["status"] == "done", "タスクをdoneにするとステータスがdoneになること"
