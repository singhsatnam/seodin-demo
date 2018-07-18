import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ThinkAloud } from './think-aloud.model';
import { ThinkAloudService } from './think-aloud.service';

@Injectable()
export class ThinkAloudPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private thinkAloudService: ThinkAloudService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.thinkAloudService.find(id)
                    .subscribe((thinkAloudResponse: HttpResponse<ThinkAloud>) => {
                        const thinkAloud: ThinkAloud = thinkAloudResponse.body;
                        this.ngbModalRef = this.thinkAloudModalRef(component, thinkAloud);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.thinkAloudModalRef(component, new ThinkAloud());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    thinkAloudModalRef(component: Component, thinkAloud: ThinkAloud): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.thinkAloud = thinkAloud;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
