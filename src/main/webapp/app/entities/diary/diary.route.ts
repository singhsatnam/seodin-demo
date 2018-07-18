import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DiaryComponent } from './diary.component';
import { DiaryDetailComponent } from './diary-detail.component';
import { DiaryPopupComponent } from './diary-dialog.component';
import { DiaryDeletePopupComponent } from './diary-delete-dialog.component';

export const diaryRoute: Routes = [
    {
        path: 'diary',
        component: DiaryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.diary.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'diary/:id',
        component: DiaryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.diary.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const diaryPopupRoute: Routes = [
    {
        path: 'diary-new',
        component: DiaryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.diary.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'diary/:id/edit',
        component: DiaryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.diary.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'diary/:id/delete',
        component: DiaryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'seodinApp.diary.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
