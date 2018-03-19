import { Component, HostListener, NgZone } from '@angular/core';

import {Web3Service, MetaCoinService} from '../services/services'

import { canBeNumber } from '../util/validation';

declare var window: any;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

}
