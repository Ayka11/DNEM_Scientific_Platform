# DNEM Scientific Platform v7.7 — Production Integrated Release

## Scope

This release consolidates the DNEM scientific runtime and governance layers
through the complete research-cycle lineage.

### End-to-end architecture

Measurement → Study → Experiment → Dataset → Analysis → Evidence → Claim →
Decision → Ledger → Audit → Model Revision → Successor Cycle → Protocol Lineage
→ Pre-registration Lock.

## Scientific governance

The platform deliberately distinguishes:

- raw data from derived measures;
- task performance from construct inference;
- state from trait;
- association from causation;
- evidence from validation;
- reproducibility/integrity from scientific validity.

`VALIDATED` is never synthesized by the integration layer.

## Release boundaries

The integrated application does not automatically:

- validate a construct;
- issue clinical conclusions;
- establish causality;
- convert synthetic runtime output into experimental validation;
- overwrite locked protocols;
- reuse prior trials as new observations.

## Deployment target

The package is structured as the consolidated source release for GitHub and
Hugging Face deployment. Existing Docker/HF entrypoints from the inherited
runtime are retained.
