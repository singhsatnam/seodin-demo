/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { InterviewDetailComponent } from '../../../../../../main/webapp/app/entities/interview/interview-detail.component';
import { InterviewService } from '../../../../../../main/webapp/app/entities/interview/interview.service';
import { Interview } from '../../../../../../main/webapp/app/entities/interview/interview.model';

describe('Component Tests', () => {

    describe('Interview Management Detail Component', () => {
        let comp: InterviewDetailComponent;
        let fixture: ComponentFixture<InterviewDetailComponent>;
        let service: InterviewService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InterviewDetailComponent],
                providers: [
                    InterviewService
                ]
            })
            .overrideTemplate(InterviewDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InterviewDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InterviewService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Interview(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.interview).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
