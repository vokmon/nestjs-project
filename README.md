

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
```bash
# unit tests
$ bun test:unit

# e2e tests
$ bun test:e2e

# test coverage
$ bun test:unit --coverage
$ bun test:e2e --coverage
```

5. Create module, controller and provider
```bash
# Create module
$ nest g module module_name

# Create controller
$ nest g controller controller_name

# Create provider
$ nest g module provider_name

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
