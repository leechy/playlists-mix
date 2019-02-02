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
  currentSearchSubscription: Subscription;

  // results
  headers = {};
  results = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistsService: PlaylistsService
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      // get search params
      this.t = params.t;
      this.lucky = params.lucky && params.lucky !== '';

      this.getResults();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.currentSearchSubscription) {
      this.currentSearchSubscription.unsubscribe();
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
    this.currentSearchSubscription = this.playlistsService.search(this.t).subscribe(data => {
      console.log('searchPlaylists', data);
      this.headers = data['headers'];
      this.results = data['results'];
      this.currentSearchSubscription.unsubscribe();

      if (this.lucky) {
        // TODO: if user thinks he's lucky, then choose randomly playlist and start it!
        //       clear the lucky flag afterwards
      }
    });
  }
}
