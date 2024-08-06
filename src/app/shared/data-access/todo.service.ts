import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, switchMap, from, of, take, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Todo,
  CreateTodo,
  EditTodo,
  RemoveTodo,
} from '../interfaces/todo.interface';

export interface TodosState {
  todos: Todo[];
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  apiUrl = 'http://localhost:3000/';

  http = inject(HttpClient);

  private state = signal<TodosState>({
    todos: [],
  });

  todos$ = this.getAllTodos();
  add$ = new Subject<CreateTodo>();
  edit$ = new Subject<EditTodo>();
  remove$ = new Subject<RemoveTodo>();
  filter$ = new Subject<string>();

  todos = computed(() => this.state().todos);

  constructor() {
    this.updateTodoState();
    this.handleAddTodo();
    this.handleEditTodo();
    this.handleRemoveTodo();
    this.handleFilterTodo();
  }


  updateTodoState(): void {
    this.todos$.pipe(take(1)).subscribe((todos) => {
      this.state.update((state) => ({
        ...state,
        todos,
      }));
    });
  }

  private getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}todos/`);
  }

  private handleAddTodo(): void {
    this.add$.pipe(takeUntilDestroyed(),
    switchMap(
      todo => this.http.post<Todo>(`${this.apiUrl}todos/`, todo)
    )).subscribe({
      next: () => {
        this.updateTodoState();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private handleEditTodo(): void {
    this.edit$.pipe(takeUntilDestroyed(),
    switchMap(
      todo => {
        return this.http.patch<Todo>(`${this.apiUrl}todos/${todo.id}`, todo.data)
    }
    )).subscribe({
      next: () => {
        this.updateTodoState();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private handleRemoveTodo(): void {
    this.remove$.pipe(takeUntilDestroyed(),
    switchMap(
      id => this.http.delete<Todo>(`${this.apiUrl}todos/${id}`)
    )).subscribe({
      next: () => {
        this.updateTodoState();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private handleFilterTodo(): void {
    this.filter$.pipe(takeUntilDestroyed(),
    ).subscribe(string => console.log(string));
  }
}
