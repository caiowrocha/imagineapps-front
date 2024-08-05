export interface Todo {
  title: string;
  description: string;
  deadline: string;
  id: number;
}
export type CreateTodo = Omit<Todo, 'id'>;
export type EditTodo = Partial<Todo>;
export type RemoveTodo = Pick<Todo, 'id'>;
