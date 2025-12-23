import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { z } from 'zod';

// Import all our advanced systems
import { ColorSystem, EmojiSystem, EmojiRenderer, EmojiSuggester } from './utils/colors/colors-emoji-system';
import { ThreeDVisualizer } from './ui/3d/three-d-engine';
import { NLPProcessor, ContextManager } from './ai/nlp/nlp-processor';
import { DirectedAcyclicGraph, RetrievalAugmentedGenerator } from './ai/dag/dag-engine';
import { HierarchicalRegistryManager } from './sub-registries/hierarchical/hierarchical-registry';
import { PromptToolkit, AdvancedPrompt } from './integrations/prompt-toolkit/prompt-toolkit';
import { AnimationEngine, ParticleSystem } from './utils/animations/animation-engine';
import { RAGPipeline, RAGInterface } from './ai/rag/rag-context-system';
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

type AppState = z.infer<typeof AppStateSchema>;

// Main Hyper Registry Application
const HyperRegistryApp: React.FC = () => {
  const { exit } = useApp();

  // Initialize all systems
  const [colorSystem] = useState(() => new ColorSystem());
  const [emojiSystem] = useState(() => new EmojiSystem());
  const [themeManager] = useState(() => new ThemeManager(colorSystem));
  const [personalizationManager] = useState(() => new PersonalizationManager(themeManager, emojiSystem));
  const [registry] = useState(() => new HierarchicalRegistryManager());
  const [nlpProcessor] = useState(() => new NLPProcessor());
  const [contextManager] = useState(() => new ContextManager());
  const [ragPipeline] = useState(() => new RAGPipeline());
  const [animationEngine] = useState(() => new AnimationEngine());
  const [promptToolkit] = useState(() => new PromptToolkit());

  const [currentView, setCurrentView] = useState<AppState['currentView']>('dashboard');
  const [systemStatus, setSystemStatus] = useState('initializing');
  const [lastActivity, setLastActivity] = useState(new Date());

  // Initialize systems on mount
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        // Add some initial context to RAG
        ragPipeline.addContext(
          'The Universal Hyper Registry is a state-of-the-art system for managing and discovering digital assets, APIs, and services with advanced AI capabilities.',
          { source: 'system', type: 'description' },
          ['registry', 'ai', 'hyper']
        );

        ragPipeline.addContext(
          'Features include 3D visualization, natural language processing, DAG-based dependency management, hierarchical registries, and advanced CLI interactions.',
          { source: 'system', type: 'features' },
          ['features', '3d', 'nlp', 'dag', 'cli']
        );

        // Initialize with some sample registry entries
        registry.createRegistry('default', 'Default Registry', 'domain', 'Main registry for general use');
        registry.getRegistry('default')?.addEntry({
          id: 'sample-api',
          name: 'Sample API',
          type: 'api',
          description: 'A sample API for demonstration',
          metadata: { version: '1.0.0', author: 'system' },
          tags: ['sample', 'api', 'demo']
        });

        setSystemStatus('ready');
        setLastActivity(new Date());
      } catch (error) {
        console.error('Failed to initialize systems:', error);
        setSystemStatus('error');
      }
    };

    initializeSystems();
  }, []);

  // Global keyboard shortcuts
  useInput((input: string, key: any) => {
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
        return <DashboardView
          registry={registry}
          ragPipeline={ragPipeline}
          animationEngine={animationEngine}
          emojiSystem={emojiSystem}
        />;

      case 'registry':
        return <RegistryView
          registry={registry}
          nlpProcessor={nlpProcessor}
          promptToolkit={promptToolkit}
        />;

      case '3d-visualizer':
        return <ThreeDVisualizerView
          registry={registry}
          animationEngine={animationEngine}
        />;

      case 'ai-chat':
        return <AIChatView
          ragPipeline={ragPipeline}
          nlpProcessor={nlpProcessor}
          contextManager={contextManager}
          emojiSystem={emojiSystem}
        />;

      case 'settings':
        return <SettingsView
          personalizationManager={personalizationManager}
          themeManager={themeManager}
        />;

      case 'themes':
        return <ThemePersonalizationInterface
          themeManager={themeManager}
          personalizationManager={personalizationManager}
          onThemeChange={() => setLastActivity(new Date())}
          onProfileChange={() => setLastActivity(new Date())}
        />;

      default:
        return <DashboardView
          registry={registry}
          ragPipeline={ragPipeline}
          animationEngine={animationEngine}
          emojiSystem={emojiSystem}
        />;
    }
  };

  const currentProfile = personalizationManager.getCurrentProfile();
  const currentTheme = currentProfile?.theme || 'default';

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        padding={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box justifyContent="space-between">
            <Text bold color="cyan">
              🌟 Universal Hyper Registry v2.0
            </Text>
            <Text dimColor>
              Status: {systemStatus} | Theme: {currentTheme.name}
            </Text>
          </Box>

          <Box justifyContent="space-between" marginTop={1}>
            <Text dimColor>
              Profile: {currentProfile?.name || 'None'} | Last Activity: {lastActivity.toLocaleTimeString()}
            </Text>
            <Text dimColor>
              Ctrl+D: Dashboard | Ctrl+R: Registry | Ctrl+3: 3D | Ctrl+A: AI | Ctrl+S: Settings | Ctrl+T: Themes
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} padding={1}>
        {renderCurrentView()}
      </Box>

      {/* Footer */}
      <Box
        borderStyle="single"
        borderColor="gray"
        padding={1}
        marginTop={1}
      >
        <Text dimColor>
          Press Ctrl+C to exit | Use Ctrl+key shortcuts to navigate | Current View: {currentView}
        </Text>
      </Box>
    </Box>
  );
};

