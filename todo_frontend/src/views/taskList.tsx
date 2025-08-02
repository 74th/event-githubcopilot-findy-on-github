import { useState } from "react";
import { useForm } from "react-hook-form";
import { Task } from "../entity/task";
import * as api from "../api/task";

interface ListTaskViewProps {
    taskList: Task[];
    reloadTasks: () => Promise<void>;
}

export const ListTaskView = (props: ListTaskViewProps) => {
    const cards = props.taskList.map((task) => (
        <TaskCard
            task={task}
            reloadTasks={props.reloadTasks}
            key={task.id}
        ></TaskCard>
    ));
    return <div className="row p-2">{cards}</div>;
};

interface TaskCardProps {
    task: Task;
    reloadTasks: () => Promise<void>;
}

const TaskCard = (props: TaskCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset } = useForm<Task>();

    async function clickDone(): Promise<void> {
        await api.postTaskDone(props.task);
        props.reloadTasks();
    }

    async function clickModify(): Promise<void> {
        setIsEditing(true);
        reset({ text: props.task.text });
    }

    async function onSubmitUpdate(taskData: Task): Promise<void> {
        await api.updateTask({ ...props.task, text: taskData.text });
        setIsEditing(false);
        props.reloadTasks();
    }

    function cancelEdit(): void {
        setIsEditing(false);
        reset();
    }

    async function clickDelete(): Promise<void> {
        if (window.confirm("このタスクを削除しますか？")) {
            await api.deleteTask(props.task.id!);
            props.reloadTasks();
        }
    }

    return (
        <div className="card m-2" style={{ width: "28rem" }}>
            <div className="card-body">
                <h5 className="card-title">{props.task.id}</h5>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <div className="mb-3">
                            <input
                                {...register("text")}
                                type="text"
                                className="form-control"
                                defaultValue={props.task.text}
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-sm me-2">
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <>
                        <p className="card-text">{props.task.text}</p>
                        <button className="btn btn-primary me-2" onClick={clickDone}>
                            done
                        </button>
                        <button className="btn btn-outline-secondary me-2" onClick={clickModify}>
                            Modify
                        </button>
                        <button className="btn btn-danger" onClick={clickDelete}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
