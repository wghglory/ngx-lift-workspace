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

## Datagrid selection

**Item**: A resource offered for selection in a datagrid field. Its identity is independent of its current display
position or presentation.

_Avoid_: Row when referring to the resource rather than its displayed grid row.

**Selection value**: The resource identity or collection of resource identities chosen in a datagrid field. A resource
can remain selected while it is outside the currently displayed rows.

**Selection key**: The stable identifier distinguishing a selectable resource within the field's resource scope. A
display name alone is insufficient when different resources in that scope can share it.

**Selection scope**: The items covered by one select-all action after filtering and pagination. Scrolling an item out of
view does not remove it from this scope, and a footer alone does not establish pagination.
