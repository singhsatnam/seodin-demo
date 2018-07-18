import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { TestCase } from './test-case.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<TestCase>;

@Injectable()
export class TestCaseService {

    private resourceUrl =  SERVER_API_URL + 'api/test-cases';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/test-cases';

    constructor(private http: HttpClient) { }

    create(testCase: TestCase): Observable<EntityResponseType> {
        const copy = this.convert(testCase);
        return this.http.post<TestCase>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(testCase: TestCase): Observable<EntityResponseType> {
        const copy = this.convert(testCase);
        return this.http.put<TestCase>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<TestCase>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<TestCase[]>> {
        const options = createRequestOption(req);
        return this.http.get<TestCase[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<TestCase[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<TestCase[]>> {
        const options = createRequestOption(req);
        return this.http.get<TestCase[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<TestCase[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: TestCase = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<TestCase[]>): HttpResponse<TestCase[]> {
        const jsonResponse: TestCase[] = res.body;
        const body: TestCase[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to TestCase.
     */
    private convertItemFromServer(testCase: TestCase): TestCase {
        const copy: TestCase = Object.assign({}, testCase);
        return copy;
    }

    /**
     * Convert a TestCase to a JSON which can be sent to the server.
     */
    private convert(testCase: TestCase): TestCase {
        const copy: TestCase = Object.assign({}, testCase);
        return copy;
    }
}
