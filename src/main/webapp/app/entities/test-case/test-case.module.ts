import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    TestCaseService,
    TestCasePopupService,
    TestCaseComponent,
    TestCaseDetailComponent,
    TestCaseDialogComponent,
    TestCasePopupComponent,
    TestCaseDeletePopupComponent,
    TestCaseDeleteDialogComponent,
    testCaseRoute,
    testCasePopupRoute,
} from './';

const ENTITY_STATES = [
    ...testCaseRoute,
    ...testCasePopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TestCaseComponent,
        TestCaseDetailComponent,
        TestCaseDialogComponent,
        TestCaseDeleteDialogComponent,
        TestCasePopupComponent,
        TestCaseDeletePopupComponent,
    ],
    entryComponents: [
        TestCaseComponent,
        TestCaseDialogComponent,
        TestCasePopupComponent,
        TestCaseDeleteDialogComponent,
        TestCaseDeletePopupComponent,
    ],
    providers: [
        TestCaseService,
        TestCasePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinTestCaseModule {}
