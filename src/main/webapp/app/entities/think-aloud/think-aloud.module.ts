import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    ThinkAloudService,
    ThinkAloudPopupService,
    ThinkAloudComponent,
    ThinkAloudDetailComponent,
    ThinkAloudDialogComponent,
    ThinkAloudPopupComponent,
    ThinkAloudDeletePopupComponent,
    ThinkAloudDeleteDialogComponent,
    thinkAloudRoute,
    thinkAloudPopupRoute,
} from './';

const ENTITY_STATES = [
    ...thinkAloudRoute,
    ...thinkAloudPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ThinkAloudComponent,
        ThinkAloudDetailComponent,
        ThinkAloudDialogComponent,
        ThinkAloudDeleteDialogComponent,
        ThinkAloudPopupComponent,
        ThinkAloudDeletePopupComponent,
    ],
    entryComponents: [
        ThinkAloudComponent,
        ThinkAloudDialogComponent,
        ThinkAloudPopupComponent,
        ThinkAloudDeleteDialogComponent,
        ThinkAloudDeletePopupComponent,
    ],
    providers: [
        ThinkAloudService,
        ThinkAloudPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinThinkAloudModule {}
