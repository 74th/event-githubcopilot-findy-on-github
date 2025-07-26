import { useEffect, useState } from "react";
import { NewTaskForm } from "./views/newTask";
import { ListTaskView } from "./views/taskList";
import { Task } from "./entity/task";
import * as api from "./api/task";

function App() {
    const [taskList, setTasks] = useState<Task[]>([]);

    async function reloadTasks() {
        const tasks = await api.loadTasks();
        setTasks(tasks);
    }

    useEffect(() => {
        reloadTasks();
    }, []);

    return (
        <div className="container">
            <NewTaskForm reloadTasks={reloadTasks} />
            <ListTaskView taskList={taskList} reloadTasks={reloadTasks} />
        </div>
    );
}

export default App;
