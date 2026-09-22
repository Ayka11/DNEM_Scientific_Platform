class EvidenceGraph:
    def __init__(self):
        self.nodes = []
        self.edges = []

    def add_node(self, node_id, node_type, label, **meta):
        node = {"id": node_id, "type": node_type, "label": label, **meta}
        self.nodes.append(node)
        return node

    def add_edge(self, source, target, relation, **meta):
        edge = {"source": source, "target": target, "relation": relation, **meta}
        self.edges.append(edge)
        return edge

    def as_dict(self):
        return {"nodes": self.nodes, "edges": self.edges}
