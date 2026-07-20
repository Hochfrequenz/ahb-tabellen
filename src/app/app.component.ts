import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    if (environment.umamiWebsiteId) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://cloud.umami.is/script.js';
      script.setAttribute('data-website-id', environment.umamiWebsiteId);
      document.head.appendChild(script);
    }
  }
}