// Dashboard View
interface DashboardViewProps {
  registry: HierarchicalRegistryManager;
  ragPipeline: RAGPipeline;
  animationEngine: AnimationEngine;
  emojiSystem: EmojiSystem;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  registry,
  ragPipeline,
  animationEngine,
  emojiSystem
}) => {
  const stats = registry.getGlobalStats();
  const ragStats = ragPipeline.getStats();

  return (
    <Box flexDirection="column">
      <Text bold color="green">Dashboard Overview</Text>

      <Box marginY={2}>
        <Box flexDirection="column" width="50%">
          <Text bold color="cyan">Registry Statistics</Text>
          <Text>Total Entries: {stats.totalEntries}</Text>
          <Text>Active Registries: {stats.totalRegistries}</Text>
          <Text>Categories: {stats.totalCategories}</Text>
          <Text>Tags: {stats.totalTags}</Text>
        </Box>

        <Box flexDirection="column" width="50%">
          <Text bold color="magenta">AI Context</Text>
          <Text>Knowledge Chunks: {ragStats.totalChunks}</Text>
          <Text>Topics: {ragStats.totalTags}</Text>
          <Text>Avg Chunk Length: {ragStats.averageChunkLength} chars</Text>
        </Box>
      </Box>

      <Box marginY={2}>
        <Text bold>Quick Actions:</Text>
        <Box marginTop={1}>
          <Text color="yellow">• Press Ctrl+R to browse registry</Text>
        </Box>
        <Box>
          <Text color="yellow">• Press Ctrl+3 for 3D visualization</Text>
        </Box>
        <Box>
          <Text color="yellow">• Press Ctrl+A to chat with AI</Text>
        </Box>
        <Box>
          <Text color="yellow">• Press Ctrl+T to customize themes</Text>
        </Box>
      </Box>

      <Box marginTop={2}>
        <Text bold>Recent Activity:</Text>
        <Box marginTop={1}>
          <Text dimColor>
            System initialized with advanced AI, 3D visualization, and hierarchical registry capabilities.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

// Registry View
interface RegistryViewProps {
  registry: HierarchicalRegistryManager;
  nlpProcessor: NLPProcessor;
  promptToolkit: PromptToolkit;
}

const RegistryView: React.FC<RegistryViewProps> = ({
  registry,
  nlpProcessor,
  promptToolkit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState('default');

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Use NLP to understand the query
      const analysis = await nlpProcessor.analyze(query);
      const intent = analysis.intent;
      const entities = analysis.entities;

      // Search registry
      const results = registry.getRegistry(selectedRegistry)?.searchEntries(query) || [];
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const registries = registry.getAllRegistries();
  const entries = registry.getRegistry(selectedRegistry)?.getAllEntries() || [];

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Registry Browser</Text>

      <Box marginY={1}>
        <Text>Registry: </Text>
        <Text color="cyan">{selectedRegistry}</Text>
        <Box paddingLeft={2}>
          <Text dimColor>
            ({registries.length} available)
          </Text>
        </Box>
      </Box>

      <Box marginY={1}>
        <Text>Search: </Text>
        <AdvancedPrompt
          promptToolkit={promptToolkit}
          placeholder="Search registry entries..."
          onSubmit={handleSearch}
          completers={[]}
          validators={[]}
        />
      </Box>

      <Box marginY={1}>
        <Text bold>Entries ({entries.length}):</Text>
        {entries.slice(0, 10).map((entry: any, index: number) => (
          <Box key={entry.id} marginY={1}>
            <Text color="green">{index + 1}. {entry.name}</Text>
            <Box paddingLeft={4}>
              <Text dimColor>{entry.description}</Text>
            </Box>
            <Box paddingLeft={4}>
              <Text dimColor>Tags: {entry.tags.join(', ')}</Text>
            </Box>
          </Box>
        ))}
      </Box>

      {searchResults.length > 0 && (
        <Box marginY={1}>
          <Text bold color="yellow">Search Results:</Text>
          {searchResults.map((result, index) => (
            <Box key={result.id} marginY={1}>
              <Text color="cyan">{index + 1}. {result.name}</Text>
              <Box paddingLeft={4}>
                <Text dimColor>Score: {(result.score * 100).toFixed(1)}%</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// 3D Visualizer View
interface ThreeDVisualizerViewProps {
  registry: HierarchicalRegistryManager;
  animationEngine: AnimationEngine;
}

const ThreeDVisualizerView: React.FC<ThreeDVisualizerViewProps> = ({
  registry,
  animationEngine
}) => {
  return (
    <Box flexDirection="column">
      <Text bold color="magenta">3D Registry Visualizer</Text>
      <Box marginY={1}>
        <Text dimColor>
          Immersive 3D visualization of registry data and relationships
        </Text>
      </Box>

      <ThreeDVisualizer
        registry={registry}
        animationEngine={animationEngine}
        width={80}
        height={20}
      />

      <Box marginY={1}>
        <Text dimColor>
          Use mouse to rotate | Scroll to zoom | Click nodes to explore
        </Text>
      </Box>
    </Box>
  );
};

// AI Chat View
interface AIChatViewProps {
  ragPipeline: RAGPipeline;
  nlpProcessor: NLPProcessor;
  contextManager: ContextManager;
  emojiSystem: EmojiSystem;
}

const AIChatView: React.FC<AIChatViewProps> = ({
  ragPipeline,
  nlpProcessor,
  contextManager,
  emojiSystem
}) => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    confidence?: number;
  }>>([]);

  const handleQuery = async (query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}`,
      text: query,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Process with NLP
      const analysis = await nlpProcessor.analyze(query);
      const intent = analysis.intent;
      const entities = analysis.entities;

      // Query RAG system
      const result = await ragPipeline.query(query, intent);

      // Add AI response
      const aiMessage = {
        id: `msg_${Date.now() + 1}`,
        text: result,
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI query failed:', error);

      const errorMessage = {
        id: `msg_${Date.now() + 1}`,
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'ai' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      <Text bold color="green">AI Assistant</Text>

      {/* Messages */}
      <Box flexDirection="column" flexGrow={1} marginY={1}>
        {messages.map(message => (
          <Box key={message.id} marginY={1}>
            <Text
              color={message.sender === 'user' ? 'cyan' : 'magenta'}
              bold={message.sender === 'ai'}
            >
              {message.sender === 'user' ? 'You: ' : 'AI: '}
              {message.text}
            </Text>
            {message.confidence && (
              <Box paddingLeft={4}>
                <Text dimColor>
                  Confidence: {(message.confidence * 100).toFixed(1)}%
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box marginY={1}>
        <Text>Ask me anything: </Text>
        <AdvancedPrompt
          promptToolkit={new PromptToolkit()}
          placeholder="Type your question..."
          onSubmit={handleQuery}
          completers={[]}
          validators={[]}
        />
      </Box>
    </Box>
  );
};

// Settings View
interface SettingsViewProps {
  personalizationManager: PersonalizationManager;
  themeManager: ThemeManager;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  personalizationManager,
  themeManager
}) => {
  const currentProfile = personalizationManager.getCurrentProfile();
  const currentTheme = themeManager.getCurrentTheme();

  return (
    <Box flexDirection="column">
      <Text bold color="yellow">System Settings</Text>

      <Box marginY={2}>
        <Text bold>Current Configuration:</Text>

        <Box marginY={1}>
          <Text>Profile: </Text>
          <Text color="cyan">{currentProfile?.name || 'None'}</Text>
        </Box>

        <Box marginY={1}>
          <Text>Theme: </Text>
          <Text color="cyan">{currentTheme.name}</Text>
        </Box>

        <Box marginY={1}>
          <Text>Language: </Text>
          <Text color="cyan">{currentProfile?.preferences.language || 'en'}</Text>
        </Box>

        <Box marginY={1}>
          <Text>AI Model: </Text>
          <Text color="cyan">{currentProfile?.ai.model || 'gpt-4'}</Text>
        </Box>
      </Box>

      <Box marginY={2}>
        <Text bold>Quick Settings:</Text>
        <Box marginTop={1}>
          <Text color="green">• Press Ctrl+T for theme customization</Text>
        </Box>
        <Box>
          <Text color="green">• Press Ctrl+P for profile management</Text>
        </Box>
      </Box>

      <Box marginY={2}>
        <Text bold>System Information:</Text>
        <Box marginTop={1}>
          <Text dimColor>• Universal Hyper Registry v2.0</Text>
        </Box>
        <Box>
          <Text dimColor>• Advanced AI with RAG capabilities</Text>
        </Box>
        <Box>
          <Text dimColor>• 3D visualization and animations</Text>
        </Box>
        <Box>
          <Text dimColor>• Hierarchical registry system</Text>
        </Box>
        <Box>
          <Text dimColor>• Natural language processing</Text>
        </Box>
      </Box>
    </Box>
  );
};

// Main application entry point
const main = () => {
  render(<HyperRegistryApp />);
};

// Export for potential testing
export { HyperRegistryApp, main };

// Run if this is the main module
if (require.main === module) {
  main();
}