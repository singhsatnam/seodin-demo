/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { StudyDetailComponent } from '../../../../../../main/webapp/app/entities/study/study-detail.component';
import { StudyService } from '../../../../../../main/webapp/app/entities/study/study.service';
import { Study } from '../../../../../../main/webapp/app/entities/study/study.model';

describe('Component Tests', () => {

    describe('Study Management Detail Component', () => {
        let comp: StudyDetailComponent;
        let fixture: ComponentFixture<StudyDetailComponent>;
        let service: StudyService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [StudyDetailComponent],
                providers: [
                    StudyService
                ]
            })
            .overrideTemplate(StudyDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StudyDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StudyService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Study(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.study).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
