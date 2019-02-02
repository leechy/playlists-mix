import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  headingType = 3;

  constructor(private router: Router) {}

  /**
   * Picks randomly one of the styles (types) for the title
   * the new type is always different from the current one — the user
   * should not experience clicks without changes in the interface.
   *
   * @param {Event}  evt  DOM-event, needed to prevent text selection
   * @param {number} max  max type number (starting with 0)
   */
  pickRandomType(evt: Event, max: number) {
    evt.preventDefault();

    let newType = this.headingType;
    while (newType === this.headingType) {
      newType = Math.round(Math.random() * max);
    }
    this.headingType = newType;

    return false;
  }

  /**
   * Redirects user to the results page with current request as a path
   *
   * @param {Event}  evt    DOM-event, needed to cancel submit
   * @param {object} form   form element
   * @param {string} lucky  string, passed when I'm feeling lucky button is pressed
   */
  search(evt, form, lucky: string = null) {
    evt.preventDefault();

    const t = form.elements.t.value || '?';
    const path = ['/' + t];
    if (lucky) {
      path.push(lucky);
    }
    this.router.navigate(path);

    return false;
  }
}
