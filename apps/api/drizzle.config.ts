import {defineConfig} from 'drizzle-kit';

export default ({
    schema: "./src/db/schema/*.ts",
    dialect: 'sqlite',
    out: './drizzle',
    driver: 'd1-http',
    dbCredentials: {
        accountId: '4c80d78eed9acef78cf309721141e3cd',
        databaseId: 'f286cca7-4144-451f-83a2-6603067f65e9',
        token: 'HMLGiLPOKbsvp5rBaM2cqv96KFXbcAg82egJqZOc',
    },
}
)
