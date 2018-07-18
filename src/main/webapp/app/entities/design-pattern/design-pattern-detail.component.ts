import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DesignPattern } from './design-pattern.model';
import { DesignPatternService } from './design-pattern.service';

@Component({
    selector: 'jhi-design-pattern-detail',
    templateUrl: './design-pattern-detail.component.html'
})
export class DesignPatternDetailComponent implements OnInit, OnDestroy {

    designPattern: DesignPattern;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private designPatternService: DesignPatternService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDesignPatterns();
    }

    load(id) {
        this.designPatternService.find(id)
            .subscribe((designPatternResponse: HttpResponse<DesignPattern>) => {
                this.designPattern = designPatternResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDesignPatterns() {
        this.eventSubscriber = this.eventManager.subscribe(
            'designPatternListModification',
            (response) => this.load(this.designPattern.id)
        );
    }
}
