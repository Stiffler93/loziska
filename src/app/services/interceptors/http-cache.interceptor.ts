import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {tap} from 'rxjs/operators';


@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  private cache: Map<String, ReplaySubject<HttpResponse<object>>> = new Map();

  constructor() {
    console.log('Constructor HttpCacheInterceptor');
  }

  intercept(req: HttpRequest<object>, next: HttpHandler) {
    const cachedResponse: Observable<HttpResponse<object>> = this.get(req);
    return cachedResponse ? cachedResponse : this.sendRequest(req, next);
  }

  sendRequest(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {
    this.put(req, new ReplaySubject<HttpResponse<object>>(1));
    console.log('Request: ' + req.urlWithParams);
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.update(req, event);
        }
      })
    );
  }

  get(req: HttpRequest<object>): Observable<HttpResponse<object>> {
    return this.cache.get(req.urlWithParams);
  }

  put(req: HttpRequest<object>, observable: ReplaySubject<HttpResponse<object>>): void {
    this.cache.set(req.urlWithParams, observable);
  }

  update(req: HttpRequest<object>, response: HttpResponse<object>): void {
    this.cache.get(req.urlWithParams).next(response);
  }
}
