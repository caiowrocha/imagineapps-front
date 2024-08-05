import { KeyValue, KeyValuePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-todo-form',
  template: `
    <section>
      <div class="modal-header">
        <h4 class="modal-title">{{ title }} Todo</h4>
        <button (click)="close.emit()" class="btn-close"></button>
      </div>
      <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
        <div class="modal-body">
          @for (control of formGroup.controls | keyvalue: sortByValue; track
          control.key){
          <div class="form-group">
            <label [for]="control.key">{{ control.key }}</label>
            @if(control.key === 'Deadline') {
            <div class="input-group">
              <input
                class="form-control"
                [name]="control.key"
                [id]="control.key"
                [formControlName]="control.key"
                ngbDatepicker
                #datepicker="ngbDatepicker"
              />
              <button
                type="button"
                class="btn btn-outline-secondary bi-calendar3"
                (click)="datepicker.toggle()"
              ></button>
            </div>
            } @else {
            <input
              class="form-control"
              [id]="control.key"
              type="text"
              [formControlName]="control.key"
            />
            }
          </div>
          }
        </div>
        <div class="modal-footer">
          <button
            [formTarget]="formGroup"
            type="submit"
            class="btn btn-primary"
            [disabled]="!formGroup.valid"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  `,
  imports: [ReactiveFormsModule, KeyValuePipe, NgbDatepickerModule],
})
export class TodoFormComponent {
  @Input({ required: true }) title!: 'Adicionar' | 'Editar';
  @Input({ required: true }) formGroup!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  sortByValue = (a: KeyValue<string, any>, b: KeyValue<string, any>) => {
    return 1;
  };
}
