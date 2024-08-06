import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Todo } from '../../shared/interfaces/todo.interface';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-todo-filter',
  template: `
    <form [formGroup]="formGroup">
      <input
        class="form-control form-control-lg border-0 add-todo-input bg-transparent rounded"
        type="text"
        placeholder="Filtrar..."
        formControlName="filter"
      />
    </form>
  `,
  imports: [ReactiveFormsModule],
})
export class TodoFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input({ required: true }) formGroup!: FormGroup;
  @Output() filter = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.listenToFilterCriteriaChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listenToFilterCriteriaChanges(): void {
    this.formGroup
    .get('filter')
    ?.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe((value) => {
      this.filter.emit(value);
    });
  }
}
