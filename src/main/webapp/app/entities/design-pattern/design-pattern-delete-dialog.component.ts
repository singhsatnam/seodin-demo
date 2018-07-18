import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DesignPattern } from './design-pattern.model';
import { DesignPatternPopupService } from './design-pattern-popup.service';
import { DesignPatternService } from './design-pattern.service';

@Component({
    selector: 'jhi-design-pattern-delete-dialog',
    templateUrl: './design-pattern-delete-dialog.component.html'
})
export class DesignPatternDeleteDialogComponent {

    designPattern: DesignPattern;

    constructor(
        private designPatternService: DesignPatternService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.designPatternService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'designPatternListModification',
                content: 'Deleted an designPattern'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-design-pattern-delete-popup',
    template: ''
})
export class DesignPatternDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private designPatternPopupService: DesignPatternPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.designPatternPopupService
                .open(DesignPatternDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
