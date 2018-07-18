import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ThinkAloud } from './think-aloud.model';
import { ThinkAloudPopupService } from './think-aloud-popup.service';
import { ThinkAloudService } from './think-aloud.service';
import { SoftwareSystem, SoftwareSystemService } from '../software-system';
import { Developer, DeveloperService } from '../developer';

@Component({
    selector: 'jhi-think-aloud-dialog',
    templateUrl: './think-aloud-dialog.component.html'
})
export class ThinkAloudDialogComponent implements OnInit {

    thinkAloud: ThinkAloud;
    isSaving: boolean;

    softwaresystems: SoftwareSystem[];

    developers: Developer[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private thinkAloudService: ThinkAloudService,
        private softwareSystemService: SoftwareSystemService,
        private developerService: DeveloperService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.softwareSystemService.query()
            .subscribe((res: HttpResponse<SoftwareSystem[]>) => { this.softwaresystems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.developerService.query()
            .subscribe((res: HttpResponse<Developer[]>) => { this.developers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.thinkAloud.id !== undefined) {
            this.subscribeToSaveResponse(
                this.thinkAloudService.update(this.thinkAloud));
        } else {
            this.subscribeToSaveResponse(
                this.thinkAloudService.create(this.thinkAloud));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ThinkAloud>>) {
        result.subscribe((res: HttpResponse<ThinkAloud>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ThinkAloud) {
        this.eventManager.broadcast({ name: 'thinkAloudListModification', content: 'OK'});
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

    trackDeveloperById(index: number, item: Developer) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-think-aloud-popup',
    template: ''
})
export class ThinkAloudPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private thinkAloudPopupService: ThinkAloudPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.thinkAloudPopupService
                    .open(ThinkAloudDialogComponent as Component, params['id']);
            } else {
                this.thinkAloudPopupService
                    .open(ThinkAloudDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
