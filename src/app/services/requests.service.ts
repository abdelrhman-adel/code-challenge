import { Injectable } from '@angular/core';
import { pipe } from 'rxjs/Rx';
import { map, retry } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RequestsService {

  constructor(
    private _http: HttpClient,
  ) { }

  get(link, errCallBack, callBack): Subscription {
    return this._http.get(link)
      .pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      retry(2)
      )
      .subscribe(
      (result) => {
        callBack(result);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(err.status, err.error);
        }
        errCallBack(err);
      }
      );
  }

}
