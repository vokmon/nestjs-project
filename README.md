

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJs project setup guideline with bun

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

## Test with Vite
