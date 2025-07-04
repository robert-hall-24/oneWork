// models/Task.ts
export interface Task {
    id: string;
    title: string;
    description?: string;
    is_shared: boolean;
    user_id: string;
    created_at: string;
  }