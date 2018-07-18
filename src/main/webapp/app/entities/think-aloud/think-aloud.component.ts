import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ThinkAloud } from './think-aloud.model';
import { ThinkAloudService } from './think-aloud.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-think-aloud',
    templateUrl: './think-aloud.component.html'
})
export class ThinkAloudComponent implements OnInit, OnDestroy {
thinkAlouds: ThinkAloud[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private thinkAloudService: ThinkAloudService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.thinkAloudService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<ThinkAloud[]>) => this.thinkAlouds = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.thinkAloudService.query().subscribe(
            (res: HttpResponse<ThinkAloud[]>) => {
                this.thinkAlouds = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInThinkAlouds();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ThinkAloud) {
        return item.id;
    }
    registerChangeInThinkAlouds() {
        this.eventSubscriber = this.eventManager.subscribe('thinkAloudListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
