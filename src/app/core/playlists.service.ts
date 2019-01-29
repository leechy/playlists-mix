import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private baseURL = environment.baseURL + '/playlists/';

  constructor(private http: HttpClient) {}

  search(namesearch: string) {
    return this.http.get(this.baseURL, { params: { namesearch } });
  }
}
