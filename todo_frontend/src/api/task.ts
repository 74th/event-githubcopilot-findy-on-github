import { Task } from "../entity/task";

export async function loadTasks(): Promise<Task[]> {
    const url = "/api/tasks";
    const res = await fetch(url, { method: "GET" });
    return await res.json();
}

export async function postTask(task: Task): Promise<Task[]> {
    const url = "/api/tasks";
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(task),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await res.json();
}

export async function postTaskDone(task: Task): Promise<void> {
    const url = `/api/tasks/${task.id}/done`;
    await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
