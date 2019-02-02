import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  // URL for the playlists API
  private baseURL = environment.baseURL + '/playlists/';
  // storage for the already loaded playlists
  public data = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  /**
   * Performs search request to the API.
   * Returns Observable from the http-request
   *
   * @param {string} namesearch  search string
   */
  search(namesearch: string) {
    return this.http.get(this.baseURL, { params: { namesearch, fullcount: 'true' } });
  }

  /**
   * Gathers all the tracks of the playlist
   * Because these tracks can be used in the audio player, they need to be stored
   * here in the service to be easily accessed from everywhere
   *
   * @param {string} playlistId  id of the requested playlist
   */
  getTracks(id: string) {
    if (this.data.value[id] && this.data.value[id].results) {
      // if we already have loaded the playlist — refresh data
      this.data.next(this.data.value);
    } else {
      // otherwise request API and fill the subject with returned data
      this.http.get(this.baseURL + 'tracks/', { params: { id } }).subscribe(data => {
        this.data.next({
          ...this.data.value,
          [id]: {
            headers: data['headers'],
            // we are retrieving by id, so the playlist
            // data should be in the only result if any
            data: data['results'] ? data['results'][0] : null
          }
        });
      });
    }
  }
}
