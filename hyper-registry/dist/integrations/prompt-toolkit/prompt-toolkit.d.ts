import React from 'react';
import { z } from 'zod';
export declare const KeyBindingSchema: z.ZodObject<{
    key: z.ZodString;
    action: z.ZodString;
    description: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    action: string;
    description: string;
    context?: string | undefined;
}, {
    key: string;
    action: string;
    description: string;
    context?: string | undefined;
}>;
export type KeyBinding = z.infer<typeof KeyBindingSchema>;
export declare const CompletionItemSchema: z.ZodObject<{
    text: z.ZodString;
    displayText: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["command", "option", "value", "path", "variable"]>;
    score: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "value" | "path" | "command" | "option" | "variable";
    text: string;
    score: number;
    displayText: string;
    description?: string | undefined;
}, {
    type: "value" | "path" | "command" | "option" | "variable";
    text: string;
    displayText: string;
    score?: number | undefined;
    description?: string | undefined;
}>;
export type CompletionItem = z.infer<typeof CompletionItemSchema>;
export declare const ValidationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    errors: z.ZodArray<z.ZodString, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
    suggestions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    suggestions: string[];
    isValid: boolean;
    errors: string[];
    warnings: string[];
}, {
    suggestions: string[];
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export declare class HistoryManager {
    private history;
    private maxSize;
    private currentIndex;
    addEntry(entry: string): void;
    getPrevious(): string | null;
    getNext(): string | null;
    search(query: string): string[];
    clear(): void;
    getAll(): string[];
    getSize(): number;
}
export declare class AutoCompleter {
    private completionItems;
    private contextProviders;
    addCompletionItem(item: CompletionItem): void;
    addCompletionItems(items: CompletionItem[]): void;
    registerContextProvider(context: string, provider: (input: string) => CompletionItem[]): void;
    getCompletions(input: string, context?: string): CompletionItem[];
    private calculateScore;
    clearCompletions(): void;
}
export declare class InputValidator {
    private validators;
    registerValidator(context: string, validator: (input: string) => ValidationResult): void;
    validate(input: string, context?: string): ValidationResult;
    static createCommandValidator(availableCommands: string[]): (input: string) => ValidationResult;
    static createPathValidator(): (input: string) => ValidationResult;
}
export declare class KeyBindingManager {
    private bindings;
    private contextBindings;
    addBinding(binding: KeyBinding): void;
    addContextBinding(context: string, binding: KeyBinding): void;
    getBinding(key: string, context?: string): KeyBinding | undefined;
    getAllBindings(context?: string): KeyBinding[];
    removeBinding(key: string, context?: string): boolean;
    clearBindings(context?: string): void;
}
export declare class PromptToolkit {
    private historyManager;
    private autoCompleter;
    private inputValidator;
    private keyBindingManager;
    private currentInput;
    private cursorPosition;
    private completionIndex;
    private currentCompletions;
    constructor();
    private initializeDefaultBindings;
    private initializeDefaultCompletions;
    handleInput(input: string, key: any): {
        action: string;
        value?: any;
    };
    private executeAction;
    private insertCharacter;
    private completeInput;
    getCurrentInput(): string;
    setCurrentInput(input: string): void;
    getCursorPosition(): number;
    submitInput(): {
        input: string;
        validation: ValidationResult;
    };
    clearInput(): void;
    getHistoryManager(): HistoryManager;
    getAutoCompleter(): AutoCompleter;
    getInputValidator(): InputValidator;
    getKeyBindingManager(): KeyBindingManager;
}
export declare const AdvancedPrompt: React.FC<{
    toolkit: PromptToolkit;
    placeholder?: string;
    onSubmit: (input: string) => void;
    onChange?: (input: string) => void;
}>;
//# sourceMappingURL=prompt-toolkit.d.ts.map