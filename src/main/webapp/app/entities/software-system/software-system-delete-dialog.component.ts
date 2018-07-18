import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SoftwareSystem } from './software-system.model';
import { SoftwareSystemPopupService } from './software-system-popup.service';
import { SoftwareSystemService } from './software-system.service';

@Component({
    selector: 'jhi-software-system-delete-dialog',
    templateUrl: './software-system-delete-dialog.component.html'
})
export class SoftwareSystemDeleteDialogComponent {

    softwareSystem: SoftwareSystem;

    constructor(
        private softwareSystemService: SoftwareSystemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.softwareSystemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'softwareSystemListModification',
                content: 'Deleted an softwareSystem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-software-system-delete-popup',
    template: ''
})
export class SoftwareSystemDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private softwareSystemPopupService: SoftwareSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.softwareSystemPopupService
                .open(SoftwareSystemDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
