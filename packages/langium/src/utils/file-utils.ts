/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import fs from 'fs-extra';
import path from 'path';

export function buildRealpath(pathToRepoPackage: string, packageFile: string): string {
    // check if I am relative to the root (workspace build) or relative to the package (single npm run build)
    const rootDir = (fs.readdirSync('.').includes('packages')) ? fs.realpathSync('.') : fs.realpathSync('../..');
    return path.join(rootDir, pathToRepoPackage, packageFile);
}

export function loadUriContent(uri: string): string {
    return fs.readFileSync(uri, 'utf-8');
}
