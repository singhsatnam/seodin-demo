import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DesignPattern } from './design-pattern.model';
import { DesignPatternService } from './design-pattern.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-design-pattern',
    templateUrl: './design-pattern.component.html'
})
export class DesignPatternComponent implements OnInit, OnDestroy {
designPatterns: DesignPattern[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private designPatternService: DesignPatternService,
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
            this.designPatternService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<DesignPattern[]>) => this.designPatterns = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.designPatternService.query().subscribe(
            (res: HttpResponse<DesignPattern[]>) => {
                this.designPatterns = res.body;
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
        this.registerChangeInDesignPatterns();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DesignPattern) {
        return item.id;
    }
    registerChangeInDesignPatterns() {
        this.eventSubscriber = this.eventManager.subscribe('designPatternListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
