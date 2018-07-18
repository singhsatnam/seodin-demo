import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SourceCodeComponent } from './source-code.component';
import { SourceCodeDetailComponent } from './source-code-detail.component';
import { SourceCodePopupComponent } from './source-code-dialog.component';
import { SourceCodeDeletePopupComponent } from './source-code-delete-dialog.component';

export const sourceCodeRoute: Routes = [
    {
        path: 'source-code',
        component: SourceCodeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.sourceCode.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'source-code/:id',
        component: SourceCodeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.sourceCode.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sourceCodePopupRoute: Routes = [
    {
        path: 'source-code-new',
        component: SourceCodePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.sourceCode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'source-code/:id/edit',
        component: SourceCodePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.sourceCode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'source-code/:id/delete',
        component: SourceCodeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.sourceCode.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
