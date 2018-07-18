import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    InterviewService,
    InterviewPopupService,
    InterviewComponent,
    InterviewDetailComponent,
    InterviewDialogComponent,
    InterviewPopupComponent,
    InterviewDeletePopupComponent,
    InterviewDeleteDialogComponent,
    interviewRoute,
    interviewPopupRoute,
} from './';

const ENTITY_STATES = [
    ...interviewRoute,
    ...interviewPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        InterviewComponent,
        InterviewDetailComponent,
        InterviewDialogComponent,
        InterviewDeleteDialogComponent,
        InterviewPopupComponent,
        InterviewDeletePopupComponent,
    ],
    entryComponents: [
        InterviewComponent,
        InterviewDialogComponent,
        InterviewPopupComponent,
        InterviewDeleteDialogComponent,
        InterviewDeletePopupComponent,
    ],
    providers: [
        InterviewService,
        InterviewPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinInterviewModule {}
