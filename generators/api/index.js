'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var pluralize = require('pluralize');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    if (!this.config.get('appName')) {
      this.log(chalk.yellow('App dir not found!'));
      process.exit(0);
    }

    this.argument('apiName', {
      type: String,
      required: false
    });
    this.option('endpoint');
    this.option('file');
    this.option('image');

    if (this.apiName) {
      this.endpoint = this.options.endpoint || '/api/' + pluralize(this.apiName);
      this.withFile = this.options.file;

      if (this.options.image) {
        this.withFile = this.options.file || true;
        this.isImage = this.options.image;
      }
    }
  },

  prompting: function () {
    if (!this.apiName) {
      var prompts = [
        {
          type: 'input',
          name: 'apiName',
          message: 'API Name:',
          default: 'thing'
        },
        {
          type: 'input',
          name: 'endpoint',
          message: 'endpoint:',
          default: function (response) {
            return '/api/' + pluralize(response.apiName);
          }
        },
        {
          type: 'confirm',
          name: 'withFile',
          message: 'with file upload:',
          default: false
        },
        {
          when: function (response) {
            return response.withFile;
          },
          type: 'confirm',
          name: 'isImage',
          message: 'is type image:',
          default: false
        }
      ];

      return this.prompt(prompts).then(function (props) {
        this.apiName = props.apiName;
        this.endpoint = props.endpoint;
        this.withFile = props.withFile;
        this.isImage = props.isImage;
      }.bind(this));
    }
  },

  writing: function () {
    var dest = this.destinationPath('src/api/' + this.apiName);
    if (fs.existsSync(dest)) {
      return this.log(chalk.yellow(`API ${this.apiName} already exists`));
    }

    var tpl;
    if (this.isImage) {
      tpl = this.templatePath('image');
    } else if (this.withFile) {
      tpl = this.templatePath('file');
    } else {
      tpl = this.templatePath('simple');
    }

    this.className = _.capitalize(_.camelCase(this.apiName));

    this.fs.copyTpl(tpl, dest, {
      className: this.className,
      classNamePlural: pluralize(this.className),
      apiName: this.apiName,
      endpoint: this.endpoint
    });
  }
});
