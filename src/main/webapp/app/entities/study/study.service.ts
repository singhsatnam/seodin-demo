import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Study } from './study.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Study>;

@Injectable()
export class StudyService {

    private resourceUrl =  SERVER_API_URL + 'api/studies';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/studies';

    constructor(private http: HttpClient) { }

    create(study: Study): Observable<EntityResponseType> {
        const copy = this.convert(study);
        return this.http.post<Study>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(study: Study): Observable<EntityResponseType> {
        const copy = this.convert(study);
        return this.http.put<Study>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Study>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Study[]>> {
        const options = createRequestOption(req);
        return this.http.get<Study[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Study[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Study[]>> {
        const options = createRequestOption(req);
        return this.http.get<Study[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Study[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Study = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Study[]>): HttpResponse<Study[]> {
        const jsonResponse: Study[] = res.body;
        const body: Study[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Study.
     */
    private convertItemFromServer(study: Study): Study {
        const copy: Study = Object.assign({}, study);
        return copy;
    }

    /**
     * Convert a Study to a JSON which can be sent to the server.
     */
    private convert(study: Study): Study {
        const copy: Study = Object.assign({}, study);
        return copy;
    }
}
