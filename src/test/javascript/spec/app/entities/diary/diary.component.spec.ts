/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { DiaryComponent } from '../../../../../../main/webapp/app/entities/diary/diary.component';
import { DiaryService } from '../../../../../../main/webapp/app/entities/diary/diary.service';
import { Diary } from '../../../../../../main/webapp/app/entities/diary/diary.model';

describe('Component Tests', () => {

    describe('Diary Management Component', () => {
        let comp: DiaryComponent;
        let fixture: ComponentFixture<DiaryComponent>;
        let service: DiaryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DiaryComponent],
                providers: [
                    DiaryService
                ]
            })
            .overrideTemplate(DiaryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DiaryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DiaryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Diary(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.diaries[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
