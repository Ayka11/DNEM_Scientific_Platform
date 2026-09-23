from dataclasses import dataclass, asdict
from typing import Dict, List, Optional
import hashlib, json

ALLOWED_EDGES = {
    "DERIVED_FROM", "TESTS", "SUPPORTS", "CONTRADICTS",
    "BLOCKS", "SATISFIES", "REVISES"
}

@dataclass
class Node:
    node_id: str
    node_type: str
    status: str = "active"
    payload: Optional[dict] = None

@dataclass
class Edge:
    source: str
    target: str
    relation: str
    evidence_id: Optional[str] = None

class ClaimEvidenceGraphV2:
    """
    Provenance graph for:
    Study -> Measurement -> Trial -> Result -> Analysis -> Evidence -> Claim
    -> Model -> Revision

    The graph is descriptive/governance infrastructure. It does not establish
    scientific truth by graph topology alone.
    """
    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.edges: List[Edge] = []

    def add_node(self, node_id, node_type, status="active", payload=None):
        self.nodes[node_id] = Node(node_id, node_type, status, payload or {})
        return self.nodes[node_id]

    def add_edge(self, source, target, relation, evidence_id=None):
        if relation not in ALLOWED_EDGES:
            raise ValueError(f"Unsupported relation: {relation}")
        if source not in self.nodes or target not in self.nodes:
            raise ValueError("Both edge endpoints must exist")
        edge=Edge(source, target, relation, evidence_id)
        self.edges.append(edge)
        return edge

    def incoming(self, node_id, relation=None):
        return [e for e in self.edges if e.target==node_id and
                (relation is None or e.relation==relation)]

    def outgoing(self, node_id, relation=None):
        return [e for e in self.edges if e.source==node_id and
                (relation is None or e.relation==relation)]

    def claim_state(self, claim_id):
        if claim_id not in self.nodes:
            raise KeyError(claim_id)
        claim=self.nodes[claim_id]
        if claim.node_type!="Claim":
            raise ValueError("node is not a Claim")

        supporting=[e for e in self.incoming(claim_id, "SUPPORTS")]
        contradictory=[e for e in self.incoming(claim_id, "CONTRADICTS")]
        blockers=[e for e in self.incoming(claim_id, "BLOCKS")]

        evidence_support=set(e.evidence_id for e in supporting if e.evidence_id)
        for e in supporting:
            evidence_support.update(
                x.evidence_id for x in self.incoming(e.source) if x.evidence_id
            )

        if blockers or contradictory:
            state="BLOCKED"
        elif not supporting:
            state="UNSUPPORTED"
        elif evidence_support:
            state="SUPPORTED_BY_GRAPH"
        else:
            state="SUPPORTED_EDGE_ONLY"

        return {
            "claim_id":claim_id,
            "state":state,
            "support_edges":len(supporting),
            "contradiction_edges":len(contradictory),
            "blocker_edges":len(blockers),
            "evidence_refs":sorted(x for x in evidence_support if x)
        }

    def graph_hash(self):
        payload={
            "nodes":[asdict(v) for v in sorted(self.nodes.values(), key=lambda x:x.node_id)],
            "edges":[asdict(v) for v in sorted(
                self.edges, key=lambda x:(x.source,x.target,x.relation,x.evidence_id or "")
            )]
        }
        canonical=json.dumps(payload,sort_keys=True,separators=(",",":"))
        return hashlib.sha256(canonical.encode()).hexdigest()

    def export(self):
        return {
            "nodes":[asdict(v) for v in self.nodes.values()],
            "edges":[asdict(v) for v in self.edges],
            "graph_hash":self.graph_hash()
        }

    @classmethod
    def from_validation_bundle(cls, bundle):
        g=cls()
        study_id=bundle.get("study_id","study_unknown")
        claim_id=bundle.get("claim_id","claim_unknown")
        g.add_node(study_id,"Study")
        g.add_node(claim_id,"Claim")
        g.add_edge(study_id,claim_id,"TESTS")

        for evidence in bundle.get("evidence",[]):
            eid=evidence["evidence_id"]
            g.add_node(eid,"Evidence",payload=evidence)
            g.add_edge(eid,claim_id,
                       "CONTRADICTS" if evidence.get("passed") is False else "SUPPORTS",
                       evidence_id=eid)

        decision=bundle.get("validation_status")
        g.add_node("decision_"+claim_id,"ValidationDecision",payload={
            "status":decision
        })
        if decision=="BLOCKED":
            g.add_edge("decision_"+claim_id,claim_id,"BLOCKS")
        else:
            g.add_edge("decision_"+claim_id,claim_id,"SATISFIES")
        return g
