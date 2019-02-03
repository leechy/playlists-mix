import { Component, OnInit } from '@angular/core';
import { faBackward, faPlay, faPause, faForward } from '@fortawesome/free-solid-svg-icons';
import { Howl, Howler } from 'howler';
import { PlaylistsService } from '@core/playlists.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  // font awesome buttons
  faBackward = faBackward;
  faPlay = faPlay;
  faForward = faForward;
  faPause = faPause;

  sound: any;
  playlist: {
    howl?: any;
    id: string;
    src: string;
    name: string;
    artist: string;
    image: string;
  }[];
  volume = 0.75;
  trackNo = 0;
  trackId: string;
  trackInfo = {
    name: '',
    artist: '',
    image: ''
  };
  state = 'paused';

  playlistSubscription: Subscription;
  trackSubscription: Subscription;

  constructor(private playlistService: PlaylistsService) {}

  ngOnInit() {
    // subscribe to all new chosen playlists
    this.playlistSubscription = this.playlistService.currentPlaylist.subscribe(playlist => {
      if (playlist && playlist['data']) {
        this.loadPlaylist(playlist['data'].tracks);
        this.play(this.trackNo);
      }
    });

    // when the track id is changed
    // checking if it's a new track from current playlist brefore swithing the track
    this.trackSubscription = this.playlistService.currentTrack.subscribe(trackId => {
      if (this.trackId !== trackId) {
        this.trackId = trackId;
        if (this.playlist) {
          const newTrackNo = this.playlist.findIndex(track => track.id === trackId);
          if (newTrackNo >= 0) {
            this.skipTo(newTrackNo);
          }
        }
      }
    });
  }

  /**
   * Updates current playlist
   *
   * @param {object} playlist  new playlist data
   */
  loadPlaylist(playlist) {
    // clear current playlist
    if (this.playlist && this.playlist.length) {
      // clear howls: hope this removes every pointers and events
      // so the GC will clean everything
      this.playlist.filter(song => song.howl).forEach(song => song.howl.unload());
    }

    // attach new playlist
    this.playlist = playlist.map((track, index) => {
      if (track.id === this.trackId) {
        this.trackNo = index;
      }
      return {
        id: track.id,
        src: track.audio,
        name: track.name,
        artist: track.artist_name,
        image: track.image
      };
    });
  }

  /**
   * Creates Howl object for the chosen track and starts it.
   * Updates the interface (title, artist, image) and sends the trackId to the service
   *
   * @param {number} trackNo  track no from the playlist to play
   */
  play(trackNo = -1) {
    if (trackNo < 0) {
      trackNo = this.trackNo || 0;
    }

    if (!this.playlist[trackNo].howl) {
      this.playlist[trackNo].howl = new Howl({
        src: this.playlist[trackNo].src,
        html5: true,
        volume: this.volume,
        onplay: () => {
          this.state = 'playing';
        },
        onend: () => {
          this.skip('next');
        }
      });
    }

    // start the music
    this.playlist[trackNo].howl.play();

    // update interface
    const { id, name, artist, image } = this.playlist[trackNo];
    this.trackInfo = {
      name,
      artist,
      image
    };

    // set current track, also to update display in other components
    this.trackNo = trackNo;
    this.trackId = id;
    this.playlistService.setCurrentTrack(id);
  }

  /**
   * Set the volume for the current sound?
   *
   * @param {Event} evt  DOM-event with the volume range element as a target
   */
  changeVolume(evt) {
    this.volume = evt.target.value / 100;

    // update volume for the current track
    if (this.playlist[this.trackNo].howl) {
      this.playlist[this.trackNo].howl.volume(this.volume);
    }

    // Update the global volume (affecting all Howls).
    // TODO: check if that works at all
    Howler.volume(this.volume);
  }

  /**
   * Pauses currently playing track
   */
  pause() {
    const sound = this.playlist[this.trackNo] && this.playlist[this.trackNo].howl;
    if (sound) {
      sound.pause();
      this.state = 'paused';
    }
  }

  /**
   * Switch to previous or next track in the current playlist
   *
   * @param {string} direction  `next` or `prev`
   */
  skip(direction: string) {
    let newTrackNo = 0;
    if (direction === 'next') {
      newTrackNo = this.trackNo + 1;
      if (newTrackNo >= this.playlist.length) {
        newTrackNo = 0;
      }
    } else if (direction === 'prev') {
      newTrackNo = this.trackNo - 1;
      if (newTrackNo < 0) {
        newTrackNo = this.playlist.length - 1;
      }
    }
    this.skipTo(newTrackNo);
  }

  /**
   * Starts track from the current playlist with passed index
   *
   * @param {number} newTrackNo  track number
   */
  skipTo(newTrackNo: number) {
    // stop current track
    if (this.playlist[this.trackNo].howl) {
      this.playlist[this.trackNo].howl.stop();
    }

    this.play(newTrackNo);
  }
}
