import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ThinkAloud } from './think-aloud.model';
import { ThinkAloudPopupService } from './think-aloud-popup.service';
import { ThinkAloudService } from './think-aloud.service';

@Component({
    selector: 'jhi-think-aloud-delete-dialog',
    templateUrl: './think-aloud-delete-dialog.component.html'
})
export class ThinkAloudDeleteDialogComponent {

    thinkAloud: ThinkAloud;

    constructor(
        private thinkAloudService: ThinkAloudService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.thinkAloudService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'thinkAloudListModification',
                content: 'Deleted an thinkAloud'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-think-aloud-delete-popup',
    template: ''
})
export class ThinkAloudDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private thinkAloudPopupService: ThinkAloudPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.thinkAloudPopupService
                .open(ThinkAloudDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
