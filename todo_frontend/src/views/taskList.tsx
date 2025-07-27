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

interface TaskUpdateForm {
    text: string;
}

const TaskCard = (props: TaskCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset } = useForm<TaskUpdateForm>({
        defaultValues: { text: props.task.text }
    });

    async function clickDone(): Promise<void> {
        await api.postTaskDone(props.task);
        props.reloadTasks();
    }

    async function clickModify(): Promise<void> {
        setIsEditing(true);
        reset({ text: props.task.text });
    }

    async function onUpdateSubmit(data: TaskUpdateForm): Promise<void> {
        if (props.task.id !== undefined) {
            await api.updateTask(props.task.id, data.text);
            setIsEditing(false);
            props.reloadTasks();
        }
    }

    function cancelEdit(): void {
        setIsEditing(false);
        reset({ text: props.task.text });
    }

    async function clickDelete(): Promise<void> {
        if (window.confirm("Are you sure you want to delete this task?")) {
            if (props.task.id !== undefined) {
                await api.deleteTask(props.task.id);
                props.reloadTasks();
            }
        }
    }

    return (
        <div className="card m-2" style={{ width: "28rem" }}>
            <div className="card-body">
                <h5 className="card-title">{props.task.id}</h5>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onUpdateSubmit)}>
                        <div className="mb-3">
                            <input
                                {...register("text", { required: true })}
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success">
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                Cancel
                            </button>
                        </div>
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
