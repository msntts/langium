/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { beforeAll, describe, expect, test } from 'vitest';
import { TokenPattern, TokenType } from '@chevrotain/types';
import { createLangiumGrammarServices, Grammar, EmptyFileSystem } from '../../src';
import { parseHelper } from '../../src/test';

const grammarServices = createLangiumGrammarServices(EmptyFileSystem).grammar;
const helper = parseHelper<Grammar>(grammarServices);
const tokenBuilder = grammarServices.parser.TokenBuilder;

describe('tokenBuilder', () => {

    test('should only create non-fragment terminals', async () => {
        const tokens = await getTokens(`
        entry Main: value=AB;
        terminal fragment Frag: 'B';
        terminal AB: 'A' Frag;
        `);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].name).toBe('AB');
    });

    test('should only create used terminals', async () => {
        const tokens = await getTokens(`
        entry Main: value=A;
        terminal A: 'A';
        terminal B: 'B';
        `);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].name).toBe('A');
    });

    test('should only create used keywords', async () => {
        const tokens = await getTokens(`
        entry Main: value='A';
        Second: value='B';
        `);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].name).toBe('A');
    });

    test('should preserve terminal order', async () => {
        const tokens = await getTokens(`
        entry Main: c=C b=B a=A;
        terminal A: 'A';
        terminal B: 'B';
        terminal C: 'C';
        `);
        expect(tokens).toHaveLength(3);
        expect(tokens[0].name).toBe('A');
        expect(tokens[1].name).toBe('B');
        expect(tokens[2].name).toBe('C');
    });

    async function getTokens(grammarString: string): Promise<TokenType[]> {
        const grammar = (await helper(grammarString)).parseResult.value;
        return tokenBuilder.buildTokens(grammar) as TokenType[];
    }

});

describe('tokenBuilder#longerAlts', () => {

    let aToken: TokenType; // 'A' keyword
    let abToken: TokenType; // 'AB' keyword
    let abcToken: TokenType; // 'ABC' keyword
    let abTerminalToken: TokenType; // 'AB' terminal

    beforeAll(async () => {
        const text = `
        grammar test
        Main: {infer Main} 'A' 'AB' 'ABC';
        terminal AB: /ABD?/;
        `;
        const grammar = (await helper(text)).parseResult.value;
        const tokens = tokenBuilder.buildTokens(grammar) as TokenType[];
        aToken = tokens[2];
        abToken = tokens[1];
        abcToken = tokens[0];
        abTerminalToken = tokens[3];
    });

    test('should create longer alts for keywords # 1', () => {
        expect(Array.isArray(aToken.LONGER_ALT)).toBeTruthy();
        const longerAlts = aToken.LONGER_ALT as TokenType[];
        expect(longerAlts).toEqual([abTerminalToken]);
    });

    test('should create longer alts for keywords # 2', () => {
        expect(Array.isArray(abToken.LONGER_ALT)).toBeTruthy();
        const longerAlts = abToken.LONGER_ALT as TokenType[];
        expect(longerAlts).toEqual([abTerminalToken]);
    });

    test('should create no longer alts for longest keyword', () => {
        expect(abcToken.LONGER_ALT).toEqual([]);
    });

    test('should create no longer alts for terminals', () => {
        expect(abTerminalToken.LONGER_ALT).toBeUndefined();
    });

});

describe('tokenBuilder#caseInsensitivePattern', () => {

    let implementPattern: TokenPattern | undefined;
    let strangePattern: TokenPattern | undefined;
    let abcPattern: TokenPattern | undefined;
    let abPattern: TokenPattern | undefined;
    let aPattern: TokenPattern | undefined;
    let booleanTerminalPattern: TokenPattern | undefined;
    let abTerminalPattern: TokenPattern | undefined;

    beforeAll(async () => {
        const text = `
        grammar test
        Main: 'A' 'ab' 'AbC' | Implement | '\\\\strange\\\\';
        Implement: '@implement' AB;
        terminal BOOLEAN returns boolean: /true|false/;
        terminal AB: /ABD?/;
        `;
        const grammar = (await parseHelper<Grammar>(grammarServices)(text)).parseResult.value;
        const tokens = tokenBuilder.buildTokens(grammar, { caseInsensitive: true }) as TokenType[];
        const patterns = tokens.map(token => token.PATTERN);

        implementPattern = patterns[0];
        strangePattern = patterns[1];
        abcPattern = patterns[2];
        abPattern = patterns[3];
        aPattern = patterns[4];
        booleanTerminalPattern = patterns[5];
        abTerminalPattern = patterns[6];
    });

    test('should create from keyword with special symbols', () => {
        expect(implementPattern).toEqual(new RegExp(/@[iI][mM][pP][lL][eE][mM][eE][nN][tT]/));
    });

    test('should create from keyword with special escape symbols', () => {
        expect(strangePattern).toEqual(new RegExp(/\\[sS][tT][rR][aA][nN][gG][eE]\\/));
    });

    test('should create from mixed-case word', () => {
        expect(abcPattern).toEqual(new RegExp(/[aA][bB][cC]/));
    });

    test('should create from lower-case word', () => {
        expect(abPattern).toEqual(new RegExp(/[aA][bB]/));
    });

    test('should create from upper-case word', () => {
        expect(aPattern).toEqual(new RegExp(/[aA]/));
    });

    test('should ignore terminals', () => {
        expect(booleanTerminalPattern).toEqual(new RegExp(/true|false/));
    });

    test('should ignore terminals with ?', () => {
        expect(abTerminalPattern).toEqual(new RegExp(/ABD?/));
    });

});
