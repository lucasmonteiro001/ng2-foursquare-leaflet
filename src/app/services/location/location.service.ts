import { Injectable } from '@angular/core';

@Injectable()
export class LocationService {

    private currentLocation = null;
    // TODO implement freshness to currentLocation cache

  constructor() { }

  /**
   *
   * @param success callback function if location search succeeds (returns {lat, lng})
   * @param fail callback function if location search fails (return (error))
   */
  getCurrentLocation(success: Function, fail: Function) {

      // if cached
      if(this.currentLocation) {
          success(this.currentLocation);
      }

      console.log('getCurrentLocation - start');
      navigator.geolocation.getCurrentPosition(
          (r) => {
              // cache current location
              this.currentLocation = { lat: r.coords.latitude, lng: r.coords.longitude };
              console.log('getCurrentLocation - end');
              success(this.currentLocation);
          },
          (error) =>  {
              console.log('getCurrentLocation - end');
              fail(error);
          }
      )
  }


}
