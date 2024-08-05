import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../shared/interfaces/todo.interface';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  template: `
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col" class="text-center">Title</th>
          <th scope="col" class="text-center">Description</th>
          <th scope="col" class="text-center">Deadline</th>
          <th class="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        @for (todo of todos; track todo.id;) {
        <tr>
          <td class="text-center">
            {{ todo.title }}
          </td>
          <td class="text-center">{{ todo.description }}</td>
          <td class="text-center">
            @if(getDaysDifference(todo.deadline) < 0) {
            <span class="text-danger"> Acabou o prazo! </span>
            } @else { Ainda faltam {{ getDaysDifference(todo.deadline) }} dias.
            }
          </td>
          <td class="text-center">
            <div class="d-flex">
              <div class="mx-auto">
                <button
                  (click)="edit.emit(todo)"
                  type="button"
                  class="btn btn-primary bi-pencil md-21 py-1 m-1"
                ></button>
                <button
                  (click)="delete.emit(todo.id)"
                  type="button"
                  class="btn btn-danger bi-trash md-21 py-1"
                ></button>
              </div>
            </div>
          </td>
        </tr>
        }
      </tbody>
    </table>
    @if(todos.length === 0) {
    <div class="alert alert-info">
      <div class="row">
        <div class="mx-auto text-center">
          Não Todos com essas especificações.
        </div>
      </div>
    </div>
    }
  `,
})
export class TodoListComponent {
  @Output() edit = new EventEmitter<Partial<Todo>>();
  @Output() delete = new EventEmitter<Todo['id']>();
  @Input({ required: true }) todos!: any;

  getDaysDifference(deadline: any): number {
    const dueDate = new Date(deadline).getTime();
    const today = Date.now();
    const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    return diff;
  }
}
