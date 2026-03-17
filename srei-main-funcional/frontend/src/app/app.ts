import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,IonicModule],
  templateUrl: './app.html',
  styleUrl: './app.css'

})
export class App {
  protected readonly title = signal('frontend');
}
