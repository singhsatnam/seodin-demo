/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { DesignPatternDetailComponent } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern-detail.component';
import { DesignPatternService } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.service';
import { DesignPattern } from '../../../../../../main/webapp/app/entities/design-pattern/design-pattern.model';

describe('Component Tests', () => {

    describe('DesignPattern Management Detail Component', () => {
        let comp: DesignPatternDetailComponent;
        let fixture: ComponentFixture<DesignPatternDetailComponent>;
        let service: DesignPatternService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DesignPatternDetailComponent],
                providers: [
                    DesignPatternService
                ]
            })
            .overrideTemplate(DesignPatternDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DesignPatternDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DesignPatternService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DesignPattern(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.designPattern).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
