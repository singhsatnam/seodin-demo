import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Audio } from './audio.model';
import { AudioPopupService } from './audio-popup.service';
import { AudioService } from './audio.service';
import { Interview, InterviewService } from '../interview';

@Component({
    selector: 'jhi-audio-dialog',
    templateUrl: './audio-dialog.component.html'
})
export class AudioDialogComponent implements OnInit {

    audio: Audio;
    isSaving: boolean;

    interviews: Interview[];
    recordedDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private audioService: AudioService,
        private interviewService: InterviewService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.interviewService.query()
            .subscribe((res: HttpResponse<Interview[]>) => { this.interviews = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.audio.id !== undefined) {
            this.subscribeToSaveResponse(
                this.audioService.update(this.audio));
        } else {
            this.subscribeToSaveResponse(
                this.audioService.create(this.audio));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Audio>>) {
        result.subscribe((res: HttpResponse<Audio>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Audio) {
        this.eventManager.broadcast({ name: 'audioListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackInterviewById(index: number, item: Interview) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-audio-popup',
    template: ''
})
export class AudioPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private audioPopupService: AudioPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.audioPopupService
                    .open(AudioDialogComponent as Component, params['id']);
            } else {
                this.audioPopupService
                    .open(AudioDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
