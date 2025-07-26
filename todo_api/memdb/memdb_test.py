import unittest

from todo_api.domain.entity.entity import Task

from .memdb import MemDB

class TestRepository(unittest.TestCase):
    def test_list_add(self):

        repo = MemDB()

        new_id = repo.add(Task(
            id=None,
            text="new task",
            done=False,
        ))

        tasks = repo.search_unfinished()

        assert len(tasks) == 3, "タスクが追加されていること"

        added_task = tasks[-1]
        assert added_task["text"] == "new task", "追加したタスクが末尾に追加されていること"

        assert added_task["id"], "タスクに新しいIDがふられること"
        assert added_task["id"] >= 2, "タスクに新しいIDがふられること"

        assert new_id == added_task["id"], "追加されたIDが返却されること"

        assert len({task["id"] for task in tasks}) == 3, "既存のタスクとは異なるIDが降られていること"

    def test_delete(self):
        repo = MemDB()
        
        # Add a task first
        new_id = repo.add(Task(
            id=None,
            text="task to delete",
            done=False,
        ))
        
        # Verify it exists
        tasks_before = repo.search_unfinished()
        assert len(tasks_before) == 3, "タスクが追加されていること"
        
        # Delete it
        success = repo.delete(new_id)
        assert success, "削除が成功すること"
        
        # Verify it's gone
        tasks_after = repo.search_unfinished()
        assert len(tasks_after) == 2, "タスクが削除されていること"
        
        # Try deleting non-existent task
        success = repo.delete(999)
        assert not success, "存在しないタスクの削除は失敗すること"
