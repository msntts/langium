/******************************************************************************
 * This file was generated by langium-cli 0.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import { Module } from '../../dependency-injection';
import { LangiumGeneratedServices, LangiumServices } from '../../services';
import { LangiumGrammarAstReflection } from './ast';
import { grammar } from './grammar';

export const languageMetaData = {
    languageId: 'langium',
    fileExtensions: ['.langium']
};

export const LangiumGrammarGeneratedModule: Module<LangiumServices, LangiumGeneratedServices> = {
    Grammar: () => grammar(),
    AstReflection: () => new LangiumGrammarAstReflection(),
    LanguageMetaData: () => languageMetaData
};
