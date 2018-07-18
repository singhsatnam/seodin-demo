/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { InteractiveLogDetailComponent } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log-detail.component';
import { InteractiveLogService } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.service';
import { InteractiveLog } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.model';

describe('Component Tests', () => {

    describe('InteractiveLog Management Detail Component', () => {
        let comp: InteractiveLogDetailComponent;
        let fixture: ComponentFixture<InteractiveLogDetailComponent>;
        let service: InteractiveLogService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InteractiveLogDetailComponent],
                providers: [
                    InteractiveLogService
                ]
            })
            .overrideTemplate(InteractiveLogDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InteractiveLogDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InteractiveLogService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new InteractiveLog(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.interactiveLog).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
