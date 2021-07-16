/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { FoldingRange, FoldingRangeKind } from 'vscode-languageserver';
import { LangiumDocument } from '../documents/document';
import { LeafCstNodeImpl } from '../parser/cst-node-builder';
import { LangiumServices } from '../services';
import { AstNode, CstNode } from '../syntax-tree';
import { AstNodeContent, streamAllContents } from '../utils/ast-util';
import { streamCst } from '../utils/cst-util';

export interface FoldingRangeProvider {
    getFoldingRanges(document: LangiumDocument): FoldingRange[]
}

export type FoldingRangeAcceptor = (foldingRange: FoldingRange) => void;

export class DefaultFoldingRangeProvider implements FoldingRangeProvider {

    protected readonly commentName: string;

    constructor(services: LangiumServices) {
        this.commentName = services.parser.MultilineComment;
    }

    getFoldingRanges(document: LangiumDocument): FoldingRange[] {
        const foldings: FoldingRange[] = [];
        const acceptor: FoldingRangeAcceptor = (foldingRange) => foldings.push(foldingRange);
        this.collectFolding(document, acceptor);
        return foldings;
    }

    protected collectFolding(document: LangiumDocument, acceptor: FoldingRangeAcceptor): void {
        const root = document.parseResult?.value;
        if (root) {
            if (this.shouldProcessContent(root)) {
                const treeIterator = streamAllContents(root).iterator();
                let result: IteratorResult<AstNodeContent, unknown>;
                do {
                    result = treeIterator.next();
                    if (!result.done) {
                        const node = result.value.node;
                        if (!this.isHandled(node)) {
                            this.collectObjectFolding(document, node, acceptor);
                        }
                        if (!this.shouldProcessContent(node)) {
                            treeIterator.prune();
                        }
                    }
                } while (!result.done);
            }

            this.collectCommentFolding(document, root, acceptor);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected isHandled(node: AstNode): boolean {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected shouldProcessContent(node: AstNode): boolean {
        return true;
    }

    protected collectObjectFolding(document: LangiumDocument, node: AstNode, acceptor: FoldingRangeAcceptor): void {
        const cstNode = node.$cstNode;
        if (cstNode) {
            const foldingRange = this.toFoldingRange(document, cstNode);
            if (foldingRange) {
                acceptor(foldingRange);
            }
        }
    }

    protected collectCommentFolding(document: LangiumDocument, node: AstNode, acceptor: FoldingRangeAcceptor): void {
        const cstNode = node.$cstNode;
        if (cstNode) {
            for (const node of streamCst(cstNode)) {
                if (node instanceof LeafCstNodeImpl && node.tokenType.name === this.commentName) {
                    const foldingRange = this.toFoldingRange(document, node, FoldingRangeKind.Comment);
                    if (foldingRange) {
                        acceptor(foldingRange);
                    }
                }
            }
        }
    }

    protected readonly letterTestRegex = /\w/;

    protected toFoldingRange(document: LangiumDocument, node: CstNode, kind?: string): FoldingRange | undefined {
        const { start, end } = node.range;
        const startPosition = document.positionAt(start);
        let endPosition = document.positionAt(end);
        // Don't generate foldings for nodes that are less than 3 lines
        if (endPosition.line - startPosition.line < 2) {
            return undefined;
        }
        /*
         * As we don't want to hide the end token like 'if { ... --> } <--',
         * we simply select the end of the previous line as the end position
         */
        endPosition = document.positionAt(document.offsetAt({ line: endPosition.line, character: 0 }) - 1);
        return FoldingRange.create(startPosition.line, endPosition.line, startPosition.character, endPosition.character, kind);
    }

}
