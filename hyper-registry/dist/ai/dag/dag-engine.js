import { z } from 'zod';
// DAG (Directed Acyclic Graph) Engine for Universal Hyper Registry
export const NodeSchema = z.object({
    id: z.string(),
    type: z.enum(['registry', 'entry', 'relationship', 'metadata', 'system']),
    data: z.record(z.any()),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const EdgeSchema = z.object({
    id: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
    type: z.enum(['depends_on', 'references', 'contains', 'belongs_to', 'related_to', 'extends']),
    weight: z.number().default(1),
    data: z.record(z.any()).optional(),
    createdAt: z.date()
});
export const DAGSchema = z.object({
    id: z.string(),
    name: z.string(),
    nodes: z.array(NodeSchema),
    edges: z.array(EdgeSchema),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export class DirectedAcyclicGraph {
    constructor(id = 'default', name = 'Default DAG') {
        this.nodes = new Map();
        this.edges = new Map();
        this.adjacencyList = new Map();
        this.reverseAdjacencyList = new Map();
        this.id = id;
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    addNode(node) {
        if (this.nodes.has(node.id)) {
            return false; // Node already exists
        }
        this.nodes.set(node.id, node);
        this.adjacencyList.set(node.id, new Set());
        this.reverseAdjacencyList.set(node.id, new Set());
        this.updatedAt = new Date();
        return true;
    }
    removeNode(nodeId) {
        if (!this.nodes.has(nodeId)) {
            return false;
        }
        // Remove all edges connected to this node
        const outgoingEdges = Array.from(this.edges.values()).filter(edge => edge.sourceId === nodeId);
        const incomingEdges = Array.from(this.edges.values()).filter(edge => edge.targetId === nodeId);
        outgoingEdges.forEach(edge => this.removeEdge(edge.id));
        incomingEdges.forEach(edge => this.removeEdge(edge.id));
        this.nodes.delete(nodeId);
        this.adjacencyList.delete(nodeId);
        this.reverseAdjacencyList.delete(nodeId);
        this.updatedAt = new Date();
        return true;
    }
    addEdge(edge) {
        if (!this.nodes.has(edge.sourceId) || !this.nodes.has(edge.targetId)) {
            return false; // Source or target node doesn't exist
        }
        if (this.edges.has(edge.id)) {
            return false; // Edge already exists
        }
        // Check for cycles
        if (this.wouldCreateCycle(edge.sourceId, edge.targetId)) {
            return false; // Would create a cycle
        }
        this.edges.set(edge.id, edge);
        this.adjacencyList.get(edge.sourceId).add(edge.targetId);
        this.reverseAdjacencyList.get(edge.targetId).add(edge.sourceId);
        this.updatedAt = new Date();
        return true;
    }
    removeEdge(edgeId) {
        const edge = this.edges.get(edgeId);
        if (!edge) {
            return false;
        }
        this.edges.delete(edgeId);
        this.adjacencyList.get(edge.sourceId).delete(edge.targetId);
        this.reverseAdjacencyList.get(edge.targetId).delete(edge.sourceId);
        this.updatedAt = new Date();
        return true;
    }
    wouldCreateCycle(sourceId, targetId) {
        // Use DFS to check if adding this edge would create a cycle
        const visited = new Set();
        const recursionStack = new Set();
        const hasCycle = (nodeId) => {
            visited.add(nodeId);
            recursionStack.add(nodeId);
            const neighbors = this.adjacencyList.get(nodeId) || new Set();
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && hasCycle(neighbor)) {
                    return true;
                }
                else if (recursionStack.has(neighbor)) {
                    return true;
                }
            }
            recursionStack.delete(nodeId);
            return false;
        };
        // Temporarily add the edge for cycle detection
        this.adjacencyList.get(sourceId).add(targetId);
        const cycleExists = hasCycle(targetId);
        // Remove the temporary edge
        this.adjacencyList.get(sourceId).delete(targetId);
        return cycleExists;
    }
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }
    getEdge(edgeId) {
        return this.edges.get(edgeId);
    }
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    getAllEdges() {
        return Array.from(this.edges.values());
    }
    getNeighbors(nodeId) {
        return Array.from(this.adjacencyList.get(nodeId) || new Set());
    }
    getParents(nodeId) {
        return Array.from(this.reverseAdjacencyList.get(nodeId) || new Set());
    }
    getChildren(nodeId) {
        return this.getNeighbors(nodeId);
    }
    topologicalSort() {
        const visited = new Set();
        const tempVisited = new Set();
        const result = [];
        const visit = (nodeId) => {
            if (tempVisited.has(nodeId)) {
                return false; // Cycle detected
            }
            if (visited.has(nodeId)) {
                return true;
            }
            tempVisited.add(nodeId);
            const neighbors = this.adjacencyList.get(nodeId) || new Set();
            for (const neighbor of neighbors) {
                if (!visit(neighbor)) {
                    return false;
                }
            }
            tempVisited.delete(nodeId);
            visited.add(nodeId);
            result.unshift(nodeId); // Add to front for correct order
            return true;
        };
        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                if (!visit(nodeId)) {
                    throw new Error('Graph contains a cycle');
                }
            }
        }
        return result;
    }
    getShortestPath(startId, endId) {
        if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
            return null;
        }
        const distances = new Map();
        const previous = new Map();
        const queue = [];
        // Initialize distances
        for (const nodeId of this.nodes.keys()) {
            distances.set(nodeId, nodeId === startId ? 0 : Infinity);
        }
        queue.push(startId);
        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentDistance = distances.get(currentId);
            if (currentId === endId) {
                // Reconstruct path
                const path = [];
                let current = endId;
                while (current !== startId) {
                    path.unshift(current);
                    current = previous.get(current);
                }
                path.unshift(startId);
                return path;
            }
            const neighbors = this.adjacencyList.get(currentId) || new Set();
            for (const neighbor of neighbors) {
                const edge = Array.from(this.edges.values()).find(e => e.sourceId === currentId && e.targetId === neighbor);
                const weight = edge?.weight || 1;
                const newDistance = currentDistance + weight;
                if (newDistance < distances.get(neighbor)) {
                    distances.set(neighbor, newDistance);
                    previous.set(neighbor, currentId);
                    // Simple priority queue insertion (not optimal)
                    const insertIndex = queue.findIndex(id => distances.get(id) > newDistance);
                    if (insertIndex === -1) {
                        queue.push(neighbor);
                    }
                    else {
                        queue.splice(insertIndex, 0, neighbor);
                    }
                }
            }
        }
        return null; // No path found
    }
    getConnectedComponents() {
        const visited = new Set();
        const components = [];
        const dfs = (nodeId, component) => {
            visited.add(nodeId);
            component.push(nodeId);
            const neighbors = this.adjacencyList.get(nodeId) || new Set();
            const parents = this.reverseAdjacencyList.get(nodeId) || new Set();
            // Visit all connected nodes (both directions for undirected-like traversal)
            [...neighbors, ...parents].forEach(connectedId => {
                if (!visited.has(connectedId)) {
                    dfs(connectedId, component);
                }
            });
        };
        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                const component = [];
                dfs(nodeId, component);
                components.push(component);
            }
        }
        return components;
    }
    validate() {
        const errors = [];
        // Check for cycles
        try {
            this.topologicalSort();
        }
        catch (error) {
            errors.push('Graph contains cycles');
        }
        // Check for orphaned edges
        for (const edge of this.edges.values()) {
            if (!this.nodes.has(edge.sourceId)) {
                errors.push(`Edge ${edge.id} references non-existent source node ${edge.sourceId}`);
            }
            if (!this.nodes.has(edge.targetId)) {
                errors.push(`Edge ${edge.id} references non-existent target node ${edge.targetId}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            nodes: this.getAllNodes(),
            edges: this.getAllEdges(),
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    static fromJSON(data) {
        const dag = new DirectedAcyclicGraph(data.id, data.name);
        dag.metadata = data.metadata;
        dag.createdAt = data.createdAt;
        dag.updatedAt = data.updatedAt;
        // Add nodes
        data.nodes.forEach(node => dag.addNode(node));
        // Add edges
        data.edges.forEach(edge => dag.addEdge(edge));
        return dag;
    }
}
// RAG (Retrieval-Augmented Generation) Integration
export class RetrievalAugmentedGenerator {
    constructor(dag) {
        this.dag = dag;
    }
    async retrieve(query, limit = 5) {
        // Simple keyword-based retrieval (would use embeddings in real implementation)
        const queryLower = query.toLowerCase();
        const allNodes = this.dag.getAllNodes();
        const scoredNodes = allNodes.map(node => {
            let score = 0;
            const nodeData = JSON.stringify(node.data).toLowerCase();
            const metadata = JSON.stringify(node.metadata || {}).toLowerCase();
            // Simple scoring based on keyword matches
            const queryWords = queryLower.split(/\s+/);
            queryWords.forEach(word => {
                if (nodeData.includes(word))
                    score += 1;
                if (metadata.includes(word))
                    score += 0.5;
            });
            return { node, score };
        });
        // Sort by score and return top results
        scoredNodes.sort((a, b) => b.score - a.score);
        return scoredNodes.slice(0, limit).map(item => item.node);
    }
    async generateResponse(query, context) {
        // Simple response generation (would use LLM in real implementation)
        const relevantInfo = context.map(node => `${node.type}: ${JSON.stringify(node.data)}`).join('\n');
        return `Based on the registry data, here's information related to "${query}":\n\n${relevantInfo}`;
    }
    async query(query) {
        const relevantNodes = await this.retrieve(query);
        return this.generateResponse(query, relevantNodes);
    }
}
//# sourceMappingURL=dag-engine.js.map