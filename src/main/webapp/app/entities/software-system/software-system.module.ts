import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    SoftwareSystemService,
    SoftwareSystemPopupService,
    SoftwareSystemComponent,
    SoftwareSystemDetailComponent,
    SoftwareSystemDialogComponent,
    SoftwareSystemPopupComponent,
    SoftwareSystemDeletePopupComponent,
    SoftwareSystemDeleteDialogComponent,
    softwareSystemRoute,
    softwareSystemPopupRoute,
} from './';

const ENTITY_STATES = [
    ...softwareSystemRoute,
    ...softwareSystemPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SoftwareSystemComponent,
        SoftwareSystemDetailComponent,
        SoftwareSystemDialogComponent,
        SoftwareSystemDeleteDialogComponent,
        SoftwareSystemPopupComponent,
        SoftwareSystemDeletePopupComponent,
    ],
    entryComponents: [
        SoftwareSystemComponent,
        SoftwareSystemDialogComponent,
        SoftwareSystemPopupComponent,
        SoftwareSystemDeleteDialogComponent,
        SoftwareSystemDeletePopupComponent,
    ],
    providers: [
        SoftwareSystemService,
        SoftwareSystemPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinSoftwareSystemModule {}
