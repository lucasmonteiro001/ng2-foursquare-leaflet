import { Component, OnInit } from '@angular/core';
import {MapService} from "../../services/map/map.service";
import {FoursquareService} from "../../services/foursquare/foursquare.service";
import {LocationService} from "../../services/location/location.service";

const SAVASSI = {lat: -19.9362, lng:-43.9323};

@Component({
  selector: 'app-top-five',
  templateUrl: 'top-five.component.html',
  styles: []
})
export class TopFiveComponent implements OnInit {

  constructor(private mapService: MapService,
                private locationService: LocationService,
                private foursquareService: FoursquareService) { }

  isSearching = false;
  receivedResult = false;

  ngOnInit() {
      this.mapService.createMap();
  }

  onSubmit() {

      this.isSearching = true;
      this.receivedResult = false;

      // get current location
      this.locationService.getCurrentLocation(({lat, lng}) => {
          // get trending places
          this.foursquareService.getTrending(lat, lng, (venues) => {
              let venuesLocation = venues.map(({name, location: {lat, lng}}) => {
                  this.mapService.addMarker(lat, lng, name);
              });
              this.isSearching = false;
              this.receivedResult = true;
          });
      }, err => console.log(err));

  }

}
