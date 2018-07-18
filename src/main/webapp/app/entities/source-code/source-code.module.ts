import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    SourceCodeService,
    SourceCodePopupService,
    SourceCodeComponent,
    SourceCodeDetailComponent,
    SourceCodeDialogComponent,
    SourceCodePopupComponent,
    SourceCodeDeletePopupComponent,
    SourceCodeDeleteDialogComponent,
    sourceCodeRoute,
    sourceCodePopupRoute,
} from './';

const ENTITY_STATES = [
    ...sourceCodeRoute,
    ...sourceCodePopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SourceCodeComponent,
        SourceCodeDetailComponent,
        SourceCodeDialogComponent,
        SourceCodeDeleteDialogComponent,
        SourceCodePopupComponent,
        SourceCodeDeletePopupComponent,
    ],
    entryComponents: [
        SourceCodeComponent,
        SourceCodeDialogComponent,
        SourceCodePopupComponent,
        SourceCodeDeleteDialogComponent,
        SourceCodeDeletePopupComponent,
    ],
    providers: [
        SourceCodeService,
        SourceCodePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinSourceCodeModule {}
