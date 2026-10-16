import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {
  afterNextRender,
  ApplicationRef,
  createComponent,
  ComponentRef,
  DestroyRef,
  EnvironmentInjector,
  EnvironmentProviders,
  inject,
  InjectionToken,
  isDevMode,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
} from '@angular/core';
import {QueryDevtoolsComponent} from 'clr-lift';

const installation = new InjectionToken('query devtools installation', {
  providedIn: 'root',
  factory: () => ({installed: false}),
});

/**
 * Install one floating query inspector at application root. The package's production condition supplies a no-op.
 * @example
 * ```typescript
 * const appConfig: ApplicationConfig = {providers: [provideQueryDevtools()]};
 * ```
 */
export function provideQueryDevtools(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      if (!isDevMode() || !isPlatformBrowser(inject(PLATFORM_ID))) return;
      const state = inject(installation);
      if (state.installed) return;
      state.installed = true;
      const document = inject(DOCUMENT);
      const environmentInjector = inject(EnvironmentInjector);
      const applicationRef = inject(ApplicationRef);
      const destroyRef = inject(DestroyRef);
      let component: ComponentRef<QueryDevtoolsComponent> | undefined;
      let host: HTMLElement | undefined;
      const render = afterNextRender(
        () => {
          host = document.createElement('cll-query-devtools-root');
          component = createComponent(QueryDevtoolsComponent, {environmentInjector, hostElement: host});
          component.setInput('launcher', 'floating');
          document.body.append(host);
          applicationRef.attachView(component.hostView);
          component.changeDetectorRef.detectChanges();
        },
        {injector: environmentInjector},
      );
      destroyRef.onDestroy(() => {
        render.destroy();
        if (component) {
          applicationRef.detachView(component.hostView);
          component.destroy();
        }
        host?.remove();
        state.installed = false;
      });
    }),
  ]);
}
