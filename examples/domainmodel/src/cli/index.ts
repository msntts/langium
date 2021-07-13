/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Command } from 'commander';
import { createDomainModelServices } from '../language-server/domain-model-module';
import { extractGrammar } from '../cli-util';
import { DomainModelGenerator } from './generator';

const program = new Command();

program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../package.json').version);

program
    .command('generate')
    .argument('<file>', 'the .dmodel file')
    .option('-d, --destination <dir>', 'destination directory of generating')
    .description('generate Java classes from .dmodel file')
    .action((fileName: string, opts: GenerateOptions) => {
        const grammar = extractGrammar(fileName, './package.json', createDomainModelServices());
        new DomainModelGenerator(grammar, fileName, opts.destination).generate();
    });

program.parse(process.argv);

export type GenerateOptions = {
    destination?: string;
}