# DNEM v7.7 Effect Size & Uncertainty Governance Engine v1.0

This layer ensures that analysis records magnitude and uncertainty rather than
relying on statistical significance alone.

Implemented:
- raw mean difference
- 95% confidence interval using a normal approximation
- Cohen's d
- standard error
- uncertainty method metadata
- integrity hash for effect evidence

Interpretation status defaults to `DESCRIPTIVE`.

The engine does not define universal thresholds for "important" effects and does
not convert an effect estimate into causal or scientific validity claims.
The confidence interval implementation is a runtime approximation and should be
replaced/configured with the study's preregistered inferential method when needed.
