import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ThinkAloud } from './think-aloud.model';
import { ThinkAloudService } from './think-aloud.service';

@Component({
    selector: 'jhi-think-aloud-detail',
    templateUrl: './think-aloud-detail.component.html'
})
export class ThinkAloudDetailComponent implements OnInit, OnDestroy {

    thinkAloud: ThinkAloud;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private thinkAloudService: ThinkAloudService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInThinkAlouds();
    }

    load(id) {
        this.thinkAloudService.find(id)
            .subscribe((thinkAloudResponse: HttpResponse<ThinkAloud>) => {
                this.thinkAloud = thinkAloudResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInThinkAlouds() {
        this.eventSubscriber = this.eventManager.subscribe(
            'thinkAloudListModification',
            (response) => this.load(this.thinkAloud.id)
        );
    }
}
