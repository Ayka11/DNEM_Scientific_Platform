# DNEM v7.7 Replication & Generalization Engine v1.0

Implemented:

- independent replication consistency screen
- cross-sample validation screen
- subgroup consistency summaries
- generalization evidence object
- measurement-invariance screening layer

The implementation deliberately distinguishes:

**Replication consistency ≠ successful replication automatically**

**Cross-sample similarity ≠ external validity automatically**

**Subgroup similarity ≠ measurement invariance automatically**

Formal replication criteria, sample definitions, preregistration, effect-size
targets, uncertainty intervals, multiplicity handling, measurement models and
external-validity design must be specified by the research protocol.

The engine therefore emits evidence objects with `passed=false` by default.
These can subsequently be evaluated by an explicit validation policy.
