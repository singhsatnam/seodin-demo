/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { InterviewComponent } from '../../../../../../main/webapp/app/entities/interview/interview.component';
import { InterviewService } from '../../../../../../main/webapp/app/entities/interview/interview.service';
import { Interview } from '../../../../../../main/webapp/app/entities/interview/interview.model';

describe('Component Tests', () => {

    describe('Interview Management Component', () => {
        let comp: InterviewComponent;
        let fixture: ComponentFixture<InterviewComponent>;
        let service: InterviewService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InterviewComponent],
                providers: [
                    InterviewService
                ]
            })
            .overrideTemplate(InterviewComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InterviewComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InterviewService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Interview(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.interviews[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
