import { Injectable} from '@angular/core';
import { Http, Response } from "@angular/http";

export class SearchCategoryDistance {

  constructor (public categoryId: string, public distance = 10000, public offset: number) {};
}

@Injectable()
export class FoursquareService {

  private API = 'https://api.foursquare.com/v2/venues';
  private CLIENT_ID = process.env.CLIENT_ID || 'WHUMMOSWJEAXXYIMTX0SRLIODR0WQ3Q1KW0MXF2UTZAW5XBQ';
  private CLIENT_SECRET = process.env.CLIENT_SECRET || '55GINM5OSXIJ1TURFWUJKSOZSBWNE2HJDKH02JHEDUPAS2XI';
  private v = process.env.VERSION || 20170128;
  private ll = '-19.8690857,-43.9637593';
  private OFFSET_LIMIT = process.env.OFFSET_LIMIT || 5;

  constructor(private http: Http) { }

  /**
   * Return the foursquare api url that belongs to the requested type
   * @param type
   * @param params
   * @param cityName
   * @returns {any}
   */
  getFormattedURL(type: string, params?: SearchCategoryDistance, cityName?: string) {

    switch (type) {

      // return trending places url
      case 'trending':
        return `${this.API}/trending/?v=${this.v}&ll=${this.ll}&limit=5&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}`;

      // return categories url
      case 'categories':
        return `${this.API}/categories/?v=${this.v}&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}`;

      // return search by category and distance url
      case 'search-category-distance':
        return `${this.API}/explore/?v=${this.v}&ll=${this.ll}&offset=${params.offset}&categoryId=${params.categoryId}&radius=${params.distance}&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}`;

      // return a general search in a city
      case 'general-search':
        return `${this.API}/explore/?v=${this.v}&near=${cityName}&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}`;

      default:
        return null;
    }

  };

  /**
   * Executes a callback function passing an array with categories as parameter
   * @param cb callback function
   */
  getCategories(cb : Function) {

    this.http.get(this.getFormattedURL('categories'))
      .map((response: Response) => response.json())
      .subscribe(({response : { categories }}) => {
        let _categories = categories.map(({ name, id }) => { return { name, id } });
        cb(_categories);
      });
  }

  /**
   * Executes a callback function passing an array with trending venues as parameter
   * @param lat latitude
   * @param lng longitude
   * @param cb callback function
   */
  getTrending(lat: number, lng: number, cb : Function) {

    this.ll = `${lat},${lng}`;

    this.http.get(this.getFormattedURL('trending'))
      .map((response: Response) => response.json())
      .subscribe(({response : { venues }}) => {
        cb(venues)
      });
  }

  /**
   * Executes a callback function passing an array with venues places as parameter
   * @param categoryId venues' category id
   * @param distance distance from location passed as parameter
   * @param lat latitude
   * @param lng longitude
   * @param cb callback function
   */
  getSearchCategoryDistance({ categoryId, distance, lat, lng } , cb: Function) {

    this.ll = `${lat},${lng}`;

    let allVenues = [],
      offset = 0,
      OFFSET_LIMIT = this.OFFSET_LIMIT,
      self = this;

    // Get all available venues given the OFFSET_LIMIT parameter
    while(true) {
      try {

        offset += 1;

        // too many results
        if(offset > this.OFFSET_LIMIT) {
          break;
        }

        (function(offset) {

          self.http.get(self.getFormattedURL('search-category-distance', new SearchCategoryDistance(categoryId, distance, offset)))
            .map((response: Response) => response.json())
            .subscribe((obj) => {

              let venues = obj.response.groups[0].items.map(d => d.venue) || [];

              // If no venue was found, return
              if(venues.length === 0) {
                // if first interaction
                if(offset === 1) {
                  cb(allVenues);
                }
                else {
                  return;
                }
              }

              allVenues = allVenues.concat(venues);

              if(offset === OFFSET_LIMIT) {
                cb(allVenues)
              }
            });
        })(offset);


      }
      catch (e) {
        cb(allVenues);
        break;
      }
    }


  }

  /**
   * Executes a callback function passing an array with venues places as parameter
   * @param cityName city name (search will be performed with near=cityName)
   * @param cb callback function
   */
  getGeneralSearch(cityName: string , cb: Function) {

    let allVenues = [],
      offset = 0,
      OFFSET_LIMIT = this.OFFSET_LIMIT,
      self = this;

    // Get all available venues given the OFFSET_LIMIT parameter
    while(true) {
      try {

        offset += 1;

        // too many results
        if(offset > this.OFFSET_LIMIT) {
          break;
        }

        (function(offset) {

          self.http.get(self.getFormattedURL('general-search', null, cityName))
            .map((response: Response) => response.json())
            .subscribe((obj) => {

              let venues = obj.response.groups[0].items.map(d => d.venue) || [];

              // If no venue was found, return
              if(venues.length === 0) {
                return;
              }

              allVenues = allVenues.concat(venues);

              if(offset === OFFSET_LIMIT) {
                cb(allVenues)
              }
            });
        })(offset);


      }
      catch (e) {
        cb(allVenues);
        break;
      }
    }
  }
}
