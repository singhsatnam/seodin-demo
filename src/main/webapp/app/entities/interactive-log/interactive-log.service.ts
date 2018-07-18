import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { InteractiveLog } from './interactive-log.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<InteractiveLog>;

@Injectable()
export class InteractiveLogService {

    private resourceUrl =  SERVER_API_URL + 'api/interactive-logs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/interactive-logs';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(interactiveLog: InteractiveLog): Observable<EntityResponseType> {
        const copy = this.convert(interactiveLog);
        return this.http.post<InteractiveLog>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(interactiveLog: InteractiveLog): Observable<EntityResponseType> {
        const copy = this.convert(interactiveLog);
        return this.http.put<InteractiveLog>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<InteractiveLog>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<InteractiveLog[]>> {
        const options = createRequestOption(req);
        return this.http.get<InteractiveLog[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<InteractiveLog[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<InteractiveLog[]>> {
        const options = createRequestOption(req);
        return this.http.get<InteractiveLog[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<InteractiveLog[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: InteractiveLog = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<InteractiveLog[]>): HttpResponse<InteractiveLog[]> {
        const jsonResponse: InteractiveLog[] = res.body;
        const body: InteractiveLog[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to InteractiveLog.
     */
    private convertItemFromServer(interactiveLog: InteractiveLog): InteractiveLog {
        const copy: InteractiveLog = Object.assign({}, interactiveLog);
        copy.recorded = this.dateUtils
            .convertLocalDateFromServer(interactiveLog.recorded);
        return copy;
    }

    /**
     * Convert a InteractiveLog to a JSON which can be sent to the server.
     */
    private convert(interactiveLog: InteractiveLog): InteractiveLog {
        const copy: InteractiveLog = Object.assign({}, interactiveLog);
        copy.recorded = this.dateUtils
            .convertLocalDateToServer(interactiveLog.recorded);
        return copy;
    }
}
