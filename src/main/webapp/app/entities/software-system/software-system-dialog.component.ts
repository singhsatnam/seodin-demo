import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SoftwareSystem } from './software-system.model';
import { SoftwareSystemPopupService } from './software-system-popup.service';
import { SoftwareSystemService } from './software-system.service';
import { Study, StudyService } from '../study';

@Component({
    selector: 'jhi-software-system-dialog',
    templateUrl: './software-system-dialog.component.html'
})
export class SoftwareSystemDialogComponent implements OnInit {

    softwareSystem: SoftwareSystem;
    isSaving: boolean;

    studies: Study[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private softwareSystemService: SoftwareSystemService,
        private studyService: StudyService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.studyService.query()
            .subscribe((res: HttpResponse<Study[]>) => { this.studies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.softwareSystem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.softwareSystemService.update(this.softwareSystem));
        } else {
            this.subscribeToSaveResponse(
                this.softwareSystemService.create(this.softwareSystem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SoftwareSystem>>) {
        result.subscribe((res: HttpResponse<SoftwareSystem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SoftwareSystem) {
        this.eventManager.broadcast({ name: 'softwareSystemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackStudyById(index: number, item: Study) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-software-system-popup',
    template: ''
})
export class SoftwareSystemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private softwareSystemPopupService: SoftwareSystemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.softwareSystemPopupService
                    .open(SoftwareSystemDialogComponent as Component, params['id']);
            } else {
                this.softwareSystemPopupService
                    .open(SoftwareSystemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
