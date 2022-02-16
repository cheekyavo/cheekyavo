import { AfterViewInit, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { PriceService } from './providers/price.service';
import { SpinnerService } from './providers/spinner.service';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  url = '';
  resultsHtml = '';

  constructor(
    private priceService: PriceService,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.cd.markForCheck();

    }, 5000);

  }

  async submit(): Promise<void> {

    this.spinnerService.show();

    // Clear out any previous lookups
    this.resultsHtml = '';

    const { isValid, listingDetails } = await this.priceService.getListingDetails(this.url);

    if (!isValid) {

      this.resultsHtml = `
      <p class="error">Error processing this listing.</p>
      `;
      this.spinnerService.hide();

    } else {

      // Check listings up to 10 million
      this.priceService.getListingPrice(listingDetails, 0, 10000000).then((results) => {


        if (!results || results.isValid === false) {

          this.resultsHtml = `
          <p class="error">Error processing this listing.</p>
          `;
          this.spinnerService.hide();

        }

        this.resultsHtml = `
        <p class="success"><font color="green">Listing price discovered:</font> <strong>$${formatNumber(results.min, 'en-NZ', '1.0-0')}</strong></p>
        `;
        this.spinnerService.hide();

      }).catch((error) => {

        console.error(error);
        this.resultsHtml = `
        <p class="error">Error processing this listing.</p>
        `;
        this.spinnerService.hide();

      });

    }

  }

}
