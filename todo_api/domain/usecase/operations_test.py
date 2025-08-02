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
        """Test task text update functionality"""
        db = MemDB()
        op = OperationInteractor(db)
        
        # Create a new task
        new_task = Task(id=None, text="original text", done=False)
        created_task = op.create_task(new_task)
        task_id = created_task["id"]
        
        # Update the task text
        updated_task = op.update_task(task_id, "updated text")
        assert updated_task["text"] == "updated text", "タスクのテキストが更新されること"
        assert updated_task["id"] == task_id, "タスクIDが変わらないこと"
        
        # Verify the task was updated in the database
        retrieved_task = db.get(task_id)
        assert retrieved_task["text"] == "updated text", "DBでタスクのテキストが更新されること"

    def test_delete_task(self):
        """Test task deletion functionality"""
        db = MemDB()
        op = OperationInteractor(db)
        
        # Get initial task count
        initial_tasks = op.show_tasks()
        initial_count = len(initial_tasks)
        
        # Create a new task
        new_task = Task(id=None, text="task to delete", done=False)
        created_task = op.create_task(new_task)
        task_id = created_task["id"]
        
        # Verify task was created
        tasks_after_create = op.show_tasks()
        assert len(tasks_after_create) == initial_count + 1, "タスクが追加されること"
        
        # Delete the task
        deleted = op.delete_task(task_id)
        assert deleted == True, "タスクが削除されること"
        
        # Verify task was deleted
        tasks_after_delete = op.show_tasks()
        assert len(tasks_after_delete) == initial_count, "タスクが削除されること"
        
        # Verify task is not in database
        retrieved_task = db.get(task_id)
        assert retrieved_task is None, "削除されたタスクはDBから取得できないこと"
