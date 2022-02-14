import { Component, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/providers/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnDestroy {

  isLoading: boolean;
  onSpinnerShow: Subscription;
  onSpinnerHide: Subscription;

  constructor(private eventService: EventService) {

    this.onSpinnerShow = this.eventService.event$('ON_SPINNER_SHOW').subscribe(() => {

      this.isLoading = true;

    });

    this.onSpinnerHide = this.eventService.event$('ON_SPINNER_HIDE').subscribe(() => {

      this.isLoading = false;

    });

  }

  ngOnDestroy(): void {

    this.onSpinnerShow.unsubscribe();
    this.onSpinnerHide.unsubscribe();
    this.eventService.unsubscribe('ON_SPINNER_SHOW');
    this.eventService.unsubscribe('ON_SPINNER_HIDE');

  }

}
