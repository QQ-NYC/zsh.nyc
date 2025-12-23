import { z } from 'zod';
// Hierarchical Registry Manager for Universal Hyper Registry
export const RegistryTypeSchema = z.enum([
    'domain', 'federated', 'personal', 'system', 'custom'
]);
export const RegistryEntrySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    data: z.record(z.any()),
    tags: z.array(z.string()),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    version: z.number().default(1)
});
export const RegistryNodeSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: RegistryTypeSchema,
    description: z.string(),
    parentId: z.string().nullable(),
    children: z.array(z.string()),
    entries: z.array(RegistryEntrySchema),
    metadata: z.record(z.any()).optional(),
    permissions: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export class RegistryNodeManager {
    constructor(node) {
        this.childManagers = new Map();
        this.node = node;
    }
    getNode() {
        return this.node;
    }
    addEntry(entry) {
        if (this.node.entries.find(e => e.id === entry.id)) {
            return false; // Entry already exists
        }
        this.node.entries.push(entry);
        this.node.updatedAt = new Date();
        return true;
    }
    removeEntry(entryId) {
        const index = this.node.entries.findIndex(e => e.id === entryId);
        if (index === -1) {
            return false;
        }
        this.node.entries.splice(index, 1);
        this.node.updatedAt = new Date();
        return true;
    }
    updateEntry(entryId, updates) {
        const entry = this.node.entries.find(e => e.id === entryId);
        if (!entry) {
            return false;
        }
        Object.assign(entry, updates, { updatedAt: new Date(), version: entry.version + 1 });
        this.node.updatedAt = new Date();
        return true;
    }
    getEntry(entryId) {
        return this.node.entries.find(e => e.id === entryId);
    }
    getAllEntries() {
        return [...this.node.entries];
    }
    searchEntries(query) {
        const lowerQuery = query.toLowerCase();
        return this.node.entries.filter(entry => entry.name.toLowerCase().includes(lowerQuery) ||
            entry.description.toLowerCase().includes(lowerQuery) ||
            entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            entry.type.toLowerCase().includes(lowerQuery));
    }
    addChild(childManager) {
        const childId = childManager.getNode().id;
        if (this.childManagers.has(childId) || this.node.children.includes(childId)) {
            return false;
        }
        this.childManagers.set(childId, childManager);
        this.node.children.push(childId);
        this.node.updatedAt = new Date();
        return true;
    }
    removeChild(childId) {
        if (!this.childManagers.has(childId)) {
            return false;
        }
        this.childManagers.delete(childId);
        const index = this.node.children.indexOf(childId);
        if (index > -1) {
            this.node.children.splice(index, 1);
        }
        this.node.updatedAt = new Date();
        return true;
    }
    getChild(childId) {
        return this.childManagers.get(childId);
    }
    getAllChildren() {
        return Array.from(this.childManagers.values());
    }
    getChildIds() {
        return [...this.node.children];
    }
    // Recursive search through hierarchy
    searchHierarchy(query) {
        let results = this.searchEntries(query);
        // Search in children recursively
        for (const childManager of this.childManagers.values()) {
            results = results.concat(childManager.searchHierarchy(query));
        }
        return results;
    }
    // Get statistics
    getStats() {
        const entryTypes = {};
        this.node.entries.forEach(entry => {
            entryTypes[entry.type] = (entryTypes[entry.type] || 0) + 1;
        });
        return {
            totalEntries: this.node.entries.length,
            totalChildren: this.node.children.length,
            entryTypes,
            lastUpdated: this.node.updatedAt
        };
    }
}
export class HierarchicalRegistryManager {
    constructor() {
        this.rootManagers = new Map();
        this.nodeIndex = new Map();
    }
    createRegistry(id, name, type, description, parentId = null) {
        if (this.nodeIndex.has(id)) {
            return null; // Registry already exists
        }
        const node = {
            id,
            name,
            type,
            description,
            parentId,
            children: [],
            entries: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const manager = new RegistryNodeManager(node);
        this.nodeIndex.set(id, manager);
        if (parentId === null) {
            // Root registry
            this.rootManagers.set(id, manager);
        }
        else {
            // Child registry - add to parent
            const parentManager = this.nodeIndex.get(parentId);
            if (parentManager) {
                parentManager.addChild(manager);
            }
            else {
                // Parent doesn't exist, treat as root
                this.rootManagers.set(id, manager);
            }
        }
        return manager;
    }
    getRegistry(registryId) {
        return this.nodeIndex.get(registryId);
    }
    removeRegistry(registryId) {
        const manager = this.nodeIndex.get(registryId);
        if (!manager) {
            return false;
        }
        const node = manager.getNode();
        // Remove from parent
        if (node.parentId) {
            const parentManager = this.nodeIndex.get(node.parentId);
            if (parentManager) {
                parentManager.removeChild(registryId);
            }
        }
        else {
            // Remove from roots
            this.rootManagers.delete(registryId);
        }
        // Remove all children recursively
        const children = [...node.children];
        children.forEach(childId => this.removeRegistry(childId));
        // Remove from index
        this.nodeIndex.delete(registryId);
        return true;
    }
    getRootRegistries() {
        return Array.from(this.rootManagers.values());
    }
    getAllRegistries() {
        return Array.from(this.nodeIndex.values());
    }
    searchAllRegistries(query) {
        const results = [];
        for (const rootManager of this.rootManagers.values()) {
            results.push(...rootManager.searchHierarchy(query));
        }
        return results;
    }
    // Find registry by path (e.g., "root/child/grandchild")
    findRegistryByPath(path) {
        const parts = path.split('/').filter(p => p.length > 0);
        if (parts.length === 0)
            return null;
        let currentManager;
        for (const part of parts) {
            if (!currentManager) {
                // First part - should be a root
                currentManager = Array.from(this.rootManagers.values())
                    .find(manager => manager.getNode().name === part);
            }
            else {
                // Subsequent parts - should be children
                currentManager = currentManager.getAllChildren()
                    .find(manager => manager.getNode().name === part);
            }
            if (!currentManager)
                break;
        }
        return currentManager || null;
    }
    // Move registry to new parent
    moveRegistry(registryId, newParentId) {
        const manager = this.nodeIndex.get(registryId);
        if (!manager)
            return false;
        const node = manager.getNode();
        const oldParentId = node.parentId;
        // Remove from old parent
        if (oldParentId) {
            const oldParent = this.nodeIndex.get(oldParentId);
            if (oldParent) {
                oldParent.removeChild(registryId);
            }
        }
        else {
            this.rootManagers.delete(registryId);
        }
        // Add to new parent
        if (newParentId) {
            const newParent = this.nodeIndex.get(newParentId);
            if (!newParent)
                return false;
            newParent.addChild(manager);
        }
        else {
            this.rootManagers.set(registryId, manager);
        }
        // Update node
        node.parentId = newParentId;
        node.updatedAt = new Date();
        return true;
    }
    // Get registry hierarchy as tree
    getHierarchyTree() {
        const buildTree = (manager) => {
            const node = manager.getNode();
            const stats = manager.getStats();
            return {
                id: node.id,
                name: node.name,
                type: node.type,
                description: node.description,
                stats,
                children: manager.getAllChildren().map(buildTree)
            };
        };
        return this.getRootRegistries().map(buildTree);
    }
    // Export registry structure
    exportStructure() {
        return {
            roots: Array.from(this.rootManagers.keys()),
            registries: Array.from(this.nodeIndex.entries()).map(([id, manager]) => ({
                id,
                node: manager.getNode(),
                stats: manager.getStats()
            })),
            exportedAt: new Date()
        };
    }
    // Import registry structure
    importStructure(data) {
        try {
            // Clear existing data
            this.rootManagers.clear();
            this.nodeIndex.clear();
            // Import registries
            data.registries.forEach((item) => {
                const manager = new RegistryNodeManager(item.node);
                this.nodeIndex.set(item.id, manager);
                if (data.roots.includes(item.id)) {
                    this.rootManagers.set(item.id, manager);
                }
            });
            // Rebuild parent-child relationships
            for (const [id, manager] of this.nodeIndex.entries()) {
                const node = manager.getNode();
                if (node.parentId) {
                    const parentManager = this.nodeIndex.get(node.parentId);
                    if (parentManager) {
                        parentManager.addChild(manager);
                    }
                }
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    // Get global statistics
    getGlobalStats() {
        let totalEntries = 0;
        const registryTypes = {};
        const entryTypes = {};
        for (const manager of this.nodeIndex.values()) {
            const node = manager.getNode();
            const stats = manager.getStats();
            registryTypes[node.type] = (registryTypes[node.type] || 0) + 1;
            totalEntries += stats.totalEntries;
            Object.entries(stats.entryTypes).forEach(([type, count]) => {
                entryTypes[type] = (entryTypes[type] || 0) + count;
            });
        }
        return {
            totalRegistries: this.nodeIndex.size,
            totalEntries,
            registryTypes,
            entryTypes
        };
    }
}
//# sourceMappingURL=hierarchical-registry.js.map