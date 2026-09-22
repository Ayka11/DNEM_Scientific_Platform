from app.domain.models import Study, new_id

class StudyService:
    def __init__(self, measurement_registry):
        self.registry = measurement_registry
        self.studies = {}

    def create(self, title, measurement_ids=None, seed=20260922):
        ids = measurement_ids or list(self.registry.keys())[:5]
        unknown = [x for x in ids if x not in self.registry]
        if unknown:
            raise ValueError(f"Unknown measurements: {unknown}")
        s = Study(new_id("study"), title, measurement_ids=ids, seed=seed)
        self.studies[s.study_id] = s
        return s

    def freeze(self, study_id):
        s = self.studies[study_id]
        s.status = "FROZEN"
        return s
