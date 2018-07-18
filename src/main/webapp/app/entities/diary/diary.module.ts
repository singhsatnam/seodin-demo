import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    DiaryService,
    DiaryPopupService,
    DiaryComponent,
    DiaryDetailComponent,
    DiaryDialogComponent,
    DiaryPopupComponent,
    DiaryDeletePopupComponent,
    DiaryDeleteDialogComponent,
    diaryRoute,
    diaryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...diaryRoute,
    ...diaryPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DiaryComponent,
        DiaryDetailComponent,
        DiaryDialogComponent,
        DiaryDeleteDialogComponent,
        DiaryPopupComponent,
        DiaryDeletePopupComponent,
    ],
    entryComponents: [
        DiaryComponent,
        DiaryDialogComponent,
        DiaryPopupComponent,
        DiaryDeleteDialogComponent,
        DiaryDeletePopupComponent,
    ],
    providers: [
        DiaryService,
        DiaryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinDiaryModule {}
