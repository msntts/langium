import colors from 'colors';
import { Command } from 'commander';
import { Model } from '../language-server/generated/ast';
import { HelloWorldLanguageMetaData } from '../language-server/generated/meta-data';
import { createHelloWorldServices } from '../language-server/hello-world-module';
import { extractAstNode } from './cli-util';
import { HelloWorldGenerator } from './generator';
const metaData = new HelloWorldLanguageMetaData();
const program = new Command();
program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../../package.json').version);
program
    .command('generate')
    .argument('<file>', `possible file extensions: ${metaData.extensions.join(', ')}`)
    .option('-d, --destination <dir>', 'destination directory of generating')
    .description('generates JavaScript code that prints Hello {name}! for every greeting in a source file')
    .action((fileName: string, opts: GenerateOptions) => {
        const model = extractAstNode<Model>(fileName, metaData.languageId, metaData.extensions, createHelloWorldServices());
        const generatedFilePath = new HelloWorldGenerator(model, fileName, opts.destination).generate();
        console.log(colors.green('TypeScript code generated successfully:'), colors.yellow(generatedFilePath));
    });
program.parse(process.argv);
export type GenerateOptions = {
    destination?: string;
}