import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/shared/environments';
import { RefreshService } from 'src/shared/jwt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly refreshService: RefreshService = inject(RefreshService);

  constructor() {
    this.refreshService.initRefreshUrl(`${environment.apiUrl}/api/v1/auth/refresh`);
  }
}
