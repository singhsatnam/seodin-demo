import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Defect } from './defect.model';
import { DefectPopupService } from './defect-popup.service';
import { DefectService } from './defect.service';

@Component({
    selector: 'jhi-defect-delete-dialog',
    templateUrl: './defect-delete-dialog.component.html'
})
export class DefectDeleteDialogComponent {

    defect: Defect;

    constructor(
        private defectService: DefectService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.defectService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'defectListModification',
                content: 'Deleted an defect'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-defect-delete-popup',
    template: ''
})
export class DefectDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private defectPopupService: DefectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.defectPopupService
                .open(DefectDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
