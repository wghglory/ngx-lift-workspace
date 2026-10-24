# ngx-lift and clr-lift

Product vocabulary for application interfaces built with ngx-lift and clr-lift.

## Key/value editing

Key/value editors organize ordered entries for metadata and configuration.

### Language

**Entry**: One key and its associated value at a particular position in an ordered list. Multiple entries may share a
key when the list's rules allow it.

**Key uniqueness**: A list rule requiring every nonempty key to occur at most once, using exact, case-sensitive
comparison.

**Pair uniqueness**: A list rule prohibiting repeated combinations of a nonempty key and the same value while allowing
that key with different values. Disabling a field does not exempt its entry from the list's uniqueness rules.

## Navigation

**Navigation root**: The first location in the application's navigable trail. It may represent a whole collection, a
bucket, or a permitted prefix within a bucket.

**Ancestor**: An earlier location supplied in the navigable trail, relative to its current location. Ancestor
reachability refers to those supplied locations, not every parent that might exist outside the trail.

**Current location**: The final location in the navigable trail, representing the location being viewed.
