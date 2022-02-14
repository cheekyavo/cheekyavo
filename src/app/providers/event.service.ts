import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {

  private events: any = {};

  public event$(eventName: string): Observable<any> {

    if (this.events[eventName]) {

      this.events[eventName].subCount += 1;
      return this.events[eventName].observable;

    } else {

      const subject = new Subject<any>();
      const observable = subject.asObservable();
      const subCount = 1;

      this.events[eventName] = { subject, observable, subCount };

      return this.events[eventName].observable;

    }

  }

  public unsubscribe(eventName: string): void {

    if (!this.events[eventName]) { return; }

    if (this.events[eventName].subCount > 1) {

      this.events[eventName].subCount -= 1;
      return;

    } else {

      this.events[eventName].subject.complete();
      delete this.events[eventName];

    }

  }

  public publish(eventName: string, data?: any): void {

    if (this.events[eventName]) {

      this.events[eventName].subject.next(data);

    }

  }
}
