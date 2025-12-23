import { GenerativeModel } from "./models";
export interface FusionScore {
    overall: number;
    dimensions: Record<string, number>;
    confidence: number;
}
export declare function fusionScoreArtifact(artifact: any, models: GenerativeModel[]): Promise<FusionScore>;
//# sourceMappingURL=fusion-scoring-engine.d.ts.map