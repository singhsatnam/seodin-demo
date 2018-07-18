import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SourceCode } from './source-code.model';
import { SourceCodeService } from './source-code.service';

@Component({
    selector: 'jhi-source-code-detail',
    templateUrl: './source-code-detail.component.html'
})
export class SourceCodeDetailComponent implements OnInit, OnDestroy {

    sourceCode: SourceCode;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sourceCodeService: SourceCodeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSourceCodes();
    }

    load(id) {
        this.sourceCodeService.find(id)
            .subscribe((sourceCodeResponse: HttpResponse<SourceCode>) => {
                this.sourceCode = sourceCodeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSourceCodes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sourceCodeListModification',
            (response) => this.load(this.sourceCode.id)
        );
    }
}
