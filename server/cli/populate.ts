import { INestApplication } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Connection } from 'typeorm';

import { logColored } from './cli-utils';

// tslint:disable:no-console
export async function populate() {
    logColored('\nPopulating... (this may take a minute or two)\n');
    const app = await getApplicationRef();
    if (app) {
        const { Populator, Importer } = require('vendure');
        const initialData = require('./assets/initial-data.json');
        await populateInitialData(app, initialData, Populator);
        await populateProducts(app, initialData, Importer);
        logColored('\nDone!');
        await app.close();
        process.exit(0);
    }
}

async function getApplicationRef(): Promise<INestApplication | undefined> {
    const tsConfigFile = path.join(process.cwd(), 'vendure-config.ts');
    const jsConfigFile = path.join(process.cwd(), 'vendure-config.js');
    let isTs = false;
    let configFile: string | undefined;
    if (fs.existsSync(tsConfigFile)) {
        configFile = tsConfigFile;
        isTs = true;
    } else if (fs.existsSync(jsConfigFile)) {
        configFile = jsConfigFile;
    }

    if (!configFile) {
        console.error(`Could not find a config file`);
        console.error(`Checked "${tsConfigFile}", "${jsConfigFile}"`);
        process.exit(1);
        return;
    }

    if (isTs) {
        // we expect ts-node to be available
        const tsNode = require('ts-node');
        if (!tsNode) {
            console.error(`For "populate" to work with TypeScript projects, you must have ts-node installed`);
            process.exit(1);
            return;
        }
        require('ts-node').register();
    }

    const index = require(configFile);

    if (!index) {
        console.error(`Could not read the contents of "${configFile}"`);
        process.exit(1);
        return;
    }
    if (!index.config) {
        console.error(`The file "${configFile}" does not export a "config" object`);
        process.exit(1);
        return;
    }

    const config = index.config;
    const { bootstrap } = require('vendure');
    console.log('Bootstrapping Vendure server...');
    const app = await bootstrap(config);
    return app;
}

async function populateInitialData(app: INestApplication, initialData: any, Populator: any) {
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData);
    } catch (err) {
        console.error(err.message);
    }
}

async function populateProducts(app: INestApplication, initialData: any, Importer: any) {
    // copy the images to the import folder
    const images = path.join(__dirname, 'assets', 'images');
    const destination = path.join(process.cwd(), 'vendure', 'import-assets');
    await fs.copy(images, destination);

    // import the csv of same product data
    const importer = app.get(Importer);
    const productData = await fs.readFile(path.join(__dirname, 'assets', 'sample-products.csv'), 'utf-8');
    const importResult = await importer.parseAndImport(productData, initialData.defaultLanguage);
    if (importResult.errors.length) {
        console.error(`Error encountered when importing product data:`);
        console.error(importResult.errors.join('\n'));
    } else {
        console.log(`Imported ${importResult.importedCount} products`);
        await fs.emptyDir(destination);
    }
}
