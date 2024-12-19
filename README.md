

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJs project setup guideline with bun

## The features.
1. Authentication and Authorization
    - User & password authentication
    - JWT
    - Role and actions based authorization

2. Default user for setting up
    - System user: defined in the env INITIAL_SYSTEM_USER / INITIAL_SYSTEM_PASSWORD
    - Admin user: INITIAL_ADMIN_USER / INITIAL_ADMIN_PASSWORD
    
## NestJs

1. Create a new project

``` bash
nest new nestjs-project
```

2. Project setup

```bash
$ bun install
```

3. Compile and run the project
```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
``` 

4. Run tests

  4.1 Unit test

    ```bash
    # unit tests
    $ bun test:unit

    # test coverage
    $ bun test:unit --coverage
    ```

  4.2 E2E test.
    To simulate real-world conditions, end-to-end tests starts the service only once. Unit tests can then make HTTP calls to closely replicate actual API interactions.

    Coverage reports cannot be generated for end-to-end tests because the service runs as a web service. API calls are made during testing, preventing the coverage tool from detecting the executed code.

    End-to-end tests should be written based on business logic and test plans. For coverage testing, unit tests should be used instead.

    ```bash
    # Manually reset E2E test database 
    $ db:test:reset

    # e2e tests
    $ bun test:e2e

    # Reset E2E test database, start the e2e test and remove the test-db after finishing the tests
    $ bun test:e2e-full
    ```

5. Create module, controller and provider
```bash
# Create module
$ nest g module module_name

# Create controller
$ nest g controller controller_name

# Create provider
$ nest g module provider_name

# Create resource
$ nest g resource resource_name

```

6. To create a resource that will automatically add module, controller and provider
```bash
# Create resource
$ nest g resource resource_name

```

7. Start local postgres database in Docker
```bash
# First time initialization
$ docker compose up dev-db -d

# Remove the container
$ docker compose down

# Start container
$ docker compose start

# Stop container
$ docker compose stop

# Stop with specific service
$ docker compose stop myservicename

# Remove the specific service
$ docker compose rm -f myservicename

```

8. Prisma migration
```bash
# list all options
$ npx prisma

# migration manual
$ npx prisma migrate --help

# Run dev migration from changes in Prisma schema, apply it to the database
# trigger generators (e.g. Prisma Client)
$ npx prisma migrate dev

# Deploy the pending migrations to the database
$ npx prisma migrate deploy

# Push the Prisma schema state to the database
$ prisma db push
```

9. Dev scripts
```bash
# Manually migrate schema and apply seeding data
$ bun prisma:dev:deploy

# Remove the dev database, then re-create a new dev database and apply prisma migration script with seeding data
# CAUTION! All the data will be lost.
$ bun db:dev:reset

```

## List of dendencies
1. Prisma for ORM
2. Zod for validation
3. Docker for development and deployment
