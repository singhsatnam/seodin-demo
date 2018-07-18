import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ThinkAloud } from './think-aloud.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ThinkAloud>;

@Injectable()
export class ThinkAloudService {

    private resourceUrl =  SERVER_API_URL + 'api/think-alouds';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/think-alouds';

    constructor(private http: HttpClient) { }

    create(thinkAloud: ThinkAloud): Observable<EntityResponseType> {
        const copy = this.convert(thinkAloud);
        return this.http.post<ThinkAloud>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(thinkAloud: ThinkAloud): Observable<EntityResponseType> {
        const copy = this.convert(thinkAloud);
        return this.http.put<ThinkAloud>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ThinkAloud>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ThinkAloud[]>> {
        const options = createRequestOption(req);
        return this.http.get<ThinkAloud[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ThinkAloud[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ThinkAloud[]>> {
        const options = createRequestOption(req);
        return this.http.get<ThinkAloud[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ThinkAloud[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ThinkAloud = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ThinkAloud[]>): HttpResponse<ThinkAloud[]> {
        const jsonResponse: ThinkAloud[] = res.body;
        const body: ThinkAloud[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ThinkAloud.
     */
    private convertItemFromServer(thinkAloud: ThinkAloud): ThinkAloud {
        const copy: ThinkAloud = Object.assign({}, thinkAloud);
        return copy;
    }

    /**
     * Convert a ThinkAloud to a JSON which can be sent to the server.
     */
    private convert(thinkAloud: ThinkAloud): ThinkAloud {
        const copy: ThinkAloud = Object.assign({}, thinkAloud);
        return copy;
    }
}
