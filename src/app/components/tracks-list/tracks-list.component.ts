import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PlaylistsService } from '@core/playlists.service';
import { Subscription } from 'rxjs';
import { faPlay, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.scss']
})
export class TracksListComponent implements OnInit, OnDestroy {
  @Input() state;
  @Output() retry = new EventEmitter();

  // font awesome icons used
  faPlay = faPlay;
  faVolumeUp = faVolumeUp;

  // current track id
  trackSubscription: Subscription;
  playingTrackId: string;

  constructor(private playlistService: PlaylistsService) {}

  ngOnInit() {
    this.trackSubscription = this.playlistService.currentTrack.subscribe(trackId => {
      this.playingTrackId = trackId;
    });
  }

  ngOnDestroy() {
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
  }

  /**
   * Sends event to the parent component
   * to try to reload playlist data
   */
  onRetry() {
    this.retry.emit(null);
  }

  /**
   * Formats the time as `hours:minutes:seconds` string
   * Minutes and seconds are with leading zero if less than 10.
   *
   * @param {number} ms  time in milliseconds
   */
  formatTime(sec?) {
    if (sec) {
      const seconds = parseInt(sec, 10);
      const hours = Math.floor(seconds / 3600);
      const minutes = ('0' + Math.floor((seconds / 60) % 60)).slice(-2);
      const formattedSeconds = ('0' + (seconds % 60)).slice(-2);
      return (hours ? hours + ':' : '') + minutes + ':' + formattedSeconds;
    } else {
      return '00:00';
    }
  }

  /**
   * Sets playlist and song to be played by the player
   * (through playlistService for now)
   *
   * @param playlistId  playlist id (can be taken from state...)
   * @param trackId     id of the clicked track
   */
  play(playlistId: string, trackId: string) {
    this.playlistService.setCurrentPlaylist(playlistId, trackId);
  }
}
