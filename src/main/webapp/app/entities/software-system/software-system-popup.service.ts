import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SoftwareSystem } from './software-system.model';
import { SoftwareSystemService } from './software-system.service';

@Injectable()
export class SoftwareSystemPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private softwareSystemService: SoftwareSystemService

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
                this.softwareSystemService.find(id)
                    .subscribe((softwareSystemResponse: HttpResponse<SoftwareSystem>) => {
                        const softwareSystem: SoftwareSystem = softwareSystemResponse.body;
                        this.ngbModalRef = this.softwareSystemModalRef(component, softwareSystem);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.softwareSystemModalRef(component, new SoftwareSystem());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    softwareSystemModalRef(component: Component, softwareSystem: SoftwareSystem): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.softwareSystem = softwareSystem;
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
