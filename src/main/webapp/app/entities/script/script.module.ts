import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    ScriptService,
    ScriptPopupService,
    ScriptComponent,
    ScriptDetailComponent,
    ScriptDialogComponent,
    ScriptPopupComponent,
    ScriptDeletePopupComponent,
    ScriptDeleteDialogComponent,
    scriptRoute,
    scriptPopupRoute,
} from './';

const ENTITY_STATES = [
    ...scriptRoute,
    ...scriptPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ScriptComponent,
        ScriptDetailComponent,
        ScriptDialogComponent,
        ScriptDeleteDialogComponent,
        ScriptPopupComponent,
        ScriptDeletePopupComponent,
    ],
    entryComponents: [
        ScriptComponent,
        ScriptDialogComponent,
        ScriptPopupComponent,
        ScriptDeleteDialogComponent,
        ScriptDeletePopupComponent,
    ],
    providers: [
        ScriptService,
        ScriptPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinScriptModule {}
