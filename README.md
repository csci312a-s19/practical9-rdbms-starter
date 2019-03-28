# Simplepedia SQL Server

This is a RDMS-backed Simplepedia server implementation designed for stand-alone use or deployment to Heroku. In the development environment it uses a sqlite3 backend, and in the production environment a PostgreSQL backend.

## Local Deployment

### Prepare the database

To prepare the development sqlite3 database (`simplepedia.db`):

1. Run the migration

   ```
   npx knex migrate:latest --env development
   ```

2. Seed the database from `seed.json`

   ```
   npx knex seed:run --env development
   ```

3. Verify the seed was successful by opening the database from the command line:

   ```
   sqlite3 simplepedia.db
   ```

   and then querying the available articles: `select * from Article;`.

### Launch the server

You can launch the server with `npm start`. The server defaults to port 3001.

## Development

### Launch the server (with file watching)

You can launch the server in "watch" mode with `npm run watch` to automatically restart with every file change.

### Testing

The server has a SuperTest-based test suite that can be run with `npm test`.

### Linting with eslint

The server is configured with Prettier and the AirBnB eslint rules. ESLint can be run with `npm run lint` or `npx eslint .`.

The lint rules were installed with:

```
npx install-peerdeps --dev eslint-config-airbnb-base
npm install --save-dev prettier husky lint-staged eslint-config-prettier
```

and `.eslintrc.json` was configured with:

```
{
  "extends": ["airbnb-base", "prettier"],
  "env": {
    "jest": true
  },
  "rules": {
    "import/order": "off"
  }
}
```
