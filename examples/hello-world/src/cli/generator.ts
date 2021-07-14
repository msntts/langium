import fs from 'fs';
import _ from 'lodash';
import { CompositeGeneratorNode, NL, processGeneratorNode } from 'langium';
import { Model } from '../language-server/generated/ast';

export class HelloWorldGenerator {
    private model: Model;
    private fileName: string;
    private destination: string;
    private fileNode: CompositeGeneratorNode = new CompositeGeneratorNode();

    constructor(model: Model, fileName: string, destination: string | undefined) {
        this.model = model;

        const fileNameSeq = fileName.replace(/\..*$/, '').replaceAll(/[.-]/g, '').split('/');
        this.fileName = `${fileNameSeq.pop() ?? 'hello-world'}.js`;
        this.destination = destination ? destination : `./${fileNameSeq.join('/')}/generated`;
    }

    public generate(): string {
        this.fileNode.append('"use strict";', NL, NL);

        for (const greeting of this.model.greetings) {
            this.fileNode.append(`console.log('Hello, ${greeting.person.$refName}!');`, NL);
        }

        if (!fs.existsSync(this.destination)) {
            fs.mkdirSync(this.destination, { recursive: true });
        }
        const generatedFilePath = `${this.destination}/${this.fileName}`;
        fs.writeFileSync(generatedFilePath, processGeneratorNode(this.fileNode));
        return generatedFilePath;
    }
}