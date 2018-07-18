/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { DiaryDetailComponent } from '../../../../../../main/webapp/app/entities/diary/diary-detail.component';
import { DiaryService } from '../../../../../../main/webapp/app/entities/diary/diary.service';
import { Diary } from '../../../../../../main/webapp/app/entities/diary/diary.model';

describe('Component Tests', () => {

    describe('Diary Management Detail Component', () => {
        let comp: DiaryDetailComponent;
        let fixture: ComponentFixture<DiaryDetailComponent>;
        let service: DiaryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DiaryDetailComponent],
                providers: [
                    DiaryService
                ]
            })
            .overrideTemplate(DiaryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DiaryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DiaryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Diary(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.diary).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
