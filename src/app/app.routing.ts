import { RouterModule, Routes } from '@angular/router';

import {TopFiveComponent} from "./pages/top-five/top-five.component";
import {SearchCategoryDistanceComponent} from "./pages/search-category-distance/search-category-distance.component";
import {SearchHeatmapComponent} from "./pages/search-heatmap/search-heatmap.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/top-five', pathMatch: 'full'},
  {path: 'top-five', component: TopFiveComponent},
  {path: 'search-category-distance', component: SearchCategoryDistanceComponent},
  {path: 'explore-location', component: SearchHeatmapComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);
