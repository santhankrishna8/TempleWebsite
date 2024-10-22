import { Component } from '@angular/core';
declare const bootstrap: any;
@Component({
  selector: 'app-pv',
  standalone: true,
  imports: [],
  templateUrl: './pv.component.html',
  styleUrl: './pv.component.css'
})
export class PvComponent {
  openModal() {
    // Use Bootstrap's JavaScript to show the modal
    const modalElement = document.getElementById('simpleModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

}
