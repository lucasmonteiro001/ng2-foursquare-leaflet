import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LayoutComponent } from "./layout/layout.component";
import { HeaderComponent } from "./layout/header.component";
import { routing } from "./app.routing";
import {FoursquareService} from "./services/foursquare/foursquare.service";
import {LocationService} from "./services/location/location.service";
import {MapService} from "./services/map/map.service";
import { TopFiveComponent } from './pages/top-five/top-five.component';
import { SearchCategoryDistanceComponent } from './pages/search-category-distance/search-category-distance.component';
import { SearchHeatmapComponent } from './pages/search-heatmap/search-heatmap.component';

import 'rxjs/add/operator/map';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    TopFiveComponent,
    SearchCategoryDistanceComponent,
    SearchHeatmapComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  providers: [FoursquareService, LocationService, MapService],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
