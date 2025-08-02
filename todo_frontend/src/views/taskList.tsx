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
    const { register, handleSubmit, reset } = useForm<{ text: string }>();

    async function clickDone(): Promise<void> {
        await api.postTaskDone(props.task);
        props.reloadTasks();
    }

    async function clickDelete(): Promise<void> {
        const confirmed = window.confirm("このタスクを削除しますか？");
        if (confirmed && props.task.id !== undefined) {
            await api.deleteTask(props.task.id);
            props.reloadTasks();
        }
    }

    async function clickModify(): Promise<void> {
        setIsEditing(true);
        reset({ text: props.task.text });
    }

    async function onSubmitUpdate(data: { text: string }): Promise<void> {
        if (props.task.id !== undefined) {
            await api.updateTask(props.task.id, data.text);
            setIsEditing(false);
            props.reloadTasks();
        }
    }

    function cancelEdit(): void {
        setIsEditing(false);
        reset();
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
                        <button className="btn btn-success me-2" type="submit">
                            Save
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            type="button" 
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <>
                        <p className="card-text">{props.task.text}</p>
                        <button className="btn btn-primary me-2" onClick={clickDone}>
                            Done
                        </button>
                        <button className="btn btn-warning me-2" onClick={clickModify}>
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
