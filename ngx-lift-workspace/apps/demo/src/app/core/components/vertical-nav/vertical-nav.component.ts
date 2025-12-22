import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ClarityModule} from '@clr/angular';

import {NavConfig} from './nav-config.model';
import {clrLiftNavConfig, ngxLiftNavConfig} from './vertical-nav.const';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [ClarityModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './vertical-nav.component.html',
  styleUrl: './vertical-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavComponent implements OnInit {
  navConfig: WritableSignal<NavConfig[]> = signal(ngxLiftNavConfig);

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Route has changed, do something
        if (event.url.includes('/ngx-lift')) {
          this.navConfig.set(ngxLiftNavConfig);
        } else if (event.url.includes('/clr-lift')) {
          this.navConfig.set(clrLiftNavConfig);
        }
      }
    });
  }
}
