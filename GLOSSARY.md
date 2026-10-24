# Key/value editing

Key/value editors organize ordered entries for metadata and configuration.

## Language

**Entry**: One key and its associated value at a particular position in an ordered list. Multiple entries may share a
key when the list's rules allow it.

**Key uniqueness**: A list rule requiring every nonempty key to occur at most once, using exact, case-sensitive
comparison.

**Pair uniqueness**: A list rule prohibiting repeated combinations of a nonempty key and the same value while allowing
that key with different values. Disabling a field does not exempt its entry from the list's uniqueness rules.
