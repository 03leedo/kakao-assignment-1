export type Todo = {
  id: number;
  text: string;
  date: string;
  isCompleted: boolean;
};

export type TodoFilter = "all" | "active" | "completed";

export type TodoCreatePayload = {
  text: string;
  date: string;
  isCompleted?: boolean;
};

export type TodoUpdatePayload = Partial<{
  text: string;
  date: string;
  isCompleted: boolean;
}>;

export type TodoQuery = {
  filter?: TodoFilter;
  search?: string;
};
