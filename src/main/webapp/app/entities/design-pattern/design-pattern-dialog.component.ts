import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DesignPattern } from './design-pattern.model';
import { DesignPatternPopupService } from './design-pattern-popup.service';
import { DesignPatternService } from './design-pattern.service';
import { SourceCode, SourceCodeService } from '../source-code';

@Component({
    selector: 'jhi-design-pattern-dialog',
    templateUrl: './design-pattern-dialog.component.html'
})
export class DesignPatternDialogComponent implements OnInit {

    designPattern: DesignPattern;
    isSaving: boolean;

    sourcecodes: SourceCode[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private designPatternService: DesignPatternService,
        private sourceCodeService: SourceCodeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.sourceCodeService.query()
            .subscribe((res: HttpResponse<SourceCode[]>) => { this.sourcecodes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.designPattern.id !== undefined) {
            this.subscribeToSaveResponse(
                this.designPatternService.update(this.designPattern));
        } else {
            this.subscribeToSaveResponse(
                this.designPatternService.create(this.designPattern));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DesignPattern>>) {
        result.subscribe((res: HttpResponse<DesignPattern>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DesignPattern) {
        this.eventManager.broadcast({ name: 'designPatternListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSourceCodeById(index: number, item: SourceCode) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-design-pattern-popup',
    template: ''
})
export class DesignPatternPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private designPatternPopupService: DesignPatternPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.designPatternPopupService
                    .open(DesignPatternDialogComponent as Component, params['id']);
            } else {
                this.designPatternPopupService
                    .open(DesignPatternDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
