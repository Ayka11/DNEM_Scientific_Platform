from app.runtime.protocol_engine import ProtocolEngine
from app.services.results_pipeline import ResultsPipeline

class ResearchRuntime:
    def __init__(self, seed=20260922):
        self.seed=seed
        self.protocol_engine=ProtocolEngine(seed)
        self.results_pipeline=ResultsPipeline()

    def compile_and_run(self, measurement_ids, trials_per_measurement=10,
                        validation_by_domain=None):
        protocol=self.protocol_engine.compile(measurement_ids,trials_per_measurement)
        trials=self.protocol_engine.execute(protocol)
        results=self.results_pipeline.aggregate_trials(trials)
        profile=self.results_pipeline.domain_engine.build_profile(
            results,{},validation_by_domain)
        return {"protocol":protocol,"trials":trials,
                "results":results,"profile":profile}
