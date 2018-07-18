import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SourceCode } from './source-code.model';
import { SourceCodePopupService } from './source-code-popup.service';
import { SourceCodeService } from './source-code.service';
import { SoftwareSystem, SoftwareSystemService } from '../software-system';

@Component({
    selector: 'jhi-source-code-dialog',
    templateUrl: './source-code-dialog.component.html'
})
export class SourceCodeDialogComponent implements OnInit {

    sourceCode: SourceCode;
    isSaving: boolean;

    softwaresystems: SoftwareSystem[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private sourceCodeService: SourceCodeService,
        private softwareSystemService: SoftwareSystemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.softwareSystemService.query()
            .subscribe((res: HttpResponse<SoftwareSystem[]>) => { this.softwaresystems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.sourceCode.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sourceCodeService.update(this.sourceCode));
        } else {
            this.subscribeToSaveResponse(
                this.sourceCodeService.create(this.sourceCode));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SourceCode>>) {
        result.subscribe((res: HttpResponse<SourceCode>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SourceCode) {
        this.eventManager.broadcast({ name: 'sourceCodeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSoftwareSystemById(index: number, item: SoftwareSystem) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-source-code-popup',
    template: ''
})
export class SourceCodePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sourceCodePopupService: SourceCodePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sourceCodePopupService
                    .open(SourceCodeDialogComponent as Component, params['id']);
            } else {
                this.sourceCodePopupService
                    .open(SourceCodeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
