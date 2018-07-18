/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { InteractiveLogDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log-delete-dialog.component';
import { InteractiveLogService } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.service';

describe('Component Tests', () => {

    describe('InteractiveLog Management Delete Component', () => {
        let comp: InteractiveLogDeleteDialogComponent;
        let fixture: ComponentFixture<InteractiveLogDeleteDialogComponent>;
        let service: InteractiveLogService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InteractiveLogDeleteDialogComponent],
                providers: [
                    InteractiveLogService
                ]
            })
            .overrideTemplate(InteractiveLogDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InteractiveLogDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InteractiveLogService);
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
