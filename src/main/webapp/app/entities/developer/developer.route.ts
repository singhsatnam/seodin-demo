import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DeveloperComponent } from './developer.component';
import { DeveloperDetailComponent } from './developer-detail.component';
import { DeveloperPopupComponent } from './developer-dialog.component';
import { DeveloperDeletePopupComponent } from './developer-delete-dialog.component';

export const developerRoute: Routes = [
    {
        path: 'developer',
        component: DeveloperComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.developer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'developer/:id',
        component: DeveloperDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.developer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const developerPopupRoute: Routes = [
    {
        path: 'developer-new',
        component: DeveloperPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.developer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'developer/:id/edit',
        component: DeveloperPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.developer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'developer/:id/delete',
        component: DeveloperDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.developer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
