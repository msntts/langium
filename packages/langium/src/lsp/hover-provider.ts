/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Hover } from 'vscode-languageserver';
import { Position } from 'vscode-languageserver-textdocument';
import { LangiumDocument } from '../documents/document';
import { CompositeCstNodeImpl, LeafCstNodeImpl } from '../parser/cst-node-builder';
import { References } from '../references/references';
import { LangiumServices } from '../services';
import { AstNode, CstNode } from '../syntax-tree';
import { findLeafNodeAtOffset } from '../utils/ast-util';

export interface HoverProvider {
    getHoverContent(document: LangiumDocument, position: Position): Hover | undefined;
}

export abstract class AstNodeHoverProvider implements HoverProvider {

    protected readonly references: References;

    constructor(services: LangiumServices) {
        this.references = services.references.References;
    }

    getHoverContent(document: LangiumDocument, position: Position): Hover | undefined {
        const rootNode = document.parseResult?.value?.$cstNode;
        if (rootNode) {
            const offset = document.offsetAt(position);
            const cstNode = findLeafNodeAtOffset(rootNode, offset);
            if (cstNode && cstNode.offset + cstNode.length > offset) {
                const targetNode = this.references.findDeclaration(cstNode);
                if (targetNode) {
                    return this.getAstNodeHoverContent(targetNode.element);
                }
            }
        }
        return;
    }

    abstract getAstNodeHoverContent(node: AstNode): Hover | undefined;

}

export class MultilineCommentHoverProvider extends AstNodeHoverProvider {

    protected readonly commentContentRegex = /\/\*([\s\S]*?)\*\//;

    getAstNodeHoverContent(node: AstNode): Hover | undefined {
        const cstNode = node.$cstNode;
        let content: string | undefined;
        if (cstNode && cstNode instanceof CompositeCstNodeImpl) {
            const hiddenNodes: CstNode[] = [];
            for (const node of cstNode.children) {
                if (node.hidden) {
                    hiddenNodes.push(node);
                } else {
                    break;
                }
            }
            const lastNode = hiddenNodes[hiddenNodes.length - 1];
            if (lastNode && lastNode instanceof LeafCstNodeImpl && lastNode.tokenType.name === 'ML_COMMENT') {
                const exec = this.commentContentRegex.exec(lastNode.text);
                if (exec && exec[1]) {
                    content = this.getCommentContent(exec[1]);
                }
            }
        }
        if (content) {
            return {
                contents: {
                    kind: 'markdown',
                    value: content
                }
            };
        }
        return;
    }

    getCommentContent(commentText: string): string {
        const split = commentText.split('\n').map(e => {
            e = e.trim();
            if (e.startsWith('*')) {
                e = e.substring(1).trim();
            }
            return e;
        });
        return split.join(' ');
    }

}