#!/usr/bin/env node
import * as program from 'commander';
import * as prompts from 'prompts';

import { logColored } from './cli-utils';
import { init } from './init';
import { populate } from './populate';
// tslint:disable-next-line:no-var-requires
const version = require('../../package.json').version;

// tslint:disable:no-console
logColored(`
                      _
                     | |
 __   _____ _ __   __| |_   _ _ __ ___
 \\ \\ / / _ \\ '_ \\ / _\` | | | | '__/ _ \\
  \\ V /  __/ | | | (_| | |_| | | |  __/
   \\_/ \\___|_| |_|\\__,_|\\__,_|_|  \\___|
                                       `);

program.version(`Vendure CLI v${version}`, '-v --version').name('vendure');
program
    .command('init')
    .description('Initialize a new Vendure server application')
    .action(async (command: any) => {
        const indexFile = await init();
        const answer = await prompts({
            type: 'toggle',
            name: 'populate',
            message: 'Populate the database with some data to get you started (recommended)?',
            active: 'yes',
            inactive: 'no',
            initial: true as any,
        });
        if (answer.populate) {
            await populate();
        }
        logColored(`\nAll done! Run "${indexFile}" to start the server.`);
    });
program
    .command('populate')
    .description('Populate a new Vendure server instance with some initial data')
    .action(async () => {
        await populate();
    });
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.help();
}
