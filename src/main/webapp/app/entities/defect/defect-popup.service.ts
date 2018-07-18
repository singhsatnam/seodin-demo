import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Defect } from './defect.model';
import { DefectService } from './defect.service';

@Injectable()
export class DefectPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private defectService: DefectService

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
                this.defectService.find(id)
                    .subscribe((defectResponse: HttpResponse<Defect>) => {
                        const defect: Defect = defectResponse.body;
                        if (defect.recorded) {
                            defect.recorded = {
                                year: defect.recorded.getFullYear(),
                                month: defect.recorded.getMonth() + 1,
                                day: defect.recorded.getDate()
                            };
                        }
                        if (defect.modified) {
                            defect.modified = {
                                year: defect.modified.getFullYear(),
                                month: defect.modified.getMonth() + 1,
                                day: defect.modified.getDate()
                            };
                        }
                        this.ngbModalRef = this.defectModalRef(component, defect);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.defectModalRef(component, new Defect());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    defectModalRef(component: Component, defect: Defect): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.defect = defect;
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
