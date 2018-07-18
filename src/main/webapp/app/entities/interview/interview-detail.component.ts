import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Interview } from './interview.model';
import { InterviewService } from './interview.service';

@Component({
    selector: 'jhi-interview-detail',
    templateUrl: './interview-detail.component.html'
})
export class InterviewDetailComponent implements OnInit, OnDestroy {

    interview: Interview;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private interviewService: InterviewService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInInterviews();
    }

    load(id) {
        this.interviewService.find(id)
            .subscribe((interviewResponse: HttpResponse<Interview>) => {
                this.interview = interviewResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInInterviews() {
        this.eventSubscriber = this.eventManager.subscribe(
            'interviewListModification',
            (response) => this.load(this.interview.id)
        );
    }
}
