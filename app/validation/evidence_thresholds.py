class EvidenceThresholdPolicy:
    """
    Optional explicit project policy. Defaults remain conservative.
    Thresholds are configuration, not scientific truths.
    """
    def __init__(self, min_alpha=None, min_test_retest=None,
                 min_validity_correlation=None, max_group_relative_difference=None):
        self.min_alpha=min_alpha
        self.min_test_retest=min_test_retest
        self.min_validity_correlation=min_validity_correlation
        self.max_group_relative_difference=max_group_relative_difference

    def evaluate(self, evidence):
        out={}
        if "reliability" in evidence and self.min_alpha is not None:
            v=evidence["reliability"].get("value")
            out["reliability"]={"passed":v is not None and v>=self.min_alpha,
                                "threshold":self.min_alpha,"value":v}
        if "stability" in evidence and self.min_test_retest is not None:
            v=evidence["stability"].get("value")
            out["stability"]={"passed":v is not None and v>=self.min_test_retest,
                              "threshold":self.min_test_retest,"value":v}
        if "construct_validity" in evidence and self.min_validity_correlation is not None:
            v=evidence["construct_validity"].get("value")
            out["construct_validity"]={"passed":v is not None and abs(v)>=self.min_validity_correlation,
                                       "threshold":self.min_validity_correlation,"value":v}
        if "invariance" in evidence and self.max_group_relative_difference is not None:
            v=evidence["invariance"].get("value")
            out["invariance"]={"passed":v is not None and v<=self.max_group_relative_difference,
                              "threshold":self.max_group_relative_difference,"value":v}
        return out
