import { Component, OnInit } from '@angular/core';
import {FoursquareService} from "../../services/foursquare/foursquare.service";
import {MapService} from "../../services/map/map.service";

@Component({
  selector: 'app-search-heatmap',
  templateUrl: 'search-heatmap.component.html',
  styles: []
})
export class SearchHeatmapComponent implements OnInit {

  constructor(private foursquareService: FoursquareService,
              private mapService: MapService) { }

  isSearching = false;
  receivedResult = false;

  ngOnInit() {

      this.mapService.createMap();
  }

  onSubmit({city}) {

    this.isSearching = true;
    this.receivedResult = false;

    this.foursquareService.getGeneralSearch(city, (venues) => {

      let data = venues.map(({name, location: {lat, lng}}) => {
        return {lat, lng, name};
      });

      this.mapService.removeAllMarkers();

      // add heat map
      this.mapService.addHeatMap(data);

      this.mapService.setView(data[0].lat, data[0].lng, 12);

      this.isSearching = false;
      this.receivedResult = true;

    })
  }

}
