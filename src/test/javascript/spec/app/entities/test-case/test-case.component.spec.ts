/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { TestCaseComponent } from '../../../../../../main/webapp/app/entities/test-case/test-case.component';
import { TestCaseService } from '../../../../../../main/webapp/app/entities/test-case/test-case.service';
import { TestCase } from '../../../../../../main/webapp/app/entities/test-case/test-case.model';

describe('Component Tests', () => {

    describe('TestCase Management Component', () => {
        let comp: TestCaseComponent;
        let fixture: ComponentFixture<TestCaseComponent>;
        let service: TestCaseService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [TestCaseComponent],
                providers: [
                    TestCaseService
                ]
            })
            .overrideTemplate(TestCaseComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TestCaseComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestCaseService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new TestCase(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.testCases[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
