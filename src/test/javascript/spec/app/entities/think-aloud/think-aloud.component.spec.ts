/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { ThinkAloudComponent } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.component';
import { ThinkAloudService } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.service';
import { ThinkAloud } from '../../../../../../main/webapp/app/entities/think-aloud/think-aloud.model';

describe('Component Tests', () => {

    describe('ThinkAloud Management Component', () => {
        let comp: ThinkAloudComponent;
        let fixture: ComponentFixture<ThinkAloudComponent>;
        let service: ThinkAloudService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [ThinkAloudComponent],
                providers: [
                    ThinkAloudService
                ]
            })
            .overrideTemplate(ThinkAloudComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThinkAloudComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThinkAloudService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ThinkAloud(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.thinkAlouds[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
