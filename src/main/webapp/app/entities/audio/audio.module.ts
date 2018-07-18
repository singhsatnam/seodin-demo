import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    AudioService,
    AudioPopupService,
    AudioComponent,
    AudioDetailComponent,
    AudioDialogComponent,
    AudioPopupComponent,
    AudioDeletePopupComponent,
    AudioDeleteDialogComponent,
    audioRoute,
    audioPopupRoute,
} from './';

const ENTITY_STATES = [
    ...audioRoute,
    ...audioPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AudioComponent,
        AudioDetailComponent,
        AudioDialogComponent,
        AudioDeleteDialogComponent,
        AudioPopupComponent,
        AudioDeletePopupComponent,
    ],
    entryComponents: [
        AudioComponent,
        AudioDialogComponent,
        AudioPopupComponent,
        AudioDeleteDialogComponent,
        AudioDeletePopupComponent,
    ],
    providers: [
        AudioService,
        AudioPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinAudioModule {}
