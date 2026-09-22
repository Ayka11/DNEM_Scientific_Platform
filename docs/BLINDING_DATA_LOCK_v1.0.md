# DNEM v7.7 Blinding & Data-Lock Engine v1.0

## Purpose

Protect dataset integrity and explicitly record blinding and unblinding events.

Lifecycle:

REGISTERED → LOCKED → UNLOCKED → UNBLINDED

A locked dataset has:
- data hash
- metadata hash
- lock timestamp
- blinding state
- manifest hash

Unlocking requires an explicit reason and authorization flag.

The engine records governance events but cannot prove that no information leakage,
selection bias, accidental unblinding, or post-lock external manipulation occurred.
