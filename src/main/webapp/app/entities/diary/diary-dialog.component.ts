import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Diary } from './diary.model';
import { DiaryPopupService } from './diary-popup.service';
import { DiaryService } from './diary.service';
import { SoftwareSystem, SoftwareSystemService } from '../software-system';
import { Task, TaskService } from '../task';
import { Developer, DeveloperService } from '../developer';

@Component({
    selector: 'jhi-diary-dialog',
    templateUrl: './diary-dialog.component.html'
})
export class DiaryDialogComponent implements OnInit {

    diary: Diary;
    isSaving: boolean;

    softwaresystems: SoftwareSystem[];

    tasks: Task[];

    developers: Developer[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private diaryService: DiaryService,
        private softwareSystemService: SoftwareSystemService,
        private taskService: TaskService,
        private developerService: DeveloperService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.softwareSystemService.query()
            .subscribe((res: HttpResponse<SoftwareSystem[]>) => { this.softwaresystems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.taskService.query()
            .subscribe((res: HttpResponse<Task[]>) => { this.tasks = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.developerService.query()
            .subscribe((res: HttpResponse<Developer[]>) => { this.developers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.diary.id !== undefined) {
            this.subscribeToSaveResponse(
                this.diaryService.update(this.diary));
        } else {
            this.subscribeToSaveResponse(
                this.diaryService.create(this.diary));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Diary>>) {
        result.subscribe((res: HttpResponse<Diary>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Diary) {
        this.eventManager.broadcast({ name: 'diaryListModification', content: 'OK'});
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

    trackTaskById(index: number, item: Task) {
        return item.id;
    }

    trackDeveloperById(index: number, item: Developer) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-diary-popup',
    template: ''
})
export class DiaryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private diaryPopupService: DiaryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.diaryPopupService
                    .open(DiaryDialogComponent as Component, params['id']);
            } else {
                this.diaryPopupService
                    .open(DiaryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
