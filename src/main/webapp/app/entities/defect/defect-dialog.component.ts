import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Defect } from './defect.model';
import { DefectPopupService } from './defect-popup.service';
import { DefectService } from './defect.service';
import { Developer, DeveloperService } from '../developer';

@Component({
    selector: 'jhi-defect-dialog',
    templateUrl: './defect-dialog.component.html'
})
export class DefectDialogComponent implements OnInit {

    defect: Defect;
    isSaving: boolean;

    developers: Developer[];
    recordedDp: any;
    modifiedDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private defectService: DefectService,
        private developerService: DeveloperService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.developerService.query()
            .subscribe((res: HttpResponse<Developer[]>) => { this.developers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.defect.id !== undefined) {
            this.subscribeToSaveResponse(
                this.defectService.update(this.defect));
        } else {
            this.subscribeToSaveResponse(
                this.defectService.create(this.defect));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Defect>>) {
        result.subscribe((res: HttpResponse<Defect>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Defect) {
        this.eventManager.broadcast({ name: 'defectListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackDeveloperById(index: number, item: Developer) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-defect-popup',
    template: ''
})
export class DefectPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private defectPopupService: DefectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.defectPopupService
                    .open(DefectDialogComponent as Component, params['id']);
            } else {
                this.defectPopupService
                    .open(DefectDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
