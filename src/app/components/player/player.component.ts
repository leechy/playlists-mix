import { Component, OnInit } from '@angular/core';
import { faBackward, faPlay, faForward } from '@fortawesome/free-solid-svg-icons';

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

  constructor() {}

  ngOnInit() {}
}
