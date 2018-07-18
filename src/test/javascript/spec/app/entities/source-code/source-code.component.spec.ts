/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { SourceCodeComponent } from '../../../../../../main/webapp/app/entities/source-code/source-code.component';
import { SourceCodeService } from '../../../../../../main/webapp/app/entities/source-code/source-code.service';
import { SourceCode } from '../../../../../../main/webapp/app/entities/source-code/source-code.model';

describe('Component Tests', () => {

    describe('SourceCode Management Component', () => {
        let comp: SourceCodeComponent;
        let fixture: ComponentFixture<SourceCodeComponent>;
        let service: SourceCodeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [SourceCodeComponent],
                providers: [
                    SourceCodeService
                ]
            })
            .overrideTemplate(SourceCodeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SourceCodeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SourceCodeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SourceCode(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.sourceCodes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
