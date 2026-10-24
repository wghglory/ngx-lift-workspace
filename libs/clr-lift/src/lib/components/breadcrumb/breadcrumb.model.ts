/** One caller-owned location, ordered from navigation root to current location. */
export interface BreadcrumbItem {
  /** Unique within this trail. Empty IDs and repeated labels are allowed. */
  readonly id: string;
  readonly label: string;
  /** Relative or supported ordinary URL. Omit for an addressless ancestor action. */
  readonly href?: string;
  /** Optional display detail. Never interpreted as a destination or identity. */
  readonly context?: string;
}

/** Context for a consumer-owned real anchor, for example an Angular RouterLink. */
export interface BreadcrumbLinkContext {
  readonly $implicit: BreadcrumbItem;
}
