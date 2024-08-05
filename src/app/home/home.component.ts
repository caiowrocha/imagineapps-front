import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ModalComponent } from '../shared/modal.component';
import { TodoFormComponent } from './ui/todo-form.component';
import { TodoListComponent } from './ui/todo-list.component';
import { TodoFilterComponent } from './ui/todo-filter.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Todo } from '../shared/interfaces/todo.interface';
import { TodoService } from '../shared/data-access/todo.service';
import { dateToString } from '../shared/utils/date-formatter';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  standalone: true,
  selector: 'app-home',
  styles: [``],
  template: `
    <div class="container m-5 p-2 rounded mx-auto bg-light shadow">
      <div class="row m-1 p-4">
        <div class="col">
          <div class="p-1 h1 text-center mx-auto">
            <span>Todo List</span>
          </div>
        </div>
      </div>
      <div class="row m-1 p-3">
        <div class="col col-11 mx-auto">
          <div
            class="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center"
          >
            <div class="col">
              <app-todo-filter
                [formGroup]="todoFilterFormGroup"
                (filter)="handleFilterTodos($event)"
              ></app-todo-filter>
            </div>
            <div class="col-auto px-0 mx-0 mr-2">
              <button
                type="button"
                class="btn btn-outline-secondary btn-floating bi-plus-lg"
                (click)="todoBeingCreatedOrEdited.set({})"
              ></button>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <main>
          <div class="card">
            <div class="card-body">
              <app-todo-list
                [todos]="todos()"
                (edit)="todoBeingCreatedOrEdited.set($event)"
                (delete)="todoService.remove$.next($event)"
              >
              </app-todo-list>
            </div>
          </div>
          <app-modal
            [isOpen]="!!todoBeingCreatedOrEdited()"
            (dismiss)="todoBeingCreatedOrEdited.set(null)"
          >
            <ng-template>
              <app-todo-form
                [title]="
                  todoBeingCreatedOrEdited()?.id ? 'Editar' : 'Adicionar'
                "
                [formGroup]="todoFormGroup"
                (close)="todoBeingCreatedOrEdited.set(null)"
                (save)="handleSaveTodo()"
              >
              </app-todo-form>
            </ng-template>
          </app-modal>
        </main>
      </div>
    </div>
  `,
  imports: [
    ModalComponent,
    TodoFormComponent,
    TodoListComponent,
    TodoFilterComponent,
  ],
})
export default class HomeComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  todoService = inject(TodoService);
  formBuilder = inject(FormBuilder);
  todos = signal<Partial<Todo[]>>(this.todoService.todos());
  todoBeingCreatedOrEdited = signal<Partial<Todo> | null>(null);

  todoFormGroup = this.formBuilder.nonNullable.group({
    Deadline: [
      {
        year: 0,
        month: 0,
        day: 0,
      },
      Validators.required,
    ],
    Title: ['', Validators.required],
    Description: ['', Validators.required],
  });

  todoFilterFormGroup = this.formBuilder.group({
    filter: [''],
  });

  constructor() {
    effect(() => {
      const todo = this.todoBeingCreatedOrEdited();

      if (!todo) {
        this.todoFormGroup.reset();
      } else {
        console.log(this.todoBeingCreatedOrEdited());
      }
    });
  }

  handleFilterTodos(event: string): void {
    if (!event) {
      this.todos.set(this.todoService.todos());
      return;
    }
    this.todos.update((todos) => this.todoService.todos());

    const filterTerm = event.toLowerCase();

    this.todos.update((todos) => {
      return todos.filter((todo) => {
        return [
          todo?.description.toLowerCase(),
          todo?.title.toLowerCase(),
        ].some((string) => String(string).includes(filterTerm));
      });
    });
  }

  handleSaveTodo(): void {
    const { Deadline, Title, Description } = this.todoFormGroup.getRawValue();

    const deadline = dateToString(Deadline);

    const formValues = {
      title: Title,
      description: Description,
      deadline,
    };

    this.todoBeingCreatedOrEdited()?.id
      ? this.todoService.edit$.next({
          id: this.todoBeingCreatedOrEdited()!.id!,
          value: formValues,
        })
      : this.todoService.add$.next(formValues);
  }
}
