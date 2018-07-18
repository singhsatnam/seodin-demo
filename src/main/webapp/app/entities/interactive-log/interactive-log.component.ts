import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { InteractiveLog } from './interactive-log.model';
import { InteractiveLogService } from './interactive-log.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-interactive-log',
    templateUrl: './interactive-log.component.html'
})
export class InteractiveLogComponent implements OnInit, OnDestroy {
interactiveLogs: InteractiveLog[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private interactiveLogService: InteractiveLogService,
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
            this.interactiveLogService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<InteractiveLog[]>) => this.interactiveLogs = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.interactiveLogService.query().subscribe(
            (res: HttpResponse<InteractiveLog[]>) => {
                this.interactiveLogs = res.body;
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
        this.registerChangeInInteractiveLogs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: InteractiveLog) {
        return item.id;
    }
    registerChangeInInteractiveLogs() {
        this.eventSubscriber = this.eventManager.subscribe('interactiveLogListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
