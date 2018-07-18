import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SourceCode } from './source-code.model';
import { SourceCodePopupService } from './source-code-popup.service';
import { SourceCodeService } from './source-code.service';

@Component({
    selector: 'jhi-source-code-delete-dialog',
    templateUrl: './source-code-delete-dialog.component.html'
})
export class SourceCodeDeleteDialogComponent {

    sourceCode: SourceCode;

    constructor(
        private sourceCodeService: SourceCodeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sourceCodeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sourceCodeListModification',
                content: 'Deleted an sourceCode'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-source-code-delete-popup',
    template: ''
})
export class SourceCodeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sourceCodePopupService: SourceCodePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sourceCodePopupService
                .open(SourceCodeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
