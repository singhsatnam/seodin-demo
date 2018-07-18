import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DefectComponent } from './defect.component';
import { DefectDetailComponent } from './defect-detail.component';
import { DefectPopupComponent } from './defect-dialog.component';
import { DefectDeletePopupComponent } from './defect-delete-dialog.component';

export const defectRoute: Routes = [
    {
        path: 'defect',
        component: DefectComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.defect.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'defect/:id',
        component: DefectDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.defect.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const defectPopupRoute: Routes = [
    {
        path: 'defect-new',
        component: DefectPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.defect.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'defect/:id/edit',
        component: DefectPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.defect.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'defect/:id/delete',
        component: DefectDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.defect.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
