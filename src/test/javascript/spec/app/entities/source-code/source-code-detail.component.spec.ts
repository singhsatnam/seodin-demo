/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SeodinTestModule } from '../../../test.module';
import { SourceCodeDetailComponent } from '../../../../../../main/webapp/app/entities/source-code/source-code-detail.component';
import { SourceCodeService } from '../../../../../../main/webapp/app/entities/source-code/source-code.service';
import { SourceCode } from '../../../../../../main/webapp/app/entities/source-code/source-code.model';

describe('Component Tests', () => {

    describe('SourceCode Management Detail Component', () => {
        let comp: SourceCodeDetailComponent;
        let fixture: ComponentFixture<SourceCodeDetailComponent>;
        let service: SourceCodeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [SourceCodeDetailComponent],
                providers: [
                    SourceCodeService
                ]
            })
            .overrideTemplate(SourceCodeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SourceCodeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SourceCodeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SourceCode(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.sourceCode).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
