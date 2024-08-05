import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, switchMap, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  http = inject(HttpClient);

  private state = signal<TodosState>({
    todos: [],
  });

  todos$ = this.getTodos();
  add$ = new Subject<CreateTodo | {}>();
  edit$ = new Subject<EditTodo | {}>();
  remove$ = new Subject<RemoveTodo | {}>();

  todos = computed(() => this.state().todos);

  constructor() {
    this.todos$.pipe(takeUntilDestroyed()).subscribe((todos) =>
      this.state.update((state) => ({
        ...state,
        todos,
      }))
    );

    this.add$.pipe(takeUntilDestroyed()).subscribe({
      next: (todo) => {
        console.log(todo);
      },
      error: (err) => {
        console.log('Não foi possível adicionar');
      },
    });

    this.edit$.pipe(takeUntilDestroyed()).subscribe({
      next: (todo) => {
        console.log(todo);
      },
      error: (err) => {
        console.log('Não foi possível editar');
      },
    });

    this.remove$.pipe(takeUntilDestroyed()).subscribe({
      next: (todo) => {
        console.log(todo);
      },
      error: (err) => {
        console.log('Não foi possível remover');
      },
    });
  }

  private getTodos(): Observable<Todo[]> {
    return of([
      {
        id: 1,
        title: 'Título - 1',
        description: 'Descrição - 1',
        deadline: '2024-12-02',
      },
      {
        id: 2,
        title: 'Título - 2',
        description: 'Descrição - 2',
        deadline: '2024-05-03',
      },
      {
        id: 3,
        title: 'Título - 3',
        description: 'Descrição - 3',
        deadline: '2024-03-02',
      },
    ]);
  }
}
