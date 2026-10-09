import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  people = [
    { role: 'ధర్మకర్త', name: 'శ్రీ నల్లందుల సిద్ధా రెడ్డి', phone: '9490418078' },
    { role: 'అర్చకులు', name: 'శ్రీ వేలవేటి బాలకృష్ణ', phone: '9347580090' },
  ];
}
