import { Injectable } from '@angular/core';
import {LocationService} from "../location/location.service";

const L = require('leaflet');

declare const HeatmapOverlay: any;

@Injectable()
export class MapService {

  private map: any;
  private markers: any[] = [];
  private heatMapConfig = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.009,
      "maxOpacity": .8,
      // scales the radius based on map zoom
      "scaleRadius": true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'val'
  };
  private heatmapLayer = new HeatmapOverlay(this.heatMapConfig);

  constructor(private locationService: LocationService) {
  }

  /**
   * Create the map and instantiates it (if needed)
   */
  createMap() {

      // load a tile layer
      let baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/lucasmonteiro001/ciylfwkph00332rqqmdd3bsdj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYXNtb250ZWlybzAwMSIsImEiOiJjaXlsZTl0cGcwMDBrMzNwZm9qcnIxYjd6In0.V3qGeRTZbZW97ywL2Ue09Q',
          {
              attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
              maxZoom: 18
          });

      // gets current location to set view of map
      this.locationService.getCurrentLocation(({lat, lng}) => {

        try {
          this.map = L.map('mapid', {layers: [baseLayer, this.heatmapLayer]}).setView([lat, lng], 12);

          // reset the heat map layer
          this.heatmapLayer.setData({data: []});

        } catch (e) {
          console.log('map already initialized!');
        }

      }, (err) => console.log(err));

  }

  /**
   * Add a new marker to the map
   * @param lat marker's latitude
   * @param lng marker's longitude
   * @param title marker's title => will be showed upon click on marker
   */
  addMarker(lat: number, lng: number, title?: string) {

      let marker = L.marker([lat, lng], {title}).addTo(this.map);

      // create popoup if title is valid
      if(title) {

          let popup = L.popup()
              .setLatLng([lat, lng])
              .setContent(`<p>${title}</p>`)
             .openOn(this.map);

          marker.bindPopup(popup);
      }

      this.markers.push(marker);
  }

  /**
   * Remove all markers form the map
   */
  removeAllMarkers() {

      this.markers.map(marker => this.map.removeLayer(marker));

      this.markers = [];
  }

  /**
   * Add a heat map to the map
   * @param points points of the heatmap layer
   * @param max value
   */
  addHeatMap(points: any[], max?: number) {

      this.heatmapLayer.setData({max, data: points});
  }

  /**
   * Zoom in the map by zoom
   * @param zoom
   */
  setZoom(zoom: number) {

    this.map.setZoom(zoom);
  }

  /**
   * Set a new view of the map
   * @param lat latitude
   * @param lng longitude
   * @param zoom zoom approximation
   */
  setView(lat: string, lng: string, zoom: number) {

    this.map.setView([lat, lng], zoom);
  }

}
