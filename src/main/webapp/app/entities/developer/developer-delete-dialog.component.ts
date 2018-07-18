import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Developer } from './developer.model';
import { DeveloperPopupService } from './developer-popup.service';
import { DeveloperService } from './developer.service';

@Component({
    selector: 'jhi-developer-delete-dialog',
    templateUrl: './developer-delete-dialog.component.html'
})
export class DeveloperDeleteDialogComponent {

    developer: Developer;

    constructor(
        private developerService: DeveloperService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.developerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'developerListModification',
                content: 'Deleted an developer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-developer-delete-popup',
    template: ''
})
export class DeveloperDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private developerPopupService: DeveloperPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.developerPopupService
                .open(DeveloperDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
