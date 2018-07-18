/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { ThinkAloudDialogComponent } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud-dialog.component';
import { ThinkAloudService } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.service';
import { ThinkAloud } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.model';
import { SoftwareSystemService } from '../../../../../../main/webapp/app/entities/software-system';
import { DeveloperService } from '../../../../../../main/webapp/app/entities/developer';

describe('Component Tests', () => {

    describe('ThinkAloud Management Dialog Component', () => {
        let comp: ThinkAloudDialogComponent;
        let fixture: ComponentFixture<ThinkAloudDialogComponent>;
        let service: ThinkAloudService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [ThinkAloudDialogComponent],
                providers: [
                    SoftwareSystemService,
                    DeveloperService,
                    ThinkAloudService
                ]
            })
            .overrideTemplate(ThinkAloudDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThinkAloudDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThinkAloudService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ThinkAloud(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.thinkAloud = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'thinkAloudListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ThinkAloud();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.thinkAloud = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'thinkAloudListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
