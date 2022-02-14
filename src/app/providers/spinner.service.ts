import { Injectable } from '@angular/core';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class SpinnerService {

  constructor(private enentService: EventService) {}

  public show(): void {

    this.enentService.publish('ON_SPINNER_SHOW');

  }

  public hide(): void {

    this.enentService.publish('ON_SPINNER_HIDE');

  }

}
