/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { SoftwareSystemDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/software-system/software-system-delete-dialog.component';
import { SoftwareSystemService } from '../../../../../../main/webapp/app/entities/software-system/software-system.service';

describe('Component Tests', () => {

    describe('SoftwareSystem Management Delete Component', () => {
        let comp: SoftwareSystemDeleteDialogComponent;
        let fixture: ComponentFixture<SoftwareSystemDeleteDialogComponent>;
        let service: SoftwareSystemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [SoftwareSystemDeleteDialogComponent],
                providers: [
                    SoftwareSystemService
                ]
            })
            .overrideTemplate(SoftwareSystemDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SoftwareSystemDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SoftwareSystemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
