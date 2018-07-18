import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SoftwareSystem } from './software-system.model';
import { SoftwareSystemService } from './software-system.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-software-system',
    templateUrl: './software-system.component.html'
})
export class SoftwareSystemComponent implements OnInit, OnDestroy {
softwareSystems: SoftwareSystem[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private softwareSystemService: SoftwareSystemService,
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
            this.softwareSystemService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SoftwareSystem[]>) => this.softwareSystems = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.softwareSystemService.query().subscribe(
            (res: HttpResponse<SoftwareSystem[]>) => {
                this.softwareSystems = res.body;
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
        this.registerChangeInSoftwareSystems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SoftwareSystem) {
        return item.id;
    }
    registerChangeInSoftwareSystems() {
        this.eventSubscriber = this.eventManager.subscribe('softwareSystemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
