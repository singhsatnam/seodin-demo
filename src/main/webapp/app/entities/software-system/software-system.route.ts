import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SoftwareSystemComponent } from './software-system.component';
import { SoftwareSystemDetailComponent } from './software-system-detail.component';
import { SoftwareSystemPopupComponent } from './software-system-dialog.component';
import { SoftwareSystemDeletePopupComponent } from './software-system-delete-dialog.component';

export const softwareSystemRoute: Routes = [
    {
        path: 'software-system',
        component: SoftwareSystemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.softwareSystem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'software-system/:id',
        component: SoftwareSystemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.softwareSystem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const softwareSystemPopupRoute: Routes = [
    {
        path: 'software-system-new',
        component: SoftwareSystemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.softwareSystem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'software-system/:id/edit',
        component: SoftwareSystemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.softwareSystem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'software-system/:id/delete',
        component: SoftwareSystemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.softwareSystem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
