# Tooltip

Whether you want to display additional information, provide hints, or offer interactive content, Tooltip has got you
covered

## Features

- [x] Close Button: Allows adding a close button for complex content.
- [x] Content Interaction: Supports hover and copy actions within the content popover.
- [x] Delay Configuration: Provides options to configure delay in showing/hiding the tooltip.
- [x] Automatic Positioning: Automatically positions the tooltip for optimal visibility.
- [x] Focus Trap: Implements focus trapping to keep focus within the tooltip when open.
- [x] Click Outside Interaction: Closes the popover when clicking outside the tooltip.
- [x] Keyboard Operations: Supports keyboard operations, including escape key to close.
- [x] Dark Mode: Offers a dark mode for better visual experience.
- [x] Viewport Changes: Closes on resize or captured scroll events so stale coordinates are not displayed.
- [x] Lifecycle Cleanup: Destroys tooltip-owned views and timers when hidden or when the trigger is destroyed.
- [x] Reactive Inputs: Updates content, context, width, and position while already visible.
- [x] Accessible Description: Links the tooltip to its trigger with `aria-describedby`, preserving existing
      descriptions.

## Usages

### Usage 1

```html
<a href="javascript:void(0)" cllTooltip="This is our cllTooltip text">Basic Tooltip 1</a>

<a
  href="javascript:void(0)"
  cllTooltip
  cllTooltipContent="This is our cllTooltip text"
  [cllTooltipHideDelay]="500"
  [cllTooltipWidth]="100"
>
  Basic Tooltip 2 with Delay
</a>
```

### Usage 2

```html
<a
  href="javascript:void(0)"
  cllTooltip
  [cllTooltipContent]="ref"
  [cllTooltipWidth]="100"
  [cllTooltipHideDelay]="1000"
  [cllTooltipPosition]="'tooltip-top-right'"
>
  Ref
</a>
<ng-template #ref> Ref template <button (click)="go()" class="btn btn-primary btn-sm">GO</button> </ng-template>
```

### Usage 3

```html
<a
  *ngIf="alertComponent"
  href="javascript:void(0)"
  cllTooltip
  [cllTooltipContent]="alertComponent"
  [cllTooltipWidth]="600"
  [cllTooltipHideDelay]="1000"
>
  Component Ref
</a>
```

```typescript
export class DemoComponent {
  private appRef = inject(ApplicationRef);

  alertComponent?: ComponentRef<AlertComponent>;

  ngOnInit() {
    const environmentInjector = this.appRef.injector;
    this.alertComponent = createComponent(AlertComponent, {environmentInjector});
    this.alertComponent.setInput('content', 'i am from alert component');
    this.appRef.attachView(this.alertComponent.hostView);
    this.alertComponent.hostView.detectChanges();
  }

  ngOnDestroy() {
    this.alertComponent?.destroy();
  }
}
```

A supplied `ComponentRef` remains caller-owned: the tooltip temporarily moves its DOM, restores its previous parent when
closed, and never destroys its view. If the caller already destroyed the view, its DOM is not rendered or restored. The
caller owns attachment, change detection, and final destruction. Prefer a component type or `TemplateRef` when the
tooltip should own creation and cleanup.

### Usage 4

```html
<a href="javascript:void(0)" cllTooltip [cllTooltipContent]="SpinnerComponent" [cllTooltipHideDelay]="1000">
  Component Type Example
</a>
```

```ts
SpinnerComponent = SpinnerComponent;
```
