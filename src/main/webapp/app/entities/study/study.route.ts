import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { StudyComponent } from './study.component';
import { StudyDetailComponent } from './study-detail.component';
import { StudyPopupComponent } from './study-dialog.component';
import { StudyDeletePopupComponent } from './study-delete-dialog.component';

export const studyRoute: Routes = [
    {
        path: 'study',
        component: StudyComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.study.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'study/:id',
        component: StudyDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.study.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const studyPopupRoute: Routes = [
    {
        path: 'study-new',
        component: StudyPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.study.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'study/:id/edit',
        component: StudyPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.study.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'study/:id/delete',
        component: StudyDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.study.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
