import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SoftwareSystem } from './software-system.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SoftwareSystem>;

@Injectable()
export class SoftwareSystemService {

    private resourceUrl =  SERVER_API_URL + 'api/software-systems';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/software-systems';

    constructor(private http: HttpClient) { }

    create(softwareSystem: SoftwareSystem): Observable<EntityResponseType> {
        const copy = this.convert(softwareSystem);
        return this.http.post<SoftwareSystem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(softwareSystem: SoftwareSystem): Observable<EntityResponseType> {
        const copy = this.convert(softwareSystem);
        return this.http.put<SoftwareSystem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SoftwareSystem>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SoftwareSystem[]>> {
        const options = createRequestOption(req);
        return this.http.get<SoftwareSystem[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SoftwareSystem[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SoftwareSystem[]>> {
        const options = createRequestOption(req);
        return this.http.get<SoftwareSystem[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SoftwareSystem[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SoftwareSystem = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SoftwareSystem[]>): HttpResponse<SoftwareSystem[]> {
        const jsonResponse: SoftwareSystem[] = res.body;
        const body: SoftwareSystem[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SoftwareSystem.
     */
    private convertItemFromServer(softwareSystem: SoftwareSystem): SoftwareSystem {
        const copy: SoftwareSystem = Object.assign({}, softwareSystem);
        return copy;
    }

    /**
     * Convert a SoftwareSystem to a JSON which can be sent to the server.
     */
    private convert(softwareSystem: SoftwareSystem): SoftwareSystem {
        const copy: SoftwareSystem = Object.assign({}, softwareSystem);
        return copy;
    }
}
