import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Defect } from './defect.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Defect>;

@Injectable()
export class DefectService {

    private resourceUrl =  SERVER_API_URL + 'api/defects';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/defects';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(defect: Defect): Observable<EntityResponseType> {
        const copy = this.convert(defect);
        return this.http.post<Defect>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(defect: Defect): Observable<EntityResponseType> {
        const copy = this.convert(defect);
        return this.http.put<Defect>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Defect>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Defect[]>> {
        const options = createRequestOption(req);
        return this.http.get<Defect[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Defect[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Defect[]>> {
        const options = createRequestOption(req);
        return this.http.get<Defect[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Defect[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Defect = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Defect[]>): HttpResponse<Defect[]> {
        const jsonResponse: Defect[] = res.body;
        const body: Defect[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Defect.
     */
    private convertItemFromServer(defect: Defect): Defect {
        const copy: Defect = Object.assign({}, defect);
        copy.recorded = this.dateUtils
            .convertLocalDateFromServer(defect.recorded);
        copy.modified = this.dateUtils
            .convertLocalDateFromServer(defect.modified);
        return copy;
    }

    /**
     * Convert a Defect to a JSON which can be sent to the server.
     */
    private convert(defect: Defect): Defect {
        const copy: Defect = Object.assign({}, defect);
        copy.recorded = this.dateUtils
            .convertLocalDateToServer(defect.recorded);
        copy.modified = this.dateUtils
            .convertLocalDateToServer(defect.modified);
        return copy;
    }
}
