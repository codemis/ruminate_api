/**
 * Requirements for all tests
 */
global.cheerio = require('cheerio');
var chai = require('chai');
global.expect = chai.expect;
process.env.NODE_ENV = 'testing';
var Config = require('./../env');
var config = new Config();
var supertest = require('supertest');
global.api = supertest('http://localhost:'+config.port);
