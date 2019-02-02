import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '@core/playlists.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Playlist Mix';

  constructor(private playlistsService: PlaylistsService) {}

  ngOnInit() {}
}
