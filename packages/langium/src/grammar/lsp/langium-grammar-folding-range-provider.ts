/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { DefaultFoldingRangeProvider } from '../../lsp/folding-range-provider';
import { AstNode } from '../../syntax-tree';
import { isParserRule } from '../generated/ast';

export class LangiumGrammarFoldingRangeProvider extends DefaultFoldingRangeProvider {

    shouldProcessContent(node: AstNode): boolean {
        return !isParserRule(node);
    }
}
