# PizzaUp!

Order pizza for your meetup event!

## Quick Start

1. Clone
1. Install dependencies - `npm install`
1. Run server - `nodemon`
1. Test - `mocha` (WIP)
1. Coverage - `npm run cov` (WIP)

## Development Workflow (WIP)

1. Create feature branch
1. Develop/test locally (hack! hack! hack!)
1. Create PR, which triggers https://semaphoreci.com/
1. After tests pass, merge the PR
1. Tests run again on https://semaphoreci.com/
1. Once tests pass, code is deployed automatically to staging server on Heroku

> Make sure to add tests with each PR. Your PR must **not*- decrease the test coverage percentage.

## Tests (WIP)

Without code coverage:

```sh
$ npm test
```

With code coverage:

```sh
$ npm run cov
```

## User Stories (WIP)

## Stack

- Issue Tracker: Github Issues
- Build System: Gulp (WIP)
- Auth: N/A
- Testing: Mocha, Chai, https://semaphoreci.com/, Istanbul (WIP)
- Language Runtime: ES5
- Package Mgmt: npm
- Server: Node, Express
- Database: N/A
- Front End: Angular
- CSS Framework: Bootstrap
- Templates: Angular
