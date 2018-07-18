/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { DeveloperDetailComponent } from '../../../../../../main/webapp/app/entities/developer/developer-detail.component';
import { DeveloperService } from '../../../../../../main/webapp/app/entities/developer/developer.service';
import { Developer } from '../../../../../../main/webapp/app/entities/developer/developer.model';

describe('Component Tests', () => {

    describe('Developer Management Detail Component', () => {
        let comp: DeveloperDetailComponent;
        let fixture: ComponentFixture<DeveloperDetailComponent>;
        let service: DeveloperService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DeveloperDetailComponent],
                providers: [
                    DeveloperService
                ]
            })
            .overrideTemplate(DeveloperDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DeveloperDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeveloperService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Developer(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.developer).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
