import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {

  public constructor(private http: HttpClient) {}

  public async get(url: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http
        .get(url, { responseType: 'text' })
        .toPromise()
        .then((res: any) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });

    });
  }

}
