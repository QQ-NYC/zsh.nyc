import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Text } from 'ink';
import { z } from 'zod';
// Advanced Prompt Toolkit for Universal Hyper Registry
export const KeyBindingSchema = z.object({
    key: z.string(),
    action: z.string(),
    description: z.string(),
    context: z.string().optional()
});
export const CompletionItemSchema = z.object({
    text: z.string(),
    displayText: z.string(),
    description: z.string().optional(),
    type: z.enum(['command', 'option', 'value', 'path', 'variable']),
    score: z.number().default(0)
});
export const ValidationResultSchema = z.object({
    isValid: z.boolean(),
    errors: z.array(z.string()),
    warnings: z.array(z.string()),
    suggestions: z.array(z.string())
});
export class HistoryManager {
    constructor() {
        this.history = [];
        this.maxSize = 1000;
        this.currentIndex = -1;
    }
    addEntry(entry) {
        if (entry.trim() && (this.history.length === 0 || this.history[this.history.length - 1] !== entry)) {
            this.history.push(entry);
            if (this.history.length > this.maxSize) {
                this.history.shift();
            }
        }
        this.currentIndex = this.history.length;
    }
    getPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null;
    }
    getNext() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null;
    }
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.history.filter(entry => entry.toLowerCase().includes(lowerQuery)).reverse(); // Most recent first
    }
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }
    getAll() {
        return [...this.history];
    }
    getSize() {
        return this.history.length;
    }
}
export class AutoCompleter {
    constructor() {
        this.completionItems = [];
        this.contextProviders = new Map();
    }
    addCompletionItem(item) {
        this.completionItems.push(item);
    }
    addCompletionItems(items) {
        this.completionItems.push(...items);
    }
    registerContextProvider(context, provider) {
        this.contextProviders.set(context, provider);
    }
    getCompletions(input, context) {
        let candidates = [...this.completionItems];
        // Add context-specific completions
        if (context) {
            const provider = this.contextProviders.get(context);
            if (provider) {
                candidates.push(...provider(input));
            }
        }
        // Filter and score completions
        const inputLower = input.toLowerCase();
        const scored = candidates
            .filter(item => item.text.toLowerCase().startsWith(inputLower))
            .map(item => ({
            ...item,
            score: this.calculateScore(item, input)
        }))
            .sort((a, b) => b.score - a.score);
        return scored.slice(0, 10); // Return top 10
    }
    calculateScore(item, input) {
        const inputLower = input.toLowerCase();
        const textLower = item.text.toLowerCase();
        let score = item.score || 0;
        // Exact match gets highest score
        if (textLower === inputLower) {
            score += 100;
        }
        // Starts with input
        else if (textLower.startsWith(inputLower)) {
            score += 50;
        }
        // Contains input
        else if (textLower.includes(inputLower)) {
            score += 25;
        }
        // Prefer shorter matches
        score += 10 / item.text.length;
        // Type preferences
        switch (item.type) {
            case 'command':
                score += 20;
                break;
            case 'option':
                score += 15;
                break;
            case 'path':
                score += 10;
                break;
            case 'variable':
                score += 5;
                break;
        }
        return score;
    }
    clearCompletions() {
        this.completionItems = [];
    }
}
export class InputValidator {
    constructor() {
        this.validators = new Map();
    }
    registerValidator(context, validator) {
        this.validators.set(context, validator);
    }
    validate(input, context) {
        const validator = context ? this.validators.get(context) : null;
        if (validator) {
            return validator(input);
        }
        // Default validation
        return {
            isValid: input.trim().length > 0,
            errors: input.trim().length === 0 ? ['Input cannot be empty'] : [],
            warnings: [],
            suggestions: []
        };
    }
    // Common validators
    static createCommandValidator(availableCommands) {
        return (input) => {
            const parts = input.trim().split(/\s+/);
            const command = parts[0];
            if (!command) {
                return {
                    isValid: false,
                    errors: ['Command cannot be empty'],
                    warnings: [],
                    suggestions: availableCommands.slice(0, 5)
                };
            }
            if (!availableCommands.includes(command)) {
                const suggestions = availableCommands
                    .filter(cmd => cmd.toLowerCase().startsWith(command.toLowerCase()))
                    .slice(0, 3);
                return {
                    isValid: false,
                    errors: [`Unknown command: ${command}`],
                    warnings: [],
                    suggestions
                };
            }
            return {
                isValid: true,
                errors: [],
                warnings: [],
                suggestions: []
            };
        };
    }
    static createPathValidator() {
        return (input) => {
            // Basic path validation
            const errors = [];
            const warnings = [];
            if (!input.trim()) {
                errors.push('Path cannot be empty');
            }
            // Check for invalid characters
            const invalidChars = /[<>:"|?*]/;
            if (invalidChars.test(input)) {
                errors.push('Path contains invalid characters');
            }
            // Check for very long paths
            if (input.length > 260) {
                warnings.push('Path is very long and may cause issues');
            }
            return {
                isValid: errors.length === 0,
                errors,
                warnings,
                suggestions: []
            };
        };
    }
}
export class KeyBindingManager {
    constructor() {
        this.bindings = new Map();
        this.contextBindings = new Map();
    }
    addBinding(binding) {
        this.bindings.set(binding.key, binding);
    }
    addContextBinding(context, binding) {
        if (!this.contextBindings.has(context)) {
            this.contextBindings.set(context, new Map());
        }
        this.contextBindings.get(context).set(binding.key, binding);
    }
    getBinding(key, context) {
        // Check context-specific bindings first
        if (context) {
            const contextBindings = this.contextBindings.get(context);
            if (contextBindings?.has(key)) {
                return contextBindings.get(key);
            }
        }
        // Fall back to global bindings
        return this.bindings.get(key);
    }
    getAllBindings(context) {
        const globalBindings = Array.from(this.bindings.values());
        const contextSpecific = context ?
            Array.from(this.contextBindings.get(context)?.values() || []) : [];
        return [...globalBindings, ...contextSpecific];
    }
    removeBinding(key, context) {
        if (context) {
            const contextBindings = this.contextBindings.get(context);
            return contextBindings?.delete(key) || false;
        }
        else {
            return this.bindings.delete(key);
        }
    }
    clearBindings(context) {
        if (context) {
            this.contextBindings.delete(context);
        }
        else {
            this.bindings.clear();
            this.contextBindings.clear();
        }
    }
}
export class PromptToolkit {
    constructor() {
        this.currentInput = '';
        this.cursorPosition = 0;
        this.completionIndex = -1;
        this.currentCompletions = [];
        this.historyManager = new HistoryManager();
        this.autoCompleter = new AutoCompleter();
        this.inputValidator = new InputValidator();
        this.keyBindingManager = new KeyBindingManager();
        this.initializeDefaultBindings();
        this.initializeDefaultCompletions();
    }
    initializeDefaultBindings() {
        // Navigation
        this.keyBindingManager.addBinding({
            key: 'arrow-left',
            action: 'cursor-left',
            description: 'Move cursor left'
        });
        this.keyBindingManager.addBinding({
            key: 'arrow-right',
            action: 'cursor-right',
            description: 'Move cursor right'
        });
        this.keyBindingManager.addBinding({
            key: 'home',
            action: 'cursor-start',
            description: 'Move cursor to start'
        });
        this.keyBindingManager.addBinding({
            key: 'end',
            action: 'cursor-end',
            description: 'Move cursor to end'
        });
        // History
        this.keyBindingManager.addBinding({
            key: 'arrow-up',
            action: 'history-previous',
            description: 'Previous history entry'
        });
        this.keyBindingManager.addBinding({
            key: 'arrow-down',
            action: 'history-next',
            description: 'Next history entry'
        });
        // Completion
        this.keyBindingManager.addBinding({
            key: 'tab',
            action: 'complete',
            description: 'Auto-complete input'
        });
        this.keyBindingManager.addBinding({
            key: 'ctrl+space',
            action: 'show-completions',
            description: 'Show completion options'
        });
        // Editing
        this.keyBindingManager.addBinding({
            key: 'backspace',
            action: 'delete-char',
            description: 'Delete character before cursor'
        });
        this.keyBindingManager.addBinding({
            key: 'delete',
            action: 'delete-char-forward',
            description: 'Delete character after cursor'
        });
        this.keyBindingManager.addBinding({
            key: 'ctrl+a',
            action: 'select-all',
            description: 'Select all text'
        });
        this.keyBindingManager.addBinding({
            key: 'ctrl+c',
            action: 'copy',
            description: 'Copy selected text'
        });
        this.keyBindingManager.addBinding({
            key: 'ctrl+v',
            action: 'paste',
            description: 'Paste text'
        });
        this.keyBindingManager.addBinding({
            key: 'ctrl+z',
            action: 'undo',
            description: 'Undo last action'
        });
    }
    initializeDefaultCompletions() {
        // Common commands
        const commands = [
            { text: 'search', displayText: 'search', description: 'Search registry entries', type: 'command', score: 1 },
            { text: 'create', displayText: 'create', description: 'Create new entry', type: 'command', score: 1 },
            { text: 'update', displayText: 'update', description: 'Update existing entry', type: 'command', score: 1 },
            { text: 'delete', displayText: 'delete', description: 'Delete entry', type: 'command', score: 1 },
            { text: 'list', displayText: 'list', description: 'List entries', type: 'command', score: 1 },
            { text: 'help', displayText: 'help', description: 'Show help', type: 'command', score: 1 },
            { text: 'exit', displayText: 'exit', description: 'Exit application', type: 'command', score: 1 }
        ];
        this.autoCompleter.addCompletionItems(commands);
    }
    // Input handling
    handleInput(input, key) {
        const binding = this.keyBindingManager.getBinding(key.name || input);
        if (binding) {
            return this.executeAction(binding.action, input, key);
        }
        // Default character input
        if (input && input.length === 1 && !key.ctrl && !key.meta) {
            return this.insertCharacter(input);
        }
        return { action: 'none' };
    }
    executeAction(action, input, key) {
        switch (action) {
            case 'cursor-left':
                this.cursorPosition = Math.max(0, this.cursorPosition - 1);
                return { action: 'cursor-moved', value: this.cursorPosition };
            case 'cursor-right':
                this.cursorPosition = Math.min(this.currentInput.length, this.cursorPosition + 1);
                return { action: 'cursor-moved', value: this.cursorPosition };
            case 'cursor-start':
                this.cursorPosition = 0;
                return { action: 'cursor-moved', value: this.cursorPosition };
            case 'cursor-end':
                this.cursorPosition = this.currentInput.length;
                return { action: 'cursor-moved', value: this.cursorPosition };
            case 'history-previous':
                const prevEntry = this.historyManager.getPrevious();
                if (prevEntry !== null) {
                    this.currentInput = prevEntry;
                    this.cursorPosition = prevEntry.length;
                    return { action: 'input-changed', value: this.currentInput };
                }
                break;
            case 'history-next':
                const nextEntry = this.historyManager.getNext();
                if (nextEntry !== null) {
                    this.currentInput = nextEntry;
                    this.cursorPosition = nextEntry.length;
                    return { action: 'input-changed', value: this.currentInput };
                }
                break;
            case 'complete':
                return this.completeInput();
            case 'show-completions':
                this.currentCompletions = this.autoCompleter.getCompletions(this.currentInput);
                return { action: 'show-completions', value: this.currentCompletions };
            case 'delete-char':
                if (this.cursorPosition > 0) {
                    this.currentInput = this.currentInput.slice(0, this.cursorPosition - 1) +
                        this.currentInput.slice(this.cursorPosition);
                    this.cursorPosition--;
                    return { action: 'input-changed', value: this.currentInput };
                }
                break;
            case 'delete-char-forward':
                if (this.cursorPosition < this.currentInput.length) {
                    this.currentInput = this.currentInput.slice(0, this.cursorPosition) +
                        this.currentInput.slice(this.cursorPosition + 1);
                    return { action: 'input-changed', value: this.currentInput };
                }
                break;
        }
        return { action: 'none' };
    }
    insertCharacter(char) {
        this.currentInput = this.currentInput.slice(0, this.cursorPosition) +
            char +
            this.currentInput.slice(this.cursorPosition);
        this.cursorPosition++;
        return { action: 'input-changed', value: this.currentInput };
    }
    completeInput() {
        if (this.currentCompletions.length === 0) {
            this.currentCompletions = this.autoCompleter.getCompletions(this.currentInput);
        }
        if (this.currentCompletions.length > 0) {
            this.completionIndex = (this.completionIndex + 1) % this.currentCompletions.length;
            const completion = this.currentCompletions[this.completionIndex];
            this.currentInput = completion.text;
            this.cursorPosition = completion.text.length;
            return { action: 'input-changed', value: this.currentInput };
        }
        return { action: 'none' };
    }
    // Public API
    getCurrentInput() {
        return this.currentInput;
    }
    setCurrentInput(input) {
        this.currentInput = input;
        this.cursorPosition = input.length;
        this.completionIndex = -1;
        this.currentCompletions = [];
    }
    getCursorPosition() {
        return this.cursorPosition;
    }
    submitInput() {
        const validation = this.inputValidator.validate(this.currentInput);
        if (validation.isValid) {
            this.historyManager.addEntry(this.currentInput);
        }
        return { input: this.currentInput, validation };
    }
    clearInput() {
        this.currentInput = '';
        this.cursorPosition = 0;
        this.completionIndex = -1;
        this.currentCompletions = [];
    }
    // Component access
    getHistoryManager() {
        return this.historyManager;
    }
    getAutoCompleter() {
        return this.autoCompleter;
    }
    getInputValidator() {
        return this.inputValidator;
    }
    getKeyBindingManager() {
        return this.keyBindingManager;
    }
}
// Advanced Prompt Component
export const AdvancedPrompt = ({ toolkit, placeholder = 'Enter command...', onSubmit, onChange }) => {
    const [input, setInput] = React.useState(toolkit.getCurrentInput());
    const [showCompletions, setShowCompletions] = React.useState(false);
    const [completions, setCompletions] = React.useState([]);
    React.useEffect(() => {
        const handleInput = (inputChar, key) => {
            const result = toolkit.handleInput(inputChar, key);
            if (result.action === 'input-changed') {
                setInput(result.value);
                onChange?.(result.value);
            }
            else if (result.action === 'show-completions') {
                setCompletions(result.value);
                setShowCompletions(true);
            }
            if (key.return) {
                const submission = toolkit.submitInput();
                if (submission.validation.isValid) {
                    onSubmit(submission.input);
                    toolkit.clearInput();
                    setInput('');
                    setShowCompletions(false);
                }
            }
        };
        // This would be integrated with the actual input handling in a real implementation
        // For now, it's a placeholder for the concept
    }, [toolkit, onSubmit, onChange]);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { dimColor: true, children: placeholder }), _jsx(Text, { children: input }), _jsx(Text, { dimColor: true, children: "_" })] }), showCompletions && completions.length > 0 && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { dimColor: true, children: "Completions:" }), completions.slice(0, 5).map((completion, index) => (_jsxs(Box, { marginLeft: 2, children: [_jsx(Text, { color: "cyan", children: completion.displayText }), completion.description && (_jsxs(Text, { dimColor: true, children: [" - ", completion.description] }))] }, index)))] }))] }));
};
//# sourceMappingURL=prompt-toolkit.js.map