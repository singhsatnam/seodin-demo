/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { DefectComponent } from '../../../../../../main/webapp/app/entities/defect/defect.component';
import { DefectService } from '../../../../../../main/webapp/app/entities/defect/defect.service';
import { Defect } from '../../../../../../main/webapp/app/entities/defect/defect.model';

describe('Component Tests', () => {

    describe('Defect Management Component', () => {
        let comp: DefectComponent;
        let fixture: ComponentFixture<DefectComponent>;
        let service: DefectService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [DefectComponent],
                providers: [
                    DefectService
                ]
            })
            .overrideTemplate(DefectComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DefectComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DefectService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Defect(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.defects[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
