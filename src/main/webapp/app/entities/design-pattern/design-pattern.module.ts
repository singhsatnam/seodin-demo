import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeodinSharedModule } from '../../shared';
import {
    DesignPatternService,
    DesignPatternPopupService,
    DesignPatternComponent,
    DesignPatternDetailComponent,
    DesignPatternDialogComponent,
    DesignPatternPopupComponent,
    DesignPatternDeletePopupComponent,
    DesignPatternDeleteDialogComponent,
    designPatternRoute,
    designPatternPopupRoute,
} from './';

const ENTITY_STATES = [
    ...designPatternRoute,
    ...designPatternPopupRoute,
];

@NgModule({
    imports: [
        SeodinSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DesignPatternComponent,
        DesignPatternDetailComponent,
        DesignPatternDialogComponent,
        DesignPatternDeleteDialogComponent,
        DesignPatternPopupComponent,
        DesignPatternDeletePopupComponent,
    ],
    entryComponents: [
        DesignPatternComponent,
        DesignPatternDialogComponent,
        DesignPatternPopupComponent,
        DesignPatternDeleteDialogComponent,
        DesignPatternDeletePopupComponent,
    ],
    providers: [
        DesignPatternService,
        DesignPatternPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinDesignPatternModule {}
