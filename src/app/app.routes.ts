import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PvComponent } from './pv/pv.component';
import { PhotosComponent } from './photos/photos.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'contact', component:ContactComponent},
    {path:'pv',component:PvComponent},
    {path:'photos',component:PhotosComponent},
    {path:'schedule',component:ScheduleComponent}
];
