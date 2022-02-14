import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';

export function initializeApplication() {
  return (): Promise<any> => {
    return new Promise<void>((resolve) => {

      // Extend logo spinner on startup for funzies
      setTimeout(() => { resolve(); }, 3000);

    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApplication, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
