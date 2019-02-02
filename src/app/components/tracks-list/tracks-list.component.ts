import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.css']
})
export class TracksListComponent implements OnInit {
  @Input() state;
  @Output() retry = new EventEmitter();

  constructor() {}

  ngOnInit() {}

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
}
