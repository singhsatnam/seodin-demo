/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { InteractiveLogDialogComponent } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log-dialog.component';
import { InteractiveLogService } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.service';
import { InteractiveLog } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.model';
import { DeveloperService } from '../../../../../../main/webapp/app/entities/developer';

describe('Component Tests', () => {

    describe('InteractiveLog Management Dialog Component', () => {
        let comp: InteractiveLogDialogComponent;
        let fixture: ComponentFixture<InteractiveLogDialogComponent>;
        let service: InteractiveLogService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InteractiveLogDialogComponent],
                providers: [
                    DeveloperService,
                    InteractiveLogService
                ]
            })
            .overrideTemplate(InteractiveLogDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InteractiveLogDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InteractiveLogService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new InteractiveLog(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.interactiveLog = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'interactiveLogListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new InteractiveLog();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.interactiveLog = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'interactiveLogListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
