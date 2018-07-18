/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { SoftwareSystemDetailComponent } from '../../../../../../main/webapp/app/entities/software-system/software-system-detail.component';
import { SoftwareSystemService } from '../../../../../../main/webapp/app/entities/software-system/software-system.service';
import { SoftwareSystem } from '../../../../../../main/webapp/app/entities/software-system/software-system.model';

describe('Component Tests', () => {

    describe('SoftwareSystem Management Detail Component', () => {
        let comp: SoftwareSystemDetailComponent;
        let fixture: ComponentFixture<SoftwareSystemDetailComponent>;
        let service: SoftwareSystemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [SoftwareSystemDetailComponent],
                providers: [
                    SoftwareSystemService
                ]
            })
            .overrideTemplate(SoftwareSystemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SoftwareSystemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SoftwareSystemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SoftwareSystem(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.softwareSystem).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
