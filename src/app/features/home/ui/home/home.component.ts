import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkComponent } from '@shared/ui/atoms/link/link.component';
import { AuthService } from '@feature/auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [LinkComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  authService = inject(AuthService);
}
