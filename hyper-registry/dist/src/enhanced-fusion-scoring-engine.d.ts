import { z } from "zod";
export declare const ModelConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    provider: z.ZodEnum<["openai", "anthropic", "google", "meta", "custom", "quantum"]>;
    version: z.ZodString;
    capabilities: z.ZodArray<z.ZodString, "many">;
    metrics: z.ZodObject<{
        accuracy: z.ZodNumber;
        latency: z.ZodNumber;
        cost: z.ZodNumber;
        reliability: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        accuracy: number;
        latency: number;
        cost: number;
        reliability: number;
    }, {
        accuracy: number;
        latency: number;
        cost: number;
        reliability: number;
    }>;
    configuration: z.ZodRecord<z.ZodString, z.ZodAny>;
    apiKey: z.ZodOptional<z.ZodString>;
    endpoint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    version: string;
    capabilities: string[];
    provider: "custom" | "openai" | "anthropic" | "google" | "meta" | "quantum";
    metrics: {
        accuracy: number;
        latency: number;
        cost: number;
        reliability: number;
    };
    configuration: Record<string, any>;
    apiKey?: string | undefined;
    endpoint?: string | undefined;
}, {
    id: string;
    name: string;
    version: string;
    capabilities: string[];
    provider: "custom" | "openai" | "anthropic" | "google" | "meta" | "quantum";
    metrics: {
        accuracy: number;
        latency: number;
        cost: number;
        reliability: number;
    };
    configuration: Record<string, any>;
    apiKey?: string | undefined;
    endpoint?: string | undefined;
}>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export declare const ScoringDimensionsSchema: z.ZodObject<{
    security: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            codeScanning: z.ZodNumber;
            vulnerabilityDetection: z.ZodNumber;
            dependencyAudit: z.ZodNumber;
            accessControl: z.ZodNumber;
            encryption: z.ZodNumber;
            compliance: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        }, {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        }>;
        threats: z.ZodArray<z.ZodString, "many">;
        recommendations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        };
        threats: string[];
        recommendations: string[];
    }, {
        score: number;
        breakdown: {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        };
        threats: string[];
        recommendations: string[];
    }>;
    performance: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            latency: z.ZodNumber;
            throughput: z.ZodNumber;
            resourceEfficiency: z.ZodNumber;
            scalability: z.ZodNumber;
            concurrency: z.ZodNumber;
            stability: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        }, {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        }>;
        benchmarks: z.ZodArray<z.ZodString, "many">;
        optimizationOpportunities: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        };
        benchmarks: string[];
        optimizationOpportunities: string[];
    }, {
        score: number;
        breakdown: {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        };
        benchmarks: string[];
        optimizationOpportunities: string[];
    }>;
    codeQuality: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            readability: z.ZodNumber;
            maintainability: z.ZodNumber;
            testCoverage: z.ZodNumber;
            complexity: z.ZodNumber;
            documentation: z.ZodNumber;
            bestPractices: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        }, {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        }>;
        codeSmells: z.ZodArray<z.ZodString, "many">;
        refactoringSuggestions: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        };
        codeSmells: string[];
        refactoringSuggestions: string[];
    }, {
        score: number;
        breakdown: {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        };
        codeSmells: string[];
        refactoringSuggestions: string[];
    }>;
    architecture: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            modularity: z.ZodNumber;
            scalability: z.ZodNumber;
            resilience: z.ZodNumber;
            evolvability: z.ZodNumber;
            integration: z.ZodNumber;
            patterns: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        }, {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        }>;
        designPatterns: z.ZodArray<z.ZodString, "many">;
        architecturalDebt: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        };
        designPatterns: string[];
        architecturalDebt: string[];
    }, {
        score: number;
        breakdown: {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        };
        designPatterns: string[];
        architecturalDebt: string[];
    }>;
    innovation: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            novelty: z.ZodNumber;
            impact: z.ZodNumber;
            adoptionPotential: z.ZodNumber;
            differentiation: z.ZodNumber;
            futureProofing: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        }, {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        }>;
        patentPotential: z.ZodBoolean;
        competitiveAdvantage: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        };
        patentPotential: boolean;
        competitiveAdvantage: string[];
    }, {
        score: number;
        breakdown: {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        };
        patentPotential: boolean;
        competitiveAdvantage: string[];
    }>;
    community: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            engagement: z.ZodNumber;
            contributions: z.ZodNumber;
            documentation: z.ZodNumber;
            support: z.ZodNumber;
            ecosystem: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        }, {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        }>;
        communityMetrics: z.ZodRecord<z.ZodString, z.ZodAny>;
        growthPotential: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        };
        communityMetrics: Record<string, any>;
        growthPotential: string;
    }, {
        score: number;
        breakdown: {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        };
        communityMetrics: Record<string, any>;
        growthPotential: string;
    }>;
    maintainability: z.ZodObject<{
        score: z.ZodNumber;
        breakdown: z.ZodObject<{
            easeOfUpdates: z.ZodNumber;
            dependencyManagement: z.ZodNumber;
            backwardCompatibility: z.ZodNumber;
            migrationPath: z.ZodNumber;
            deprecationStrategy: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        }, {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        }>;
        maintenanceCost: z.ZodString;
        technicalDebt: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        score: number;
        breakdown: {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        };
        maintenanceCost: string;
        technicalDebt: Record<string, any>;
    }, {
        score: number;
        breakdown: {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        };
        maintenanceCost: string;
        technicalDebt: Record<string, any>;
    }>;
}, "strip", z.ZodTypeAny, {
    security: {
        score: number;
        breakdown: {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        };
        threats: string[];
        recommendations: string[];
    };
    performance: {
        score: number;
        breakdown: {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        };
        benchmarks: string[];
        optimizationOpportunities: string[];
    };
    codeQuality: {
        score: number;
        breakdown: {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        };
        codeSmells: string[];
        refactoringSuggestions: string[];
    };
    innovation: {
        score: number;
        breakdown: {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        };
        patentPotential: boolean;
        competitiveAdvantage: string[];
    };
    maintainability: {
        score: number;
        breakdown: {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        };
        maintenanceCost: string;
        technicalDebt: Record<string, any>;
    };
    architecture: {
        score: number;
        breakdown: {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        };
        designPatterns: string[];
        architecturalDebt: string[];
    };
    community: {
        score: number;
        breakdown: {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        };
        communityMetrics: Record<string, any>;
        growthPotential: string;
    };
}, {
    security: {
        score: number;
        breakdown: {
            codeScanning: number;
            vulnerabilityDetection: number;
            dependencyAudit: number;
            accessControl: number;
            encryption: number;
            compliance: number;
        };
        threats: string[];
        recommendations: string[];
    };
    performance: {
        score: number;
        breakdown: {
            latency: number;
            throughput: number;
            resourceEfficiency: number;
            scalability: number;
            concurrency: number;
            stability: number;
        };
        benchmarks: string[];
        optimizationOpportunities: string[];
    };
    codeQuality: {
        score: number;
        breakdown: {
            readability: number;
            maintainability: number;
            testCoverage: number;
            complexity: number;
            documentation: number;
            bestPractices: number;
        };
        codeSmells: string[];
        refactoringSuggestions: string[];
    };
    innovation: {
        score: number;
        breakdown: {
            novelty: number;
            impact: number;
            adoptionPotential: number;
            differentiation: number;
            futureProofing: number;
        };
        patentPotential: boolean;
        competitiveAdvantage: string[];
    };
    maintainability: {
        score: number;
        breakdown: {
            easeOfUpdates: number;
            dependencyManagement: number;
            backwardCompatibility: number;
            migrationPath: number;
            deprecationStrategy: number;
        };
        maintenanceCost: string;
        technicalDebt: Record<string, any>;
    };
    architecture: {
        score: number;
        breakdown: {
            scalability: number;
            modularity: number;
            resilience: number;
            evolvability: number;
            integration: number;
            patterns: number;
        };
        designPatterns: string[];
        architecturalDebt: string[];
    };
    community: {
        score: number;
        breakdown: {
            documentation: number;
            engagement: number;
            contributions: number;
            support: number;
            ecosystem: number;
        };
        communityMetrics: Record<string, any>;
        growthPotential: string;
    };
}>;
export type ScoringDimensions = z.infer<typeof ScoringDimensionsSchema>;
export declare const FusionScoreSchema: z.ZodObject<{
    overall: z.ZodNumber;
    dimensions: z.ZodObject<{
        security: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                codeScanning: z.ZodNumber;
                vulnerabilityDetection: z.ZodNumber;
                dependencyAudit: z.ZodNumber;
                accessControl: z.ZodNumber;
                encryption: z.ZodNumber;
                compliance: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            }, {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            }>;
            threats: z.ZodArray<z.ZodString, "many">;
            recommendations: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        }, {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        }>;
        performance: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                latency: z.ZodNumber;
                throughput: z.ZodNumber;
                resourceEfficiency: z.ZodNumber;
                scalability: z.ZodNumber;
                concurrency: z.ZodNumber;
                stability: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            }, {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            }>;
            benchmarks: z.ZodArray<z.ZodString, "many">;
            optimizationOpportunities: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        }, {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        }>;
        codeQuality: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                readability: z.ZodNumber;
                maintainability: z.ZodNumber;
                testCoverage: z.ZodNumber;
                complexity: z.ZodNumber;
                documentation: z.ZodNumber;
                bestPractices: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            }, {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            }>;
            codeSmells: z.ZodArray<z.ZodString, "many">;
            refactoringSuggestions: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        }, {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        }>;
        architecture: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                modularity: z.ZodNumber;
                scalability: z.ZodNumber;
                resilience: z.ZodNumber;
                evolvability: z.ZodNumber;
                integration: z.ZodNumber;
                patterns: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            }, {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            }>;
            designPatterns: z.ZodArray<z.ZodString, "many">;
            architecturalDebt: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        }, {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        }>;
        innovation: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                novelty: z.ZodNumber;
                impact: z.ZodNumber;
                adoptionPotential: z.ZodNumber;
                differentiation: z.ZodNumber;
                futureProofing: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            }, {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            }>;
            patentPotential: z.ZodBoolean;
            competitiveAdvantage: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        }, {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        }>;
        community: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                engagement: z.ZodNumber;
                contributions: z.ZodNumber;
                documentation: z.ZodNumber;
                support: z.ZodNumber;
                ecosystem: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            }, {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            }>;
            communityMetrics: z.ZodRecord<z.ZodString, z.ZodAny>;
            growthPotential: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        }, {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        }>;
        maintainability: z.ZodObject<{
            score: z.ZodNumber;
            breakdown: z.ZodObject<{
                easeOfUpdates: z.ZodNumber;
                dependencyManagement: z.ZodNumber;
                backwardCompatibility: z.ZodNumber;
                migrationPath: z.ZodNumber;
                deprecationStrategy: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            }, {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            }>;
            maintenanceCost: z.ZodString;
            technicalDebt: z.ZodRecord<z.ZodString, z.ZodAny>;
        }, "strip", z.ZodTypeAny, {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        }, {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        }>;
    }, "strip", z.ZodTypeAny, {
        security: {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        };
        performance: {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        };
        codeQuality: {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        };
        innovation: {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        };
        maintainability: {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        };
        architecture: {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        };
        community: {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        };
    }, {
        security: {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        };
        performance: {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        };
        codeQuality: {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        };
        innovation: {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        };
        maintainability: {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        };
        architecture: {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        };
        community: {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        };
    }>;
    confidence: z.ZodNumber;
    consensus: z.ZodNumber;
    variance: z.ZodNumber;
    trend: z.ZodEnum<["improving", "stable", "declining"]>;
    historicalComparison: z.ZodObject<{
        previousScore: z.ZodNumber;
        change: z.ZodNumber;
        percentile: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        previousScore: number;
        change: number;
        percentile: number;
    }, {
        previousScore: number;
        change: number;
        percentile: number;
    }>;
    explanations: z.ZodArray<z.ZodString, "many">;
    recommendations: z.ZodArray<z.ZodString, "many">;
    generatedAt: z.ZodString;
    modelWeights: z.ZodRecord<z.ZodString, z.ZodNumber>;
    processingTime: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    processingTime: number;
    confidence: number;
    overall: number;
    dimensions: {
        security: {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        };
        performance: {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        };
        codeQuality: {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        };
        innovation: {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        };
        maintainability: {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        };
        architecture: {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        };
        community: {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        };
    };
    recommendations: string[];
    consensus: number;
    variance: number;
    trend: "improving" | "stable" | "declining";
    historicalComparison: {
        previousScore: number;
        change: number;
        percentile: number;
    };
    explanations: string[];
    generatedAt: string;
    modelWeights: Record<string, number>;
}, {
    processingTime: number;
    confidence: number;
    overall: number;
    dimensions: {
        security: {
            score: number;
            breakdown: {
                codeScanning: number;
                vulnerabilityDetection: number;
                dependencyAudit: number;
                accessControl: number;
                encryption: number;
                compliance: number;
            };
            threats: string[];
            recommendations: string[];
        };
        performance: {
            score: number;
            breakdown: {
                latency: number;
                throughput: number;
                resourceEfficiency: number;
                scalability: number;
                concurrency: number;
                stability: number;
            };
            benchmarks: string[];
            optimizationOpportunities: string[];
        };
        codeQuality: {
            score: number;
            breakdown: {
                readability: number;
                maintainability: number;
                testCoverage: number;
                complexity: number;
                documentation: number;
                bestPractices: number;
            };
            codeSmells: string[];
            refactoringSuggestions: string[];
        };
        innovation: {
            score: number;
            breakdown: {
                novelty: number;
                impact: number;
                adoptionPotential: number;
                differentiation: number;
                futureProofing: number;
            };
            patentPotential: boolean;
            competitiveAdvantage: string[];
        };
        maintainability: {
            score: number;
            breakdown: {
                easeOfUpdates: number;
                dependencyManagement: number;
                backwardCompatibility: number;
                migrationPath: number;
                deprecationStrategy: number;
            };
            maintenanceCost: string;
            technicalDebt: Record<string, any>;
        };
        architecture: {
            score: number;
            breakdown: {
                scalability: number;
                modularity: number;
                resilience: number;
                evolvability: number;
                integration: number;
                patterns: number;
            };
            designPatterns: string[];
            architecturalDebt: string[];
        };
        community: {
            score: number;
            breakdown: {
                documentation: number;
                engagement: number;
                contributions: number;
                support: number;
                ecosystem: number;
            };
            communityMetrics: Record<string, any>;
            growthPotential: string;
        };
    };
    recommendations: string[];
    consensus: number;
    variance: number;
    trend: "improving" | "stable" | "declining";
    historicalComparison: {
        previousScore: number;
        change: number;
        percentile: number;
    };
    explanations: string[];
    generatedAt: string;
    modelWeights: Record<string, number>;
}>;
export type FusionScore = z.infer<typeof FusionScoreSchema>;
export interface GenerativeModel {
    id: string;
    config: ModelConfig;
    evaluate(artifact: any, context?: any): Promise<ModelEvaluation>;
    generateRecommendations(score: FusionScore): Promise<string[]>;
}
export interface ModelEvaluation {
    dimensions: Partial<ScoringDimensions>;
    confidence: number;
    rawResponse: any;
    processingTime: number;
    cost: number;
}
export declare class QuantumEnhancedFusionScorer {
    private models;
    private quantumProcessor;
    private bayesianFuser;
    private temporalAnalyzer;
    constructor(models: GenerativeModel[]);
    scoreArtifact(artifact: any, context?: any): Promise<FusionScore>;
    private computeQuantumWeights;
    private fuseDimensions;
    private fuseBreakdown;
    private aggregateArrays;
    private calculateOverallScore;
    private calculateConsensus;
    private generateExplanations;
    private generateRecommendations;
    private getHistoricalComparison;
    private determineTrend;
}
export declare function createQuantumEnhancedFusionScorer(models: GenerativeModel[]): QuantumEnhancedFusionScorer;
//# sourceMappingURL=enhanced-fusion-scoring-engine.d.ts.map