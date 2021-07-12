import { Diagnostic, Position } from 'vscode-languageserver';
import { buildRealpath, createLangiumGrammarServices, LangiumDocumentConfiguration, loadUriContent } from '../../../../src';

describe('GoToResolver', () => {
    test('Find Definition', () => {
        const realPathFile = buildRealpath('packages/langium', 'test/languages/domain-model/domain-model.langium');
        const grammarFileContent = loadUriContent(realPathFile);
        const document = LangiumDocumentConfiguration.create(`file:${realPathFile}`, 'langium', 0, grammarFileContent);
        expect(document).toBeDefined;

        const services = createLangiumGrammarServices();
        const diagnostics: Diagnostic[] = [];
        expect(services.documents.DocumentBuilder.build(document, diagnostics)).toBeTruthy;
        expect(diagnostics.length).toEqual(0);

        const goToResolver = services.lsp.GoToResolver;
        const textPos = {
            textDocument: {
                uri: document.uri
            },
            // Must find Entity in `    DataType | Entity;`
            position: Position.create(15, 16)
        };
        const locationLink = goToResolver.goToDefinition(document, textPos);
        expect(locationLink.length).toBeGreaterThan(0);
        expect(locationLink.length).toBe(1);

        // find Entity in `Entity:`
        expect(locationLink[0].targetSelectionRange.start.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.start.character).toBe(0);
        expect(locationLink[0].targetSelectionRange.end.line).toBe(20);
        expect(locationLink[0].targetSelectionRange.end.character).toBe(6);
    });
});
