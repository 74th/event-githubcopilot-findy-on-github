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
