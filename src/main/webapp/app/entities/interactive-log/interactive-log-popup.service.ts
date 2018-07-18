import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { InteractiveLog } from './interactive-log.model';
import { InteractiveLogService } from './interactive-log.service';

@Injectable()
export class InteractiveLogPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private interactiveLogService: InteractiveLogService

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
                this.interactiveLogService.find(id)
                    .subscribe((interactiveLogResponse: HttpResponse<InteractiveLog>) => {
                        const interactiveLog: InteractiveLog = interactiveLogResponse.body;
                        if (interactiveLog.recorded) {
                            interactiveLog.recorded = {
                                year: interactiveLog.recorded.getFullYear(),
                                month: interactiveLog.recorded.getMonth() + 1,
                                day: interactiveLog.recorded.getDate()
                            };
                        }
                        this.ngbModalRef = this.interactiveLogModalRef(component, interactiveLog);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.interactiveLogModalRef(component, new InteractiveLog());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    interactiveLogModalRef(component: Component, interactiveLog: InteractiveLog): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.interactiveLog = interactiveLog;
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
