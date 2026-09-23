class AnalysisEngine:
    def descriptive(self, values):
        if not values:
            return {"n": 0}
        mean = sum(values) / len(values)
        return {"n": len(values), "mean": mean,
                "min": min(values), "max": max(values)}
