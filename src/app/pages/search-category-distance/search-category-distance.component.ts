import {Component, OnInit, Input} from '@angular/core';
import {FoursquareService} from "../../services/foursquare/foursquare.service";
import {LocationService} from "../../services/location/location.service";
import {MapService} from "../../services/map/map.service";

@Component({
  selector: 'app-search-category-distance',
  templateUrl: 'search-category-distance.component.html',
  styles: []
})
export class SearchCategoryDistanceComponent implements OnInit {

  private categories = [];
  isSearching = false;
  receivedResult = false;

  constructor(private mapService: MapService,
              private locationService: LocationService,
              private foursquareService: FoursquareService) {

      this.foursquareService.getCategories(categories => this.categories = categories);

  }

  ngOnInit() {
    this.mapService.createMap();
  }

  onSubmit({categoryId, distance}) {

    this.isSearching = true;
    this.receivedResult = false;

    // get current location
    this.locationService.getCurrentLocation(({lat, lng}) => {
      // get all places in category and within distance
      this.foursquareService.getSearchCategoryDistance({categoryId, distance, lat, lng},
          (venues) => {

            this.mapService.removeAllMarkers();

            this.isSearching = false;
            this.receivedResult = true;

            // add markers of venues in the map
            venues.map(({name, location: {lat, lng}}) => {

              this.mapService.addMarker(lat, lng, name)
            });

          });

    }, (err) => console.log(err));

  }

}
