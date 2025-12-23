import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { z } from 'zod';
// Import all our advanced systems
import { ColorSystem, EmojiSystem } from './utils/colors/colors-emoji-system';
import { ThreeDVisualizer } from './ui/3d/three-d-engine';
import { NLPProcessor, ContextManager } from './ai/nlp/nlp-processor';
import { HierarchicalRegistryManager } from './sub-registries/hierarchical/hierarchical-registry';
import { PromptToolkit, AdvancedPrompt } from './integrations/prompt-toolkit/prompt-toolkit';
import { AnimationEngine } from './utils/animations/animation-engine';
import { RAGPipeline } from './ai/rag/rag-context-system';
import { ThemeManager, PersonalizationManager, ThemePersonalizationInterface } from './config/themes/themes-personalization';
// Main Application State Schema
const AppStateSchema = z.object({
    currentView: z.enum(['dashboard', 'registry', '3d-visualizer', 'ai-chat', 'settings', 'themes']),
    registry: z.any(), // HierarchicalRegistryManager
    nlp: z.any(), // NLPProcessor
    rag: z.any(), // RAGPipeline
    themeManager: z.any(), // ThemeManager
    personalizationManager: z.any(), // PersonalizationManager
    animationEngine: z.any(), // AnimationEngine
    emojiSystem: z.any(), // EmojiSystem
    promptToolkit: z.any() // PromptToolkit
});
// Main Hyper Registry Application
const HyperRegistryApp = () => {
    const { exit } = useApp();
    // Initialize all systems
    const [colorSystem] = useState(() => new ColorSystem());
    const [emojiSystem] = useState(() => new EmojiSystem());
    const [themeManager] = useState(() => new ThemeManager(colorSystem, emojiSystem));
    const [personalizationManager] = useState(() => new PersonalizationManager(themeManager));
    const [registry] = useState(() => new HierarchicalRegistryManager());
    const [nlpProcessor] = useState(() => new NLPProcessor());
    const [contextManager] = useState(() => new ContextManager());
    const [ragPipeline] = useState(() => new RAGPipeline());
    const [animationEngine] = useState(() => new AnimationEngine());
    const [promptToolkit] = useState(() => new PromptToolkit());
    const [currentView, setCurrentView] = useState('dashboard');
    const [systemStatus, setSystemStatus] = useState('initializing');
    const [lastActivity, setLastActivity] = useState(new Date());
    // Initialize systems on mount
    useEffect(() => {
        const initializeSystems = async () => {
            try {
                // Add some initial context to RAG
                ragPipeline.addContext('The Universal Hyper Registry is a state-of-the-art system for managing and discovering digital assets, APIs, and services with advanced AI capabilities.', { source: 'system', type: 'description' }, ['registry', 'ai', 'hyper']);
                ragPipeline.addContext('Features include 3D visualization, natural language processing, DAG-based dependency management, hierarchical registries, and advanced CLI interactions.', { source: 'system', type: 'features' }, ['features', '3d', 'nlp', 'dag', 'cli']);
                // Initialize with some sample registry entries
                registry.createRegistry('default', 'Default Registry', 'Main registry for general use');
                registry.addEntry('default', {
                    id: 'sample-api',
                    name: 'Sample API',
                    type: 'api',
                    description: 'A sample API for demonstration',
                    metadata: { version: '1.0.0', author: 'system' },
                    tags: ['sample', 'api', 'demo']
                });
                setSystemStatus('ready');
                setLastActivity(new Date());
            }
            catch (error) {
                console.error('Failed to initialize systems:', error);
                setSystemStatus('error');
            }
        };
        initializeSystems();
    }, []);
    // Global keyboard shortcuts
    useInput((input, key) => {
        if (key.ctrl && input === 'c') {
            exit();
            return;
        }
        // View switching shortcuts
        if (key.ctrl) {
            switch (input) {
                case 'd':
                    setCurrentView('dashboard');
                    break;
                case 'r':
                    setCurrentView('registry');
                    break;
                case '3':
                    setCurrentView('3d-visualizer');
                    break;
                case 'a':
                    setCurrentView('ai-chat');
                    break;
                case 's':
                    setCurrentView('settings');
                    break;
                case 't':
                    setCurrentView('themes');
                    break;
            }
        }
        setLastActivity(new Date());
    });
    // Render current view
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return _jsx(DashboardView, { registry: registry, ragPipeline: ragPipeline, animationEngine: animationEngine, emojiSystem: emojiSystem });
            case 'registry':
                return _jsx(RegistryView, { registry: registry, nlpProcessor: nlpProcessor, promptToolkit: promptToolkit });
            case '3d-visualizer':
                return _jsx(ThreeDVisualizerView, { registry: registry, animationEngine: animationEngine });
            case 'ai-chat':
                return _jsx(AIChatView, { ragPipeline: ragPipeline, nlpProcessor: nlpProcessor, contextManager: contextManager, emojiSystem: emojiSystem });
            case 'settings':
                return _jsx(SettingsView, { personalizationManager: personalizationManager, themeManager: themeManager });
            case 'themes':
                return _jsx(ThemePersonalizationInterface, { themeManager: themeManager, personalizationManager: personalizationManager, onThemeChange: () => setLastActivity(new Date()), onProfileChange: () => setLastActivity(new Date()) });
            default:
                return _jsx(DashboardView, { registry: registry, ragPipeline: ragPipeline, animationEngine: animationEngine, emojiSystem: emojiSystem });
        }
    };
    const currentTheme = themeManager.getCurrentTheme();
    const currentProfile = personalizationManager.getCurrentProfile();
    return (_jsxs(Box, { flexDirection: "column", height: "100%", children: [_jsx(Box, { borderStyle: "round", borderColor: "cyan", padding: 1, marginBottom: 1, children: _jsxs(Box, { flexDirection: "column", width: "100%", children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: true, color: "cyan", children: "\uD83C\uDF1F Universal Hyper Registry v2.0" }), _jsxs(Text, { dimColor: true, children: ["Status: ", systemStatus, " | Theme: ", currentTheme.name] })] }), _jsxs(Box, { justifyContent: "space-between", marginTop: 1, children: [_jsxs(Text, { dimColor: true, children: ["Profile: ", currentProfile?.name || 'None', " | Last Activity: ", lastActivity.toLocaleTimeString()] }), _jsx(Text, { dimColor: true, children: "Ctrl+D: Dashboard | Ctrl+R: Registry | Ctrl+3: 3D | Ctrl+A: AI | Ctrl+S: Settings | Ctrl+T: Themes" })] })] }) }), _jsx(Box, { flexGrow: 1, padding: 1, children: renderCurrentView() }), _jsx(Box, { borderStyle: "single", borderColor: "gray", padding: 1, marginTop: 1, children: _jsxs(Text, { dimColor: true, children: ["Press Ctrl+C to exit | Use Ctrl+key shortcuts to navigate | Current View: ", currentView] }) })] }));
};
const DashboardView = ({ registry, ragPipeline, animationEngine, emojiSystem }) => {
    const stats = registry.getStats();
    const ragStats = ragPipeline.getStats();
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, color: "green", children: "Dashboard Overview" }), _jsxs(Box, { marginY: 2, children: [_jsxs(Box, { flexDirection: "column", width: "50%", children: [_jsx(Text, { bold: true, color: "cyan", children: "Registry Statistics" }), _jsxs(Text, { children: ["Total Entries: ", stats.totalEntries] }), _jsxs(Text, { children: ["Active Registries: ", stats.totalRegistries] }), _jsxs(Text, { children: ["Categories: ", stats.totalCategories] }), _jsxs(Text, { children: ["Tags: ", stats.totalTags] })] }), _jsxs(Box, { flexDirection: "column", width: "50%", children: [_jsx(Text, { bold: true, color: "magenta", children: "AI Context" }), _jsxs(Text, { children: ["Knowledge Chunks: ", ragStats.totalChunks] }), _jsxs(Text, { children: ["Topics: ", ragStats.totalTags] }), _jsxs(Text, { children: ["Avg Chunk Length: ", ragStats.averageChunkLength, " chars"] })] })] }), _jsxs(Box, { marginY: 2, children: [_jsx(Text, { bold: true, children: "Quick Actions:" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "yellow", children: "\u2022 Press Ctrl+R to browse registry" }) }), _jsx(Box, { children: _jsx(Text, { color: "yellow", children: "\u2022 Press Ctrl+3 for 3D visualization" }) }), _jsx(Box, { children: _jsx(Text, { color: "yellow", children: "\u2022 Press Ctrl+A to chat with AI" }) }), _jsx(Box, { children: _jsx(Text, { color: "yellow", children: "\u2022 Press Ctrl+T to customize themes" }) })] }), _jsxs(Box, { marginTop: 2, children: [_jsx(Text, { bold: true, children: "Recent Activity:" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dimColor: true, children: "System initialized with advanced AI, 3D visualization, and hierarchical registry capabilities." }) })] })] }));
};
const RegistryView = ({ registry, nlpProcessor, promptToolkit }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRegistry, setSelectedRegistry] = useState('default');
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            // Use NLP to understand the query
            const intent = await nlpProcessor.classifyIntent(query);
            const entities = await nlpProcessor.extractEntities(query);
            // Search registry
            const results = registry.search(selectedRegistry, query);
            setSearchResults(results);
        }
        catch (error) {
            console.error('Search failed:', error);
        }
    };
    const registries = registry.listRegistries();
    const entries = registry.listEntries(selectedRegistry);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, color: "blue", children: "Registry Browser" }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Registry: " }), _jsx(Text, { color: "cyan", children: selectedRegistry }), _jsx(Box, { paddingLeft: 2, children: _jsxs(Text, { dimColor: true, children: ["(", registries.length, " available)"] }) })] }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Search: " }), _jsx(AdvancedPrompt, { promptToolkit: promptToolkit, placeholder: "Search registry entries...", onSubmit: handleSearch, completers: [], validators: [] })] }), _jsxs(Box, { marginY: 1, children: [_jsxs(Text, { bold: true, children: ["Entries (", entries.length, "):"] }), entries.slice(0, 10).map((entry, index) => (_jsxs(Box, { marginY: 1, children: [_jsxs(Text, { color: "green", children: [index + 1, ". ", entry.name] }), _jsx(Box, { paddingLeft: 4, children: _jsx(Text, { dimColor: true, children: entry.description }) }), _jsx(Box, { paddingLeft: 4, children: _jsxs(Text, { dimColor: true, children: ["Tags: ", entry.tags.join(', ')] }) })] }, entry.id)))] }), searchResults.length > 0 && (_jsxs(Box, { marginY: 1, children: [_jsx(Text, { bold: true, color: "yellow", children: "Search Results:" }), searchResults.map((result, index) => (_jsxs(Box, { marginY: 1, children: [_jsxs(Text, { color: "cyan", children: [index + 1, ". ", result.name] }), _jsx(Box, { paddingLeft: 4, children: _jsxs(Text, { dimColor: true, children: ["Score: ", (result.score * 100).toFixed(1), "%"] }) })] }, result.id)))] }))] }));
};
const ThreeDVisualizerView = ({ registry, animationEngine }) => {
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, color: "magenta", children: "3D Registry Visualizer" }), _jsx(Box, { marginY: 1, children: _jsx(Text, { dimColor: true, children: "Immersive 3D visualization of registry data and relationships" }) }), _jsx(ThreeDVisualizer, { registry: registry, animationEngine: animationEngine, width: 80, height: 20 }), _jsx(Box, { marginY: 1, children: _jsx(Text, { dimColor: true, children: "Use mouse to rotate | Scroll to zoom | Click nodes to explore" }) })] }));
};
const AIChatView = ({ ragPipeline, nlpProcessor, contextManager, emojiSystem }) => {
    const [messages, setMessages] = useState([]);
    const handleQuery = async (query) => {
        if (!query.trim())
            return;
        // Add user message
        const userMessage = {
            id: `msg_${Date.now()}`,
            text: query,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        try {
            // Process with NLP
            const intent = await nlpProcessor.classifyIntent(query);
            const entities = await nlpProcessor.extractEntities(query);
            // Query RAG system
            const result = await ragPipeline.query(query, intent.intent);
            // Add AI response
            const aiMessage = {
                id: `msg_${Date.now() + 1}`,
                text: result.response,
                sender: 'ai',
                timestamp: new Date(),
                confidence: result.confidence
            };
            setMessages(prev => [...prev, aiMessage]);
            // Update context
            contextManager.addToContext(query, 'user');
            contextManager.addToContext(result.response, 'ai');
        }
        catch (error) {
            console.error('AI query failed:', error);
            const errorMessage = {
                id: `msg_${Date.now() + 1}`,
                text: 'Sorry, I encountered an error processing your request.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };
    return (_jsxs(Box, { flexDirection: "column", height: "100%", children: [_jsx(Text, { bold: true, color: "green", children: "AI Assistant" }), _jsx(Box, { flexDirection: "column", flexGrow: 1, marginY: 1, children: messages.map(message => (_jsxs(Box, { marginY: 1, children: [_jsxs(Text, { color: message.sender === 'user' ? 'cyan' : 'magenta', bold: message.sender === 'ai', children: [message.sender === 'user' ? 'You: ' : 'AI: ', message.text] }), message.confidence && (_jsx(Box, { paddingLeft: 4, children: _jsxs(Text, { dimColor: true, children: ["Confidence: ", (message.confidence * 100).toFixed(1), "%"] }) }))] }, message.id))) }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Ask me anything: " }), _jsx(AdvancedPrompt, { promptToolkit: new PromptToolkit(), placeholder: "Type your question...", onSubmit: handleQuery, completers: [], validators: [] })] })] }));
};
const SettingsView = ({ personalizationManager, themeManager }) => {
    const currentProfile = personalizationManager.getCurrentProfile();
    const currentTheme = themeManager.getCurrentTheme();
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, color: "yellow", children: "System Settings" }), _jsxs(Box, { marginY: 2, children: [_jsx(Text, { bold: true, children: "Current Configuration:" }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Profile: " }), _jsx(Text, { color: "cyan", children: currentProfile?.name || 'None' })] }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Theme: " }), _jsx(Text, { color: "cyan", children: currentTheme.name })] }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Language: " }), _jsx(Text, { color: "cyan", children: currentProfile?.preferences.language || 'en' })] }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "AI Model: " }), _jsx(Text, { color: "cyan", children: currentProfile?.ai.model || 'gpt-4' })] })] }), _jsxs(Box, { marginY: 2, children: [_jsx(Text, { bold: true, children: "Quick Settings:" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", children: "\u2022 Press Ctrl+T for theme customization" }) }), _jsx(Box, { children: _jsx(Text, { color: "green", children: "\u2022 Press Ctrl+P for profile management" }) })] }), _jsxs(Box, { marginY: 2, children: [_jsx(Text, { bold: true, children: "System Information:" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dimColor: true, children: "\u2022 Universal Hyper Registry v2.0" }) }), _jsx(Box, { children: _jsx(Text, { dimColor: true, children: "\u2022 Advanced AI with RAG capabilities" }) }), _jsx(Box, { children: _jsx(Text, { dimColor: true, children: "\u2022 3D visualization and animations" }) }), _jsx(Box, { children: _jsx(Text, { dimColor: true, children: "\u2022 Hierarchical registry system" }) }), _jsx(Box, { children: _jsx(Text, { dimColor: true, children: "\u2022 Natural language processing" }) })] })] }));
};
// Main application entry point
const main = () => {
    render(_jsx(HyperRegistryApp, {}));
};
// Export for potential testing
export { HyperRegistryApp, main };
// Run if this is the main module
if (require.main === module) {
    main();
}
//# sourceMappingURL=hyper-registry.js.map