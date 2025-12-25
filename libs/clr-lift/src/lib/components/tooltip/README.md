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
- [] Resize/Scroll Positioning: Pending implementation for resizing, scrolling, and dynamic positioning.

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
    this.alertComponent.hostView.detectChanges();
  }
}
```

### Usage 4

```html
<a href="javascript:void(0)" cllTooltip [cllTooltipContent]="SpinnerComponent" [cllTooltipHideDelay]="1000">
  Component Type Example
</a>
```

```ts
SpinnerComponent = SpinnerComponent;
```
