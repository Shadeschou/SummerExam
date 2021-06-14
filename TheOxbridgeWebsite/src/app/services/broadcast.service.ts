import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Broadcast} from 'src/app/models/broadcast.model';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {MyEvents} from '../models/my-events';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private broadcastsUrl = 'http://localhost:3000/broadcast/';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public AddEvent(broadcast: Broadcast): Observable<Broadcast> {
    const user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    };

    return this.http.post<Broadcast>(this.broadcastsUrl, broadcast, httpOptions).pipe(map(broadcast => broadcast));
  }

}
