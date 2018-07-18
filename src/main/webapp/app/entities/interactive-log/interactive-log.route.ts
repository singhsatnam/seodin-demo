import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { InteractiveLogComponent } from './interactive-log.component';
import { InteractiveLogDetailComponent } from './interactive-log-detail.component';
import { InteractiveLogPopupComponent } from './interactive-log-dialog.component';
import { InteractiveLogDeletePopupComponent } from './interactive-log-delete-dialog.component';

export const interactiveLogRoute: Routes = [
    {
        path: 'interactive-log',
        component: InteractiveLogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.interactiveLog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'interactive-log/:id',
        component: InteractiveLogDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.interactiveLog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const interactiveLogPopupRoute: Routes = [
    {
        path: 'interactive-log-new',
        component: InteractiveLogPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.interactiveLog.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'interactive-log/:id/edit',
        component: InteractiveLogPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.interactiveLog.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'interactive-log/:id/delete',
        component: InteractiveLogDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.interactiveLog.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
