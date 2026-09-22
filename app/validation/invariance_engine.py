from math import sqrt

class InvarianceEngine:
    """
    Screening layer for subgroup measurement comparability.
    Full multi-group CFA/IRT/SEM is intentionally outside this lightweight
    implementation and must provide externally computed evidence objects.
    """

    def mean_variance_screen(self, groups):
        result={}
        for name,values in groups.items():
            x=[float(v) for v in values if v is not None]
            if not x:
                result[name]={"n":0}
                continue
            m=sum(x)/len(x)
            var=sum((v-m)**2 for v in x)/(len(x)-1) if len(x)>1 else 0
            result[name]={"n":len(x),"mean":m,"variance":var}
        return {"status":"SCREEN_ONLY","groups":result}

    def build_evidence(self, groups):
        return {
            "statistic":"group_mean_variance_screen",
            "value":self.mean_variance_screen(groups),
            "passed":False,
            "reason":"Formal measurement invariance requires a specified measurement model and appropriate estimation."
        }
