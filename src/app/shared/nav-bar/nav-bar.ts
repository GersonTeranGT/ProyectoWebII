import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  
  authService = inject(AuthService);
  private router = inject(Router);

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
}