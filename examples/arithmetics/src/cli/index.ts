/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import colors from 'colors';
import { Command } from 'commander';
import { createArithmeticsServices } from '../language-server/arithmetics-module';
import { isModule } from '../language-server/generated/ast';
import { ArithmeticsInterpreter } from './interpreter';
import { ArithmeticsLanguageMetaData } from '../language-server/generated/meta-data';
import { extractDocument } from './cli-util';
import { Grammar } from 'langium';

const program = new Command();
program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../../package.json').version);

program
    .command('eval')
    .argument('<file>', 'the .calc file')
    .description('calculate Evaluations in the .calc file')
    .action((fileName: string) => {
        const metaData = new ArithmeticsLanguageMetaData();
        const document = extractDocument(fileName, metaData.languageId, metaData.extensions, createArithmeticsServices());
        const grammar = document.parseResult?.value as Grammar;
        if (isModule(grammar)) {
            for (const [evaluation, value] of new ArithmeticsInterpreter().eval(grammar)) {
                const cstNode = evaluation.expression.$cstNode;
                if (cstNode) {
                    const line = document.positionAt(cstNode.offset).line + 1;
                    console.log(`line ${line}:`, colors.green(cstNode.text), '===>', value);
                }
            }
        }
    });

program.parse(process.argv);
