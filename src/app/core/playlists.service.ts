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

  // player data (can be stored elsewhere)
  private currentPlaylistId: string;
  public currentPlaylist = new BehaviorSubject([]);
  public currentTrack = new BehaviorSubject('0');

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

  /**
   * Updates currentTrack and currentPlaylist subjects
   * so the player can listen and update itself with the new data
   *
   * @param {string} id       id of the chosen for playing playlist
   * @param {string} trackId  id of the chosen song
   */
  setCurrentPlaylist(id, trackId = '0') {
    if (this.currentTrack.value !== trackId) {
      this.currentTrack.next(trackId);
    }
    if (
      this.currentPlaylistId !== id &&
      this.data.value[id] &&
      this.data.value[id].data &&
      this.data.value[id].data.tracks &&
      this.data.value[id].data.tracks.length
    ) {
      this.currentPlaylist.next(this.data.value[id]);
      this.currentPlaylistId = id;
    }
  }

  /**
   * Updates currently playing track
   *
   * @param {string} trackId  id of the chosen song
   */
  setCurrentTrack(trackId = '0') {
    this.currentTrack.next(trackId);
  }
}
