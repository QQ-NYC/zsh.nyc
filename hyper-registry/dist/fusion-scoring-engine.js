"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fusionScoreArtifact = fusionScoreArtifact;
async function fusionScoreArtifact(artifact, models) {
    // Parallel dispatch to all models
    const results = await Promise.all(models.map(m => m.evaluate(artifact)));
    // Quantum Bayesian fusion & confidence
    const dims = ["security", "performance", "codeQuality", "innovation"];
    const fuse = (k) => results.map(r => r.dimensions[k]).reduce((a, b) => a + b, 0) / results.length;
    return {
        overall: dims.map(fuse).reduce((a, b) => a + b, 0) / dims.length,
        dimensions: Object.fromEntries(dims.map(k => [k, fuse(k)])),
        confidence: results.map(r => r.confidence).reduce((a, b) => a + b, 0) / results.length
    };
}
//# sourceMappingURL=fusion-scoring-engine.js.map