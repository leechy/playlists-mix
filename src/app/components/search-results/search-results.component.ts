import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaylistsService } from '@core/playlists.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  // search params
  t: string;
  lucky: boolean;

  // subscriptions
  paramsSubscription: Subscription;
  playlistsDataSubscription: Subscription;

  // results
  headers: {
    status?: string;
    error_message?: string;
    results_count?: number;
  } = {};
  results = [];

  // state of the playlists (opened, loading, tracks, etc)
  // something we can put in the store in the future
  playlistsState = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistsService: PlaylistsService
  ) {}

  ngOnInit() {
    // subscribe to the changes in the route params
    this.paramsSubscription = this.route.params.subscribe(params => {
      // get search params
      this.t = params.t;
      this.lucky = params.lucky && params.lucky !== '';
      // get results
      this.getResults();
    });

    // listen to the data subject to get tracks results
    this.playlistsDataSubscription = this.playlistsService.data.subscribe(playlists => {
      Object.keys(this.playlistsState)
        .filter(key => this.playlistsState[key].loading)
        .forEach(key => {
          if (playlists[key]) {
            this.playlistsState[key] = {
              ...this.playlistsState[key],
              loading: false,
              headers: playlists[key].headers,
              data: playlists[key].data
            };
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  /**
   * When user clicks on logo, return hom to home
   */
  backToHome() {
    this.router.navigate(['/']);
  }

  /**
   * When search request is changed, then we just change the route
   * following search and results display will come automatically
   *
   * @param {Event}  evt   DOM-event, to prevent original form submit
   * @param {object} form  form element
   */
  search(evt, form) {
    evt.preventDefault();
    this.router.navigate(['/' + form.elements.t.value]);
    return false;
  }

  /**
   * Get results of the API requests and unsubscribe
   * Works with current search request
   */
  getResults() {
    const searchSubscription = this.playlistsService.search(this.t).subscribe(data => {
      this.headers = data['headers'];
      this.results = data['results'];
      searchSubscription.unsubscribe();

      if (this.lucky) {
        // TODO: if user thinks he's lucky, then choose randomly playlist and start it!
        //       clear the lucky flag afterwards
      }
    });
  }

  /**
   * Opens the list of tracks for the playlist
   *
   * @param {string} id  playlist id to show
   */
  showPlaylist(id: string) {
    let loading = false;
    // loads playlist data from the server
    if (!this.playlistsState[id] || !this.playlistsState[id].data) {
      this.playlistsService.getTracks(id);
      loading = true;
    }
    // update the state as opened
    this.playlistsState[id] = {
      ...this.playlistsState[id],
      opened: true,
      loading
    };
  }

  /**
   * Closes the list of tracks for the playlist
   *
   * @param {string} id  playlist id to hide
   */
  hidePlaylist(id: string) {
    this.playlistsState[id] = {
      ...this.playlistsState[id],
      opened: false
    };
  }

  /**
   * Toggles playlist tracks visibility
   *
   * @param {string} id  playlist id
   */
  togglePlaylist(id: string) {
    if (this.playlistsState[id] && this.playlistsState[id].opened) {
      this.hidePlaylist(id);
    } else {
      this.showPlaylist(id);
    }
  }
}
