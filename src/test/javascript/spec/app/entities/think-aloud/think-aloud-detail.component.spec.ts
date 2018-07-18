/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { ThinkAloudDetailComponent } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud-detail.component';
import { ThinkAloudService } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.service';
import { ThinkAloud } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.model';

describe('Component Tests', () => {

    describe('ThinkAloud Management Detail Component', () => {
        let comp: ThinkAloudDetailComponent;
        let fixture: ComponentFixture<ThinkAloudDetailComponent>;
        let service: ThinkAloudService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [ThinkAloudDetailComponent],
                providers: [
                    ThinkAloudService
                ]
            })
            .overrideTemplate(ThinkAloudDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThinkAloudDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThinkAloudService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ThinkAloud(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.thinkAloud).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
