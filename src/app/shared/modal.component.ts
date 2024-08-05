import {
  Component,
  ContentChild,
  inject,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [],
  template: ` <div></div> `,
})
export class ModalComponent {
  private modalService = inject(NgbModal);
  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
  @Output() dismiss = new EventEmitter<void>();
  @Input() set isOpen(value: boolean) {
    if (value) {
      this.modalService
        .open(this.template, {
          size: 'sm',
          centered: true,
          windowClass: 'dark-modal',
        })
        .result.then(
          (result) => {},
          (reason) => {
            this.dismiss.emit();
          }
        );
      return;
    }
    this.modalService.dismissAll();
  }
}
