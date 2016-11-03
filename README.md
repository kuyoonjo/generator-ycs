# generator-ycs 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> An Express Restful API Server

## Dependencies

- [MongoDB](https://www.mongodb.com)
- [GraphicsMagick](http://www.graphicsmagick.org) *(optional)*

## Installation

First, install [Yeoman](http://yeoman.io) and generator-ycs using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ycs
```

Then generate your new project:

```bash
yo ycs [appName]
```

## Commands

- [Initialize App](#initialize-app)
- [Add API](#add-api)

## Initialize App

```bash
yo ycs [appName]
```

## Add API

```bash
yo ycs:api [apiName] [endpoint=/xxx/xxx] [--file] [--image]
```



## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Yu Chen]()


[npm-image]: https://badge.fury.io/js/generator-ycs.svg
[npm-url]: https://npmjs.org/package/generator-ycs
[travis-image]: https://travis-ci.org/kuyoonjo/generator-ycs.svg?branch=master
[travis-url]: https://travis-ci.org/kuyoonjo/generator-ycs
[daviddm-image]: https://david-dm.org/kuyoonjo/generator-ycs.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/kuyoonjo/generator-ycs
[coveralls-image]: https://coveralls.io/repos/kuyoonjo/generator-ycs/badge.svg
[coveralls-url]: https://coveralls.io/r/kuyoonjo/generator-ycs
