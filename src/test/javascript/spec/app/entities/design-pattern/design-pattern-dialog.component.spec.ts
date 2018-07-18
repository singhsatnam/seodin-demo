/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SeodinTestModule } from '../../../test.module';
import { DesignPatternDialogComponent } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern-dialog.component';
import { DesignPatternService } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.service';
import { DesignPattern } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.model';
import { SourceCodeService } from '../../../../../../main/webapp/app/entities/source-code';

describe('Component Tests', () => {

    describe('DesignPattern Management Dialog Component', () => {
        let comp: DesignPatternDialogComponent;
        let fixture: ComponentFixture<DesignPatternDialogComponent>;
        let service: DesignPatternService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DesignPatternDialogComponent],
                providers: [
                    SourceCodeService,
                    DesignPatternService
                ]
            })
            .overrideTemplate(DesignPatternDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DesignPatternDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DesignPatternService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DesignPattern(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.designPattern = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'designPatternListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DesignPattern();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.designPattern = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'designPatternListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
