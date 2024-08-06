export interface Todo {
  title: string;
  description: string;
  deadline: string | Date;
  id: number;
}
export type CreateTodo = Omit<Todo, 'id'>;
export type EditTodo = {
  id: Todo['id'],
  data: CreateTodo
}
export type RemoveTodo = Todo['id'];
