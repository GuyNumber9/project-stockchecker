/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let likes = -1;

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        this.timeout(5000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 1);
          assert.isObject(res.body.stockData[0]);
          assert.property(res.body.stockData[0], 'stock');
          assert.isString(res.body.stockData[0].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[0], 'price');
          assert.isNumber(res.body.stockData[0].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[0], 'likes');
          assert.isNumber(res.body.stockData[0].likes, 'Expected res.body.stockData[0].likes to be a number');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        this.timeout(5000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 1);
          assert.isObject(res.body.stockData[0]);
          assert.property(res.body.stockData[0], 'stock');
          assert.isString(res.body.stockData[0].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[0], 'price');
          assert.isNumber(res.body.stockData[0].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[0], 'likes');
          assert.isNumber(res.body.stockData[0].likes, 'Expected res.body.stockData[0].likes to be a number');
          assert.isAtLeast(res.body.stockData[0].likes, 1, 'Expected res.body.stockData[0].likes to be at least 1');
          likes = res.body.stockData[0].likes;
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(5000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 1);
          assert.isObject(res.body.stockData[0]);
          assert.property(res.body.stockData[0], 'stock');
          assert.isString(res.body.stockData[0].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[0], 'price');
          assert.isNumber(res.body.stockData[0].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[0], 'likes');
          assert.isNumber(res.body.stockData[0].likes, 'Expected res.body.stockData[0].likes to be a number');
          assert.isAtLeast(res.body.stockData[0].likes, 1, 'Expected res.body.stockData[0].likes to be at least 1');
          assert.equal(res.body.stockData[0].likes, likes, 'Expected res.body.stockData[0].likes to be ' + likes + ' got ' + res.body.stockData[0].likes);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        this.timeout(5000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'], like: true})
        .end(function(err, res){
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.isObject(res.body.stockData[0]);
          assert.property(res.body.stockData[0], 'stock');
          assert.isString(res.body.stockData[0].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[0], 'price');
          assert.isNumber(res.body.stockData[0].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.isNumber(res.body.stockData[0].rel_likes, 'Expected res.body.stockData[0].rel_likes to be a number');
          

          assert.isObject(res.body.stockData[1]);
          assert.property(res.body.stockData[1], 'stock');
          assert.isString(res.body.stockData[1].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[1], 'price');
          assert.isNumber(res.body.stockData[1].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.isNumber(res.body.stockData[1].rel_likes, 'Expected res.body.stockData[0].rel_likes to be a number');
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        this.timeout(5000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'], like: true})
        .end(function(err, res){
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.isObject(res.body.stockData[0]);
          assert.property(res.body.stockData[0], 'stock');
          assert.isString(res.body.stockData[0].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[0], 'price');
          assert.isNumber(res.body.stockData[0].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.isNumber(res.body.stockData[0].rel_likes, 'Expected res.body.stockData[0].rel_likes to be a number');
          

          assert.isObject(res.body.stockData[1]);
          assert.property(res.body.stockData[1], 'stock');
          assert.isString(res.body.stockData[1].stock, 'Expected res.body.stockData[0].stock to be a string');
          assert.property(res.body.stockData[1], 'price');
          assert.isNumber(res.body.stockData[1].price, 'Expected res.body.stockData[0].price to be a number');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.isNumber(res.body.stockData[1].rel_likes, 'Expected res.body.stockData[0].rel_likes to be a number');
          done();
        });
      });
      
    });

});
