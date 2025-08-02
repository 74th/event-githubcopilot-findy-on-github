import os
from typing import cast
from flask import Flask, render_template, request
from todo_api.domain.entity.entity import Task
from todo_api.domain.usecase import OperationInteractor

from todo_api.memdb.memdb import MemDB

webroot = os.environ.get("WEBROOT", "./public")

db = MemDB()
op = OperationInteractor(db)

app = Flask(
    __name__,
    static_url_path="",
    static_folder=webroot,
    template_folder=webroot,
)

# index.html
@app.route("/")
def index():
    return render_template("index.html")


# 未完了のタスクの一覧を表示する
# GET /api/tasks
@app.route("/api/tasks", methods=["GET"])
def show_remained_tasks():
    return op.show_tasks()


# タスクを登録する
# POST /api/tasks
@app.route("/api/tasks", methods=["POST"])
def append_task()-> Task:
    task = cast(Task, request.get_json())
    new_task = op.create_task(task)
    return new_task


# タスクを完了にする
# PATCH /api/tasks/<タスクのID>/done
@app.route("/api/tasks/<int:task_id>/done", methods=["PATCH"])
def done_task(task_id: int):
    task = op.done_task(task_id)
    return task


# タスクのテキストを更新する
# PUT /api/tasks/<タスクのID>
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id: int):
    data = request.get_json()
    if not data or "text" not in data:
        return {"error": "text field is required"}, 400
    task = op.update_task(task_id, data["text"])
    return task


# タスクを削除する
# DELETE /api/tasks/<タスクのID>
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id: int):
    success = op.delete_task(task_id)
    if success:
        return {"success": True}
    else:
        return {"error": "Task not found"}, 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)