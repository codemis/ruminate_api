/**
 * Requirements for all tests
 */
global.cheerio = require('cheerio');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
global.expect = chai.expect;
process.env.NODE_ENV = 'testing';
var Config = require('./../env');
/**
 * The Sequelize Model Object
 *
 * @type {Sequelize}
 */
global.models = require('../db/models/index');
var config = new Config();
var supertest = require('supertest');
global.api = supertest('http://localhost:'+config.port);
