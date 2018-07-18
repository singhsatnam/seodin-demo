/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { DesignPatternComponent } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.component';
import { DesignPatternService } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.service';
import { DesignPattern } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.model';

describe('Component Tests', () => {

    describe('DesignPattern Management Component', () => {
        let comp: DesignPatternComponent;
        let fixture: ComponentFixture<DesignPatternComponent>;
        let service: DesignPatternService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DesignPatternComponent],
                providers: [
                    DesignPatternService
                ]
            })
            .overrideTemplate(DesignPatternComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DesignPatternComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DesignPatternService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DesignPattern(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.designPatterns[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
