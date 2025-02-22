/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { describe, test } from 'vitest';
import { createLangiumGrammarServices, EmptyFileSystem } from '../../src';
import { expectHover } from '../../src/test';

const text = `
  /**
   * I am a grammar file comment
   */
  // This is just a single line comment
  /**
   * Hi I am a grammar JSDoc comment
   */
  // Another single line comment
  grammar <|>g
  /**
   * Hi I am Rule 'X'
   */
  <|>X: name="X";
  /**
   * Hi I reference Rule {@linkcode X}
   */
  <|>Y: value=<|>X;
  `;

const grammarServices = createLangiumGrammarServices(EmptyFileSystem).grammar;
const hover = expectHover(grammarServices);

describe('Hover', () => {

    test('Hovering over the root node should also provide the documentation', async () => {
        await hover({
            text,
            index: 0,
            hover: 'Hi I am a grammar JSDoc comment'
        });
    });

    test('Hovering over X definition shows the comment hovering', async () => {
        await hover({
            text,
            index: 1,
            hover: "Hi I am Rule 'X'"
        });
    });

    test('Hovering over X definition shows the comment hovering', async () => {
        await hover({
            text,
            index: 3,
            hover: "Hi I am Rule 'X'"
        });
    });

    test('Hovering over Y renders the link as a vscode uri link', async () => {
        await hover({
            text,
            index: 2,
            hover: /Hi I reference Rule \[`X`\]\(file:\/\/\/\w*\.langium#L14%2C3\)/
        });
    });
});
