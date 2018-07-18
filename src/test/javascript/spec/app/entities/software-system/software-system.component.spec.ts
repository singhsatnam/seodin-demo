/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { SoftwareSystemComponent } from '../../../../../../main/webapp/app/entities/software-system/software-system.component';
import { SoftwareSystemService } from '../../../../../../main/webapp/app/entities/software-system/software-system.service';
import { SoftwareSystem } from '../../../../../../main/webapp/app/entities/software-system/software-system.model';

describe('Component Tests', () => {

    describe('SoftwareSystem Management Component', () => {
        let comp: SoftwareSystemComponent;
        let fixture: ComponentFixture<SoftwareSystemComponent>;
        let service: SoftwareSystemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [SoftwareSystemComponent],
                providers: [
                    SoftwareSystemService
                ]
            })
            .overrideTemplate(SoftwareSystemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SoftwareSystemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SoftwareSystemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SoftwareSystem(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.softwareSystems[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
