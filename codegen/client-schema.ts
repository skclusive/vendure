import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

const CLIENT_SCHEMA_FILE = '../admin-ui/src/app/data/client-state/client-types.graphql';
const LANGUAGE_CODE_FILE = '../server/src/common/types/language-code.graphql';

function loadGraphQL(file: string): string {
    const filePath = path.join(__dirname, file);
    return fs.readFileSync(filePath, 'utf8');
}

/**
 * Augments the client schema (used by apollo-link-state) with missing
 * definitions, to allow the codegen step to work correctly.
 * See: https://github.com/dotansimha/graphql-code-generator/issues/583
 */
function getClientSchema() {
    const clientDirective = `
        directive @client on FIELD
    `;
    const clientSchemaString = loadGraphQL(CLIENT_SCHEMA_FILE);
    const languageCodeString = loadGraphQL(LANGUAGE_CODE_FILE);
    const schema = makeExecutableSchema({
        typeDefs: [clientSchemaString, clientDirective, languageCodeString],
    });
    return schema;
}

export default getClientSchema();
