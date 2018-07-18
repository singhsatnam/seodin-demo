import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { DesignPattern } from './design-pattern.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DesignPattern>;

@Injectable()
export class DesignPatternService {

    private resourceUrl =  SERVER_API_URL + 'api/design-patterns';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/design-patterns';

    constructor(private http: HttpClient) { }

    create(designPattern: DesignPattern): Observable<EntityResponseType> {
        const copy = this.convert(designPattern);
        return this.http.post<DesignPattern>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(designPattern: DesignPattern): Observable<EntityResponseType> {
        const copy = this.convert(designPattern);
        return this.http.put<DesignPattern>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DesignPattern>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DesignPattern[]>> {
        const options = createRequestOption(req);
        return this.http.get<DesignPattern[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DesignPattern[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<DesignPattern[]>> {
        const options = createRequestOption(req);
        return this.http.get<DesignPattern[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DesignPattern[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DesignPattern = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DesignPattern[]>): HttpResponse<DesignPattern[]> {
        const jsonResponse: DesignPattern[] = res.body;
        const body: DesignPattern[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DesignPattern.
     */
    private convertItemFromServer(designPattern: DesignPattern): DesignPattern {
        const copy: DesignPattern = Object.assign({}, designPattern);
        return copy;
    }

    /**
     * Convert a DesignPattern to a JSON which can be sent to the server.
     */
    private convert(designPattern: DesignPattern): DesignPattern {
        const copy: DesignPattern = Object.assign({}, designPattern);
        return copy;
    }
}
