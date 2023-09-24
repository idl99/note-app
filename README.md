# The Note app

A simple note taking app developed using Node.js, Express, MySQL, Sequelize and Redis.

## Dependencies

- Node.js: version 18

- MySQL: version 8

- Redis: version 7

- Docker (optional)

## Features

- User
  - Registration: Create an account using email/password
  - Login: Authenticates an user based on email/password and returns a JWT authentication token.
- Notes
  - Manage notes: Create, edit and delete Notes. Additionally, notes can also be categorized as Personal or Work notes.

## How to run the app?

You can clone the repo and run it in any of the following ways:

- You can run the whole application and its dependencies as a Docker Compose stack.

  This is probably the easiest way to run and serve the application. You don't need to have MySQL or Redis installed locally if you use this method. All you need to do is run `docker compose  up -d --build` . Once the application is built, it will run on `localhost:3000` . You can follow the logs for the following message: `Server is listening on port XXXX` to know when the application is up and running.

- Run it as a standalone application locally on the CLI

  You need to have your own MySQL and Redis servers running locally. A [sample .env](.sample.env) file is included in the repo which you may duplicated it and replace with the correct configuration values.

- You can build and run the application as a Docker container

  Similar to before. You can build using `docker build` and run the container using `docker run`.

## Explore the API

You can explore the API using Postman. There is a Postman collection called [`note-app.postman_collection.json`](api-docs/note-app.postman_collection.json) in the `api-docs` folder that you can import in Postman and run requests. Additionally, there are 2 collection variables, `BASE_URL` and `AUTH_TOKEN` that makes it easier to share these configurations across requests. You can edit them as necessary.

## Design

### Domain model

Pretty simple and straightforward just like the app and it's features :)

![Domain Model](https://github.com/idl99/note-app/assets/27432836/7b4ea9bd-5343-49de-a1cc-b79ea00a7d0f)

You might wonder why I don't have an aggregation/dependency between the Note and User entity? I have considered them as two different "Aggregates". If you're unfamiliar about Aggregate Roots, you can read more [here](https://martinfowler.com/bliki/DDD_Aggregate.html). By considering them as separate aggregates, I eliminate any transactional dependency between the two entity types. There is a "weak reference" from `User` to `Note`, as the `note.author` field corresponds to `user.id`.

### ERD

![ERD](https://github.com/idl99/note-app/assets/27432836/c90e7988-8a1b-4180-829b-e497e69760c4)

As explained earlier there is no one-to-many relationship between `users` and `notes` intentionally. This allows us to store notes and users in separate schemas, database servers or even database types (e.g. NoSQL) because there is no transactional dependency or strong consistency constraints between them. However, like the domain model there is a "weak reference" between the `users` and `notes` records, on the `author` column of the `notes` relation.

You might also wonder why I don't have a `note` and `categorized_notes` table, to mirror the domain model? I have opted for the **[Single Table inheritance pattern](https://martinfowler.com/eaaCatalog/singleTableInheritance.html)**. The reasons are:

- There are technical limitations described in points below, but from an application point of view it makes sense to keep things simple given the basic requirements of this note taking app. There are only two types of Notes: `(Uncategorized) Note` and `CategorizedNote`, and the only difference between them is the `category` property in CategorizedNote.
- Querying is easier and performant, especially because there is a requirement for a single endpoint to retrieve all notes irrespective of their type.
- All notes need to have a unique ID across the application, because we need to update or delete Notes using an ID. Following Concrete Table inheritance leaves the possibility of two different note types with the same ID (although it's unlikely because note IDs are randomly generated in this application).
- As mentioned in the article above, relational databases don't inherently support inheritance.
- Sequelize [doesn't support the Multi Table inheritance pattern](https://github.com/sequelize/sequelize/issues/10039) unlike some other popular ORM libraries elsewhere like Hibernate. They have [introduced Concrete Table inheritance starting from Sequelize v7](https://github.com/sequelize/sequelize/issues/6502), but v7 is currently in alpha and not stable at the time of writing. Therefore, this application had to be built using Sequelize v6 and Single Table inheritance.

Additionally, the `migration_meta` and `seeder_meta` are tables managed by a tool called [`umzug`](https://www.npmjs.com/package/umzug) that I have used to managed database migrations.

#### Database indexes

- `notes` table - `author` field since we frequently query notes by author.

- `users` table - `email` field since we frequently query user by email.

### Code organization

The code has been organized following the [Vertical Slice architecture](https://www.jimmybogard.com/vertical-slice-architecture/) and [Screaming architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html). Notice how `src` folder is organized around subdomains like Note taking and Authentication instead of services, controllers and repositories? Vertical Slice architecture was adopted instead of Clean or Hexagonal architecture since it is less rigid and allows faster development while maintaining reasonable level of cohesion and decoupling. However, the code also follows the Controller-Service-Repository pattern found in popular frameworks like Nest.js, Spring Boot, etc. to achieve clean separation of concerns.

### Low level design

#### Design patterns

- Dependency injection: I have implemented by own simple implementation of Dependency injection and Inversion of Control (IoC) container. Check the [`src/infra/ioc.js`](src\infra\ioc.js), [`src/infra/server.js`](src\infra\server.js) and [`src/noteTaking/index.js`](src\noteTaking\index.js) for how it has been implemented and used. The main reason why I chose to implement it is to make the code testable in future with unit and integration tests. In a real-world project I would use a DI using a framework/library like Nest.js or inversify instead of my own implementation.
- Factory pattern: in [`src/noteTaking/note.js`](src/noteTaking/note.js) and [`src/auth/user.js`](src/auth/user.js) for classes like `NoteFactory` and `UserFactory` are used to create domain entities like Note and User. They are used to perform business validations before entity creation, and to abstract away the logic of instantiating different entity types (e.g. instantiating a Note vs. CategorizedNote).
- Singleton pattern: classes like `Cache` and `Logger` implement the singleton pattern to ensure only one instance of theirs is used across the application.
- Builder pattern: it is used in the `ApiResponse` class in [`src/infra/apiResponse.js`](src\infra\apiResponse.js) to dynamically and programatically build the API response.
- Middleware pattern: in [`src/auth/authGuard.js`](src\auth\authGuard.js) to implement a middleware that verifies authenticated requests in routes where necessary, and in [`src/infra/errorMiddleware.js`](src\infra\errorMiddleware.js) for custom error handling.

### Other considerations/feature

- Database migrations and seed data using [umzug](https://www.npmjs.com/package/umzug), a companion library of Sequelize.
- I have used arbitrarily generated IDs as the unique identifiers for entity types with the idea of concealing database level IDs from external use. For speed of development, I ended using them as the primary IDs but the next step would be to introduce another primary ID field for the entities and use the current id values as a candidate/alternate key.

## Future improvements

-[ ] Introduce a standard logger like Winston. I wrote and started off with my own implementation since this is a practice project.

-[ ] Replace IDs with UUID type in MySQL instead of strings. I following a business-logic-first (or application-logic-first) approach when writing code and used nanoid.

-[ ] Parameterize the environment variables and secrets in the Docker Compose file.

-[ ] Add automated tests, starting off with integration tests and unit tests thereafter.

-[ ] Add more application level validations.
