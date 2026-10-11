import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';

import {NavConfig} from './nav-config.model';
import {clrLiftNavConfig, ngxLiftNavConfig} from './vertical-nav.const';

@Component({
  selector: 'app-vertical-nav',
  imports: [ClarityModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './vertical-nav.component.html',
  styleUrl: './vertical-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VerticalNavComponent implements OnInit {
  navConfig: WritableSignal<NavConfig[]> = signal(ngxLiftNavConfig);

  readonly groupKeyMap: Record<string, string> = {
    'Signal Utils': 'nav.signalUtils',
    Operators: 'nav.operators',
    Validators: 'nav.validators',
    Pipes: 'nav.pipes',
    Utilities: 'nav.utilities',
    Components: 'nav.components',
  };

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  getGroupKey(value: string): string {
    return this.groupKeyMap[value] || value;
  }

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
