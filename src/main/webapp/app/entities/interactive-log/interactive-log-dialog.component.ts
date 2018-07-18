import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { InteractiveLog } from './interactive-log.model';
import { InteractiveLogPopupService } from './interactive-log-popup.service';
import { InteractiveLogService } from './interactive-log.service';
import { Developer, DeveloperService } from '../developer';

@Component({
    selector: 'jhi-interactive-log-dialog',
    templateUrl: './interactive-log-dialog.component.html'
})
export class InteractiveLogDialogComponent implements OnInit {

    interactiveLog: InteractiveLog;
    isSaving: boolean;

    developers: Developer[];
    recordedDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private interactiveLogService: InteractiveLogService,
        private developerService: DeveloperService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.developerService.query()
            .subscribe((res: HttpResponse<Developer[]>) => { this.developers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.interactiveLog.id !== undefined) {
            this.subscribeToSaveResponse(
                this.interactiveLogService.update(this.interactiveLog));
        } else {
            this.subscribeToSaveResponse(
                this.interactiveLogService.create(this.interactiveLog));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<InteractiveLog>>) {
        result.subscribe((res: HttpResponse<InteractiveLog>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: InteractiveLog) {
        this.eventManager.broadcast({ name: 'interactiveLogListModification', content: 'OK'});
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
    selector: 'jhi-interactive-log-popup',
    template: ''
})
export class InteractiveLogPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private interactiveLogPopupService: InteractiveLogPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.interactiveLogPopupService
                    .open(InteractiveLogDialogComponent as Component, params['id']);
            } else {
                this.interactiveLogPopupService
                    .open(InteractiveLogDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
