import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SourceCode } from './source-code.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SourceCode>;

@Injectable()
export class SourceCodeService {

    private resourceUrl =  SERVER_API_URL + 'api/source-codes';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/source-codes';

    constructor(private http: HttpClient) { }

    create(sourceCode: SourceCode): Observable<EntityResponseType> {
        const copy = this.convert(sourceCode);
        return this.http.post<SourceCode>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(sourceCode: SourceCode): Observable<EntityResponseType> {
        const copy = this.convert(sourceCode);
        return this.http.put<SourceCode>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SourceCode>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SourceCode[]>> {
        const options = createRequestOption(req);
        return this.http.get<SourceCode[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SourceCode[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SourceCode[]>> {
        const options = createRequestOption(req);
        return this.http.get<SourceCode[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SourceCode[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SourceCode = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SourceCode[]>): HttpResponse<SourceCode[]> {
        const jsonResponse: SourceCode[] = res.body;
        const body: SourceCode[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SourceCode.
     */
    private convertItemFromServer(sourceCode: SourceCode): SourceCode {
        const copy: SourceCode = Object.assign({}, sourceCode);
        return copy;
    }

    /**
     * Convert a SourceCode to a JSON which can be sent to the server.
     */
    private convert(sourceCode: SourceCode): SourceCode {
        const copy: SourceCode = Object.assign({}, sourceCode);
        return copy;
    }
}
