import { Injectable } from '@angular/core';
import { pipe } from 'rxjs/Rx';
import { map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';


/**
 * a service to handle http requests using httpClient
 */
@Injectable()
export class RequestsService {

  /**
   * injects HttpClient
   *
   * @param _http a reference to httpClient
   */
  constructor(private _http: HttpClient) { }

  /**
   * sends a get http request and executes callbacks
   *
   * @param url url to send request
   * @param errCallBack callback to be executed if the request failed
   * @param callBack callback to be executed if the request succeeded
   */
  get(url, errCallBack, callBack): Subscription {
    return this._http.get(url)
      // rxjs pipes to parse json data & retry if request failed
      .pipe( map(res => JSON.parse(JSON.stringify(res))), retry(2) )
      .subscribe(
        result => { callBack(result); },
        err => { errCallBack(err); }
      );
  }

}
