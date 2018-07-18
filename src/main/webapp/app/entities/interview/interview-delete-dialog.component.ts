import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Interview } from './interview.model';
import { InterviewPopupService } from './interview-popup.service';
import { InterviewService } from './interview.service';

@Component({
    selector: 'jhi-interview-delete-dialog',
    templateUrl: './interview-delete-dialog.component.html'
})
export class InterviewDeleteDialogComponent {

    interview: Interview;

    constructor(
        private interviewService: InterviewService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.interviewService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'interviewListModification',
                content: 'Deleted an interview'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-interview-delete-popup',
    template: ''
})
export class InterviewDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private interviewPopupService: InterviewPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.interviewPopupService
                .open(InterviewDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
