import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Developer } from './developer.model';
import { DeveloperPopupService } from './developer-popup.service';
import { DeveloperService } from './developer.service';
import { Study, StudyService } from '../study';

@Component({
    selector: 'jhi-developer-dialog',
    templateUrl: './developer-dialog.component.html'
})
export class DeveloperDialogComponent implements OnInit {

    developer: Developer;
    isSaving: boolean;

    studies: Study[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private developerService: DeveloperService,
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
        if (this.developer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.developerService.update(this.developer));
        } else {
            this.subscribeToSaveResponse(
                this.developerService.create(this.developer));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Developer>>) {
        result.subscribe((res: HttpResponse<Developer>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Developer) {
        this.eventManager.broadcast({ name: 'developerListModification', content: 'OK'});
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
    selector: 'jhi-developer-popup',
    template: ''
})
export class DeveloperPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private developerPopupService: DeveloperPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.developerPopupService
                    .open(DeveloperDialogComponent as Component, params['id']);
            } else {
                this.developerPopupService
                    .open(DeveloperDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
