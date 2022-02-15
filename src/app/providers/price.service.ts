import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as cheerio from 'cheerio';

@Injectable({ providedIn: 'root' })
export class PriceService {

  public constructor(private api: ApiService) {}

  public async getListingDetails(url: string): Promise<any> {

    return new Promise<any>(async (resolve) => {

      try {

        let html = '';
        html = await this.api.get(url);
        const isValid = html.toLowerCase().includes('property type');

        if (isValid) {

          const $ = cheerio.load(html);

          const title = encodeURIComponent($('.tm-property-listing-body__title')?.text()?.trim()?.toLowerCase());
          const location = $('.tm-property-listing-body__location')?.text()?.trim()?.split(',');

          const region = location[location.length - 1]?.trim()?.toLowerCase()?.replace(' ', '-');
          const district = location[location.length - 2]?.trim()?.toLowerCase()?.replace(' ', '-');
          const suburb = location[location.length - 3]?.trim()?.toLowerCase()?.replace(' ', '-');

          resolve({ isValid, listingDetails:
            {
              title,
              region,
              district,
              suburb
            }
          });

        } else {

          resolve({ isValid: false });

        }

      } catch (error) {

        console.error(error);
        resolve({ isValid: false });

      }

    });

  }

  public async getListingPrice(listingDetails: any, min: number, max: number): Promise<any> {

    try {

      const promises = [];

      if (min === max) {

        promises.push(this.checkListingPrice(listingDetails, min, min));

      } else if ((max - min) === 1000) {

        promises.push(this.checkListingPrice(listingDetails, min, min));
        promises.push(this.checkListingPrice(listingDetails, max, max));

      } else {

        let numberOfLookups = 5;
        let increment = Math.round((max - min) / 5);

        if (increment % 1000 !== 0) {

          increment = 1000;
          numberOfLookups = Math.round((max - min) / 1000);

        }

        for (let index = 0; index < numberOfLookups; index++) {

          const newMin = index === 0 ? min : min + (increment * index);
          const newMax = increment + newMin;

          console.log('newMin', newMin);
          console.log('newMax', newMax);

          promises.push(this.checkListingPrice(listingDetails, newMin, newMax));

        }

      }

      const results = await Promise.race(promises);

      console.log('results', JSON.stringify(results, null, 2));

      if (results.isValid && (results.max - results.min) === 0) {

        return results;

      } else if (results.isValid && (results.max - results.min) !== 0) {

        // Some re-cursion magic
        return this.getListingPrice(listingDetails, results.min, results.max);

      } else {

        console.error('No Results Found');
        throw new Error('');

      }

    } catch (error) {

      console.error(error);
      throw new Error('No Results Found');

    }

  }

  private async checkListingPrice(listingDetails: any, min: number, max: number): Promise<any> {

    return new Promise<any>(async (resolve) => {

      const url = `https://www.trademe.co.nz/a/property/residential/sale/${listingDetails.region}/${listingDetails.district}/${listingDetails.suburb}/search?price_min=${min}&price_max=${max}&search_string=${listingDetails.title}`;

      console.log('url', url);

      try {

        let html = '';
        html = await this.api.get(url);
        const isValid = !html.toLowerCase().includes('showing 0 results');

        if (isValid) {

          resolve({ isValid, min, max });

        } else {

          // Delay resolving if price not found, so correct promise has time to resolve first
          setTimeout(() => {

            resolve({ isValid, min, max });

          }, 60000);

        }

      } catch (error) {

        console.error(error);
        resolve({ isValid: false });

      }

    });

  }

}

