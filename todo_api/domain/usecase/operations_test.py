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
        )
        created_task = op.create_task(new_task)

        assert created_task["id"] is not None, "タスクIDが割り振られること"

    def test_update_task(self):
        db = MemDB()
        op = OperationInteractor(db)
        
        # Get an existing task
        tasks = op.show_tasks()
        task_id = tasks[0]["id"]
        
        # Update it
        updated_task = op.update_task(task_id, "updated text")
        assert updated_task["text"] == "updated text", "タスクのテキストが更新されること"
        
        # Verify the change persisted
        tasks_after = op.show_tasks()
        found_task = next(t for t in tasks_after if t["id"] == task_id)
        assert found_task["text"] == "updated text", "更新が永続化されること"

    def test_delete_task(self):
        db = MemDB()
        op = OperationInteractor(db)
        
        # Get initial count
        tasks_before = op.show_tasks()
        initial_count = len(tasks_before)
        task_id = tasks_before[0]["id"]
        
        # Delete a task
        success = op.delete_task(task_id)
        assert success, "削除が成功すること"
        
        # Verify count decreased
        tasks_after = op.show_tasks()
        assert len(tasks_after) == initial_count - 1, "タスク数が減っていること"
        
        # Verify specific task is gone
        assert not any(t["id"] == task_id for t in tasks_after), "指定したタスクが削除されていること"
