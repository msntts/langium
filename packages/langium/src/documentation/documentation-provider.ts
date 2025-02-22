/******************************************************************************
 * Copyright 2023 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { GrammarConfig } from '../grammar/grammar-config';
import { LangiumServices } from '../services';
import { AstNode, AstNodeDescription, isLeafCstNode } from '../syntax-tree';
import { getDocument } from '../utils/ast-util';
import { findCommentNode } from '../utils/cst-util';
import { IndexManager } from '../workspace/index-manager';
import { isJSDoc, parseJSDoc } from './jsdoc';

/**
 * Provides documentation for AST nodes.
 */
export interface DocumentationProvider {
    /**
     * Returns a markdown documentation string for the specified AST node.
     *
     * The default implementation `JSDocDocumentationProvider` will inspect the comment associated with the specified node.
     */
    getDocumentation(node: AstNode): string | undefined;
}

export class JSDocDocumentationProvider implements DocumentationProvider {

    protected readonly indexManager: IndexManager;
    protected readonly grammarConfig: GrammarConfig;

    constructor(services: LangiumServices) {
        this.indexManager = services.shared.workspace.IndexManager;
        this.grammarConfig = services.parser.GrammarConfig;
    }

    getDocumentation(node: AstNode): string | undefined {
        const lastNode = findCommentNode(node.$cstNode, this.grammarConfig.multilineCommentRules);
        if (isLeafCstNode(lastNode) && isJSDoc(lastNode)) {
            const parsedJSDoc = parseJSDoc(lastNode);
            return parsedJSDoc.toMarkdown({
                renderLink: (link, display) => {
                    return this.documentationLinkRenderer(node, link, display);
                }
            });
        }
        return undefined;
    }

    protected documentationLinkRenderer(node: AstNode, name: string, display: string): string | undefined {
        const description = this.findNameInPrecomputedScopes(node, name) ?? this.findNameInGlobalScope(node, name);
        if (description && description.nameSegment) {
            const line = description.nameSegment.range.start.line + 1;
            const character = description.nameSegment.range.start.character + 1;
            const uri = description.documentUri.with({ fragment: `L${line},${character}` });
            return `[${display}](${uri.toString()})`;
        } else {
            return undefined;
        }
    }

    protected findNameInPrecomputedScopes(node: AstNode, name: string): AstNodeDescription | undefined {
        const document = getDocument(node);
        const precomputed = document.precomputedScopes;
        if (!precomputed) {
            return undefined;
        }
        let currentNode: AstNode | undefined = node;
        do {
            const allDescriptions = precomputed.get(currentNode);
            const description = allDescriptions.find(e => e.name === name);
            if (description) {
                return description;
            }
            currentNode = currentNode.$container;
        } while (currentNode);

        return undefined;
    }

    protected findNameInGlobalScope(node: AstNode, name: string): AstNodeDescription | undefined {
        const description = this.indexManager.allElements().find(e => e.name === name);
        return description;
    }
}
