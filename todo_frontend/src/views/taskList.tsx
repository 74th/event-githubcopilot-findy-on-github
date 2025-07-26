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

    async function clickModify(): Promise<void> {
        setIsEditing(true);
        reset({ text: props.task.text });
    }

    async function onSubmitUpdate(data: { text: string }): Promise<void> {
        if (props.task.id === undefined || props.task.id === null) return;
        try {
            await api.updateTask(props.task.id, data.text);
            setIsEditing(false);
            props.reloadTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    function cancelEdit(): void {
        setIsEditing(false);
        reset();
    }

    async function clickDelete(): Promise<void> {
        if (props.task.id === undefined || props.task.id === null) return;
        
        const confirmed = window.confirm("このタスクを削除しますか？");
        if (confirmed) {
            await api.deleteTask(props.task.id);
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
                                {...register("text", { required: true })}
                                type="text"
                                className="form-control"
                                placeholder="タスク内容"
                            />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            保存
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                            キャンセル
                        </button>
                    </form>
                ) : (
                    <>
                        <p className="card-text">{props.task.text}</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" onClick={clickDone}>
                                done
                            </button>
                            <button className="btn btn-warning" onClick={clickModify}>
                                Modify
                            </button>
                            <button className="btn btn-danger" onClick={clickDelete}>
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
