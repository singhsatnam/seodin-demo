import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TestCase } from './test-case.model';
import { TestCasePopupService } from './test-case-popup.service';
import { TestCaseService } from './test-case.service';
import { SoftwareSystem, SoftwareSystemService } from '../software-system';
import { Developer, DeveloperService } from '../developer';

@Component({
    selector: 'jhi-test-case-dialog',
    templateUrl: './test-case-dialog.component.html'
})
export class TestCaseDialogComponent implements OnInit {

    testCase: TestCase;
    isSaving: boolean;

    softwaresystems: SoftwareSystem[];

    developers: Developer[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private testCaseService: TestCaseService,
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
        if (this.testCase.id !== undefined) {
            this.subscribeToSaveResponse(
                this.testCaseService.update(this.testCase));
        } else {
            this.subscribeToSaveResponse(
                this.testCaseService.create(this.testCase));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<TestCase>>) {
        result.subscribe((res: HttpResponse<TestCase>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: TestCase) {
        this.eventManager.broadcast({ name: 'testCaseListModification', content: 'OK'});
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
    selector: 'jhi-test-case-popup',
    template: ''
})
export class TestCasePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private testCasePopupService: TestCasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.testCasePopupService
                    .open(TestCaseDialogComponent as Component, params['id']);
            } else {
                this.testCasePopupService
                    .open(TestCaseDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
