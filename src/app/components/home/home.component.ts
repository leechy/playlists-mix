import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  headingType = 3;

  /**
   * Picks randomly one of the styles (types) for the title
   * the new type is always different from the current one — the user
   * should not experience clicks without changes in the interface.
   *
   * @param {Event} evt   DOM-event, needed to prevent text selection
   * @param {number} max  max type number (starting with 0)
   */
  pickRandomType(evt: Event, max: number) {
    let newType = this.headingType;
    while (newType === this.headingType) {
      newType = Math.round(Math.random() * max);
    }
    this.headingType = newType;
    evt.preventDefault();
    return false;
  }

  search(evt, form) {
    console.log('search', form.elements.t.value);

    evt.preventDefault();
    return false;
  }

  luckySearch(evt, form) {
    console.log('luckySearch', form.elements.t.value);

    evt.preventDefault();
    return false;
  }
}
