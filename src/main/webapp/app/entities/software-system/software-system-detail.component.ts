import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SoftwareSystem } from './software-system.model';
import { SoftwareSystemService } from './software-system.service';

@Component({
    selector: 'jhi-software-system-detail',
    templateUrl: './software-system-detail.component.html'
})
export class SoftwareSystemDetailComponent implements OnInit, OnDestroy {

    softwareSystem: SoftwareSystem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private softwareSystemService: SoftwareSystemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSoftwareSystems();
    }

    load(id) {
        this.softwareSystemService.find(id)
            .subscribe((softwareSystemResponse: HttpResponse<SoftwareSystem>) => {
                this.softwareSystem = softwareSystemResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSoftwareSystems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'softwareSystemListModification',
            (response) => this.load(this.softwareSystem.id)
        );
    }
}
