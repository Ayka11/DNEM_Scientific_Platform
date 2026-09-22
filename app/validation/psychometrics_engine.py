import math
from collections import defaultdict

class PsychometricValidationEngine:
    """
    Computational evidence engine.

    It calculates descriptive/reliability/stability/invariance evidence from
    supplied datasets. It does NOT decide whether a construct is scientifically
    valid in the absence of a pre-registered interpretation and adequate design.
    """

    def _clean(self, xs):
        return [float(x) for x in xs if x is not None]

    def descriptive(self, values):
        x=self._clean(values)
        if not x: return {"n":0}
        mean=sum(x)/len(x)
        var=sum((v-mean)**2 for v in x)/(len(x)-1) if len(x)>1 else 0.0
        return {"n":len(x),"mean":mean,"sd":math.sqrt(var),
                "min":min(x),"max":max(x)}

    def pearson(self, x, y):
        x=self._clean(x); y=self._clean(y)
        n=min(len(x),len(y))
        if n<3: return None
        x=x[:n]; y=y[:n]
        mx=sum(x)/n; my=sum(y)/n
        num=sum((a-mx)*(b-my) for a,b in zip(x,y))
        dx=sum((a-mx)**2 for a in x); dy=sum((b-my)**2 for b in y)
        den=math.sqrt(dx*dy)
        return None if den==0 else num/den

    def cronbach_alpha(self, item_matrix):
        # rows = participants, columns = items
        if not item_matrix or len(item_matrix)<2: return None
        k=len(item_matrix[0])
        if k<2: return None
        cols=list(zip(*item_matrix))
        n=len(item_matrix)
        variances=[]
        for col in cols:
            m=sum(col)/n
            variances.append(sum((v-m)**2 for v in col)/(n-1))
        totals=[sum(row) for row in item_matrix]
        mt=sum(totals)/n
        vt=sum((v-mt)**2 for v in totals)/(n-1)
        if vt==0: return None
        return (k/(k-1))*(1-sum(variances)/vt)

    def split_half(self, item_matrix):
        if not item_matrix or len(item_matrix[0])<2: return None
        a=[sum(r[::2]) for r in item_matrix]
        b=[sum(r[1::2]) for r in item_matrix]
        return self.pearson(a,b)

    def test_retest(self, time1, time2):
        r=self.pearson(time1,time2)
        return {"correlation":r,"n":min(len(time1),len(time2))}

    def paired_mean_change(self, time1, time2):
        n=min(len(time1),len(time2))
        if n==0: return {"n":0,"mean_change":None}
        d=[float(time2[i])-float(time1[i]) for i in range(n)]
        return {"n":n,"mean_change":sum(d)/n}

    def group_difference(self, group_a, group_b):
        a=self._clean(group_a); b=self._clean(group_b)
        if not a or not b: return {"n_a":len(a),"n_b":len(b),"mean_difference":None}
        return {"n_a":len(a),"n_b":len(b),
                "mean_a":sum(a)/len(a),"mean_b":sum(b)/len(b),
                "mean_difference":sum(a)/len(a)-sum(b)/len(b)}

    def invariance_screen(self, group_a, group_b, tolerance=0.10):
        d=self.group_difference(group_a,group_b)
        if d["mean_a"] is None: return {"status":"INSUFFICIENT_DATA",**d}
        scale=max(abs(d["mean_a"]),abs(d["mean_b"]),1e-12)
        rel=abs(d["mean_difference"])/scale
        return {"status":"SCREEN_ONLY","relative_mean_difference":rel,
                "tolerance":tolerance,"within_tolerance":rel<=tolerance,**d}

    def validity_correlation(self, measure, criterion):
        return {"criterion_correlation":self.pearson(measure,criterion),
                "interpretation":"association_only"}

    def build_evidence(self, data):
        """
        Converts calculated statistics into machine-readable evidence.
        No gate is automatically passed merely because a statistic exists.
        A caller must provide explicit thresholds/design criteria.
        """
        evidence={}
        if "items" in data:
            alpha=self.cronbach_alpha(data["items"])
            evidence["reliability"]={
                "statistic":"cronbach_alpha","value":alpha,
                "passed":False,
                "reason":"Statistic computed; threshold/design decision not asserted."
            }
        if "time1" in data and "time2" in data:
            tr=self.test_retest(data["time1"],data["time2"])
            evidence["stability"]={
                "statistic":"test_retest_correlation","value":tr["correlation"],
                "passed":False,
                "reason":"Stability statistic computed; adequacy not asserted."
            }
        if "group_a" in data and "group_b" in data:
            inv=self.invariance_screen(data["group_a"],data["group_b"])
            evidence["invariance"]={
                "statistic":"relative_mean_difference","value":inv["relative_mean_difference"],
                "passed":False,
                "reason":"Screening statistic only; formal invariance not established."
            }
        if "measure" in data and "criterion" in data:
            cv=self.validity_correlation(data["measure"],data["criterion"])
            evidence["construct_validity"]={
                "statistic":"criterion_correlation","value":cv["criterion_correlation"],
                "passed":False,
                "reason":"Association computed; construct validity not established."
            }
        return evidence
