/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { TestCaseDetailComponent } from '../../../../../../main/webapp/app/entities/test-case/test-case-detail.component';
import { TestCaseService } from '../../../../../../main/webapp/app/entities/test-case/test-case.service';
import { TestCase } from '../../../../../../main/webapp/app/entities/test-case/test-case.model';

describe('Component Tests', () => {

    describe('TestCase Management Detail Component', () => {
        let comp: TestCaseDetailComponent;
        let fixture: ComponentFixture<TestCaseDetailComponent>;
        let service: TestCaseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [TestCaseDetailComponent],
                providers: [
                    TestCaseService
                ]
            })
            .overrideTemplate(TestCaseDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TestCaseDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestCaseService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new TestCase(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.testCase).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
