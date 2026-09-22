# DNEM v7.7 Research Runtime v1.0

This stage connects the implementation scaffold to an executable deterministic
research-runtime path:

1. Measurement IDs are selected from the 170-item registry.
2. A protocol is compiled.
3. Synthetic trials are generated under a deterministic seed.
4. Trial records follow the Universal Trial Contract fields.
5. Results are aggregated into raw, derived and task-score layers.
6. Persistence is available through SQLite.
7. FastAPI exposes `/api/v1/research/compile-run`.

Scientific boundary:
- Synthetic trials are not empirical observations.
- Task scores are not construct validation.
- No clinical, diagnostic or universal intelligence inference is made.
- Real stimulus adapters, participant privacy controls, psychometrics,
  multimodal acquisition and replication remain separate validation stages.
