from typing import List, Dict

class ModelResult:
    def __init__(self, dimensions: Dict[str, float], confidence: float):
        self.dimensions = dimensions
        self.confidence = confidence

def fusion_score(results: List[ModelResult]) -> Dict[str, float]:
    # Quantum Bayesian fusion
    scores = {k: sum(m.dimensions.get(k,0) for m in results)/len(results) for k in results[0].dimensions}
    consensus = sum(m.confidence for m in results)/len(results)
    return {"overall": sum(scores.values())/len(scores), **scores, "consensus": consensus}