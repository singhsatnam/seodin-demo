/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { ThinkAloudDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud-delete-dialog.component';
import { ThinkAloudService } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.service';

describe('Component Tests', () => {

    describe('ThinkAloud Management Delete Component', () => {
        let comp: ThinkAloudDeleteDialogComponent;
        let fixture: ComponentFixture<ThinkAloudDeleteDialogComponent>;
        let service: ThinkAloudService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [ThinkAloudDeleteDialogComponent],
                providers: [
                    ThinkAloudService
                ]
            })
            .overrideTemplate(ThinkAloudDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThinkAloudDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThinkAloudService);
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
