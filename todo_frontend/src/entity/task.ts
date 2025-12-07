/**
 * タスク
 */
export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
    id?: number;
    text: string;
    done?: boolean;
    status?: TaskStatus;
}
