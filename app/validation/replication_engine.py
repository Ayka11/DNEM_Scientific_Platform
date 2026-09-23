from statistics import mean

class ReplicationGeneralizationEngine:
    """
    Computes structured replication/generalization evidence from supplied
    study-level results. It does not infer scientific success from a single
    replication or from arbitrary similarity.
    """

    def _clean(self, xs):
        return [float(x) for x in xs if x is not None]

    def effect_summary(self, estimates):
        x=self._clean(estimates)
        if not x:
            return {"n":0,"mean":None,"min":None,"max":None}
        m=mean(x)
        return {"n":len(x),"mean":m,"min":min(x),"max":max(x)}

    def replication_consistency(self, estimates, tolerance=0.20):
        s=self.effect_summary(estimates)
        if s["n"] < 2:
            return {"status":"INSUFFICIENT_REPLICATIONS",**s}
        m=s["mean"]
        if m == 0:
            deviation=max(abs(x) for x in estimates)
        else:
            deviation=max(abs(x-m)/max(abs(m),1e-12) for x in estimates)
        return {
            "status":"SCREEN_ONLY",
            "n_replications":s["n"],
            "mean_estimate":m,
            "max_relative_deviation":deviation,
            "tolerance":tolerance,
            "consistent_within_tolerance":deviation <= tolerance
        }

    def independent_replication(self, original, replications):
        vals=[original]+list(replications)
        result=self.replication_consistency(vals)
        return {
            "statistic":"replication_consistency",
            "value":result,
            "passed":False,
            "reason":"Consistency screen only; replication adequacy is not asserted."
        }

    def cross_sample(self, reference, validation):
        a=self._clean(reference); b=self._clean(validation)
        if not a or not b:
            return {"status":"INSUFFICIENT_DATA"}
        ma=mean(a); mb=mean(b)
        scale=max(abs(ma),abs(mb),1e-12)
        relative_difference=abs(ma-mb)/scale
        return {
            "status":"SCREEN_ONLY",
            "reference_mean":ma,
            "validation_mean":mb,
            "relative_mean_difference":relative_difference,
            "n_reference":len(a),
            "n_validation":len(b)
        }

    def subgroup_consistency(self, subgroup_estimates):
        summaries={}
        for name,values in subgroup_estimates.items():
            summaries[name]=self.effect_summary(values)
        return {"status":"SCREEN_ONLY","groups":summaries}

    def generalization_evidence(self, reference, validation, subgroups=None):
        result=self.cross_sample(reference,validation)
        if subgroups is not None:
            result["subgroups"]=self.subgroup_consistency(subgroups)
        return {
            "statistic":"cross_sample_generalization_screen",
            "value":result,
            "passed":False,
            "reason":"Generalization screen only; external validity is not asserted."
        }

    def build_evidence(self, payload):
        out={}
        if "original" in payload and "replications" in payload:
            out["replication"]=self.independent_replication(
                payload["original"],payload["replications"])
        if "reference" in payload and "validation" in payload:
            out["generalization"]=self.generalization_evidence(
                payload["reference"],payload["validation"],
                payload.get("subgroups"))
        return out
