/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SeodinTestModule } from '../../../test.module';
import { InteractiveLogComponent } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.component';
import { InteractiveLogService } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.service';
import { InteractiveLog } from '../../../../../../main/webapp/app/entities/interactive-log/interactive-log.model';

describe('Component Tests', () => {

    describe('InteractiveLog Management Component', () => {
        let comp: InteractiveLogComponent;
        let fixture: ComponentFixture<InteractiveLogComponent>;
        let service: InteractiveLogService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SeodinTestModule],
                declarations: [InteractiveLogComponent],
                providers: [
                    InteractiveLogService
                ]
            })
            .overrideTemplate(InteractiveLogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InteractiveLogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InteractiveLogService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new InteractiveLog(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.interactiveLogs[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
