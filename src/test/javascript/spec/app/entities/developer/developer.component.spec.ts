/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { DeveloperComponent } from '../../../../../../main/webapp/app/entities/developer/developer.component';
import { DeveloperService } from '../../../../../../main/webapp/app/entities/developer/developer.service';
import { Developer } from '../../../../../../main/webapp/app/entities/developer/developer.model';

describe('Component Tests', () => {

    describe('Developer Management Component', () => {
        let comp: DeveloperComponent;
        let fixture: ComponentFixture<DeveloperComponent>;
        let service: DeveloperService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DeveloperComponent],
                providers: [
                    DeveloperService
                ]
            })
            .overrideTemplate(DeveloperComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DeveloperComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeveloperService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Developer(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.developers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
