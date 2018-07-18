import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Developer } from './developer.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Developer>;

@Injectable()
export class DeveloperService {

    private resourceUrl =  SERVER_API_URL + 'api/developers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/developers';

    constructor(private http: HttpClient) { }

    create(developer: Developer): Observable<EntityResponseType> {
        const copy = this.convert(developer);
        return this.http.post<Developer>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(developer: Developer): Observable<EntityResponseType> {
        const copy = this.convert(developer);
        return this.http.put<Developer>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Developer>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Developer[]>> {
        const options = createRequestOption(req);
        return this.http.get<Developer[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Developer[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Developer[]>> {
        const options = createRequestOption(req);
        return this.http.get<Developer[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Developer[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Developer = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Developer[]>): HttpResponse<Developer[]> {
        const jsonResponse: Developer[] = res.body;
        const body: Developer[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Developer.
     */
    private convertItemFromServer(developer: Developer): Developer {
        const copy: Developer = Object.assign({}, developer);
        return copy;
    }

    /**
     * Convert a Developer to a JSON which can be sent to the server.
     */
    private convert(developer: Developer): Developer {
        const copy: Developer = Object.assign({}, developer);
        return copy;
    }
}
