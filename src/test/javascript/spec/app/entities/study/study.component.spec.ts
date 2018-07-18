/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { StudyComponent } from '../../../../../../main/webapp/app/entities/study/study.component';
import { StudyService } from '../../../../../../main/webapp/app/entities/study/study.service';
import { Study } from '../../../../../../main/webapp/app/entities/study/study.model';

describe('Component Tests', () => {

    describe('Study Management Component', () => {
        let comp: StudyComponent;
        let fixture: ComponentFixture<StudyComponent>;
        let service: StudyService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [StudyComponent],
                providers: [
                    StudyService
                ]
            })
            .overrideTemplate(StudyComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StudyComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StudyService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Study(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.studies[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
