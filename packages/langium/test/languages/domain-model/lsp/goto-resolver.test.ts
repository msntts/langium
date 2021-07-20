/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import fs from 'fs-extra';
import path from 'path';
import { Diagnostic, Position } from 'vscode-languageserver';
import { createLangiumGrammarServices, LangiumDocument, LangiumDocumentConfiguration, LangiumGrammarServices } from '../../../../src';

let services: LangiumGrammarServices;
let document: LangiumDocument;

beforeAll(() => {
    const realPathFile = path.join(__dirname, '..', 'domain-model.langium');
    const grammarFileContent = fs.readFileSync(realPathFile, 'utf-8');
    document = LangiumDocumentConfiguration.create(`file:${realPathFile}`, 'langium', 0, grammarFileContent);
    expect(document).toBeDefined;

    services = createLangiumGrammarServices();
    const diagnostics: Diagnostic[] = [];
    expect(services.documents.DocumentBuilder.build(document)).toBeTruthy;
    expect(diagnostics.length).toEqual(0);
});

describe('GoToResolver', () => {
    test('Find Declaration', () => {
        const goToResolver = services.lsp.GoToResolver;
        const textPos = {
            textDocument: {
                uri: document.uri
            },
            // `    DataType | Entity;` - Must find definiton of Entity
            position: Position.create(15, 16)
        };
        const locationLink = goToResolver.goToDefinition(document, textPos);
        expect(locationLink.length).toBe(1);
        expect(locationLink[0].targetSelectionRange.start.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.start.character).toBe(0);
        expect(locationLink[0].targetSelectionRange.end.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.end.character).toBe(6);
    });

    test('Find itself', () => {
        const goToResolver = services.lsp.GoToResolver;
        const textPos = {
            textDocument: {
                uri: document.uri
            },
            // `Entity:` - Must find itself
            position: Position.create(20, 2)
        };
        const locationLink = goToResolver.goToDefinition(document, textPos);
        expect(locationLink.length).toBe(1);
        expect(locationLink[0].targetSelectionRange.start.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.start.character).toBe(0);
        expect(locationLink[0].targetSelectionRange.end.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.end.character).toBe(6);
    });

    test('Find Array Element', () => {
        const goToResolver = services.lsp.GoToResolver;
        const textPos = {
            textDocument: {
                uri: document.uri
            },
            // `hidden(WS, SL_COMMENT, ML_COMMENT)` - Must find SL_COMMENT
            position: Position.create(1, 15)
        };
        const locationLink = goToResolver.goToDefinition(document, textPos);
        expect(locationLink.length).toBe(1);
        expect(locationLink[0].targetSelectionRange.start.line).toBe(37);
        expect(locationLink[0].targetSelectionRange.start.character).toBe(9);
        expect(locationLink[0].targetSelectionRange.end.line).toBe(37);
        expect(locationLink[0].targetSelectionRange.end.character).toBe(19);
    });
});
