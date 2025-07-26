import { useForm } from "react-hook-form";
import { Task } from "../entity/task";
import * as api from "../api/task";

interface Props {
    reloadTasks: () => Promise<void>;
}

export const NewTaskForm = (props: Props) => {
    const { register, handleSubmit, reset } = useForm<Task>();

    const onSubmit = async (task: Task) => {
        console.log(task);
        await api.postTask(task);
        reset();
        await props.reloadTasks();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-4">
                    <div className="my-3">
                        <h4>Task Title</h4>
                        <input
                            {...register("text")}
                            type="text"
                            className="form-control"
                            placeholder="task contents"
                        />
                    </div>
                    <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                    >
                        Add
                    </button>
                </div>
            </div>
        </form>
    );
};
