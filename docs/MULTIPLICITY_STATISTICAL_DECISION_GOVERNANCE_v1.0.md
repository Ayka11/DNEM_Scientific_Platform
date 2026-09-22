# DNEM v7.7 Multiplicity & Statistical Decision Governance Engine v1.0

This component prevents confirmatory and exploratory analyses from being silently
mixed.

Test roles:
- PRIMARY
- SECONDARY
- EXPLORATORY

Supported family correction methods:
- NONE
- BONFERRONI
- HOLM
- BENJAMINI_HOCHBERG

Each test records:
- hypothesis
- family
- role
- raw p-value
- alpha
- adjusted threshold
- correction method
- decision
- registration state
- evidence hash

The engine records statistical decision rules. It does not convert a p-value into
a scientific claim or establish causal validity.
