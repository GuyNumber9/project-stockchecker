/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");

var axios = require("axios").default;

var Likes = require("../models/Likes").model;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    let stock = Array.isArray(req.query.stock)
      ? req.query.stock
      : [req.query.stock];
    //res.send("done");
    let requests = [];
    stock.forEach(function(symbol) {
      requests.push(
        axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${symbol}/quote`)
      );
    });

    axios.all(requests).then(
      function onfulfilled(value) {
        if (value.length > 1) {
          if (req.query.like) {
            let likePromises = [];
            value.forEach(function(v) {
              let likePromise = Likes.findOneAndUpdate(
                {
                  stock: v.data.symbol,
                  ip: req.ip
                },
                {},
                {
                  upsert: true,
                  new: true,
                  useFindAndModify: false
                }
              );
              likePromises.push(likePromise.exec());
            });

            Promise.all(likePromises).then(
              function onfulfilled(docs) {
                let aggregatePromises = [];
                docs.forEach(function(doc) {
                  let aggregatePromise = Likes.aggregate([
                    {
                      '$match': {
                        'stock': doc.stock
                      }
                    }, {
                      '$count': 'likes'
                    },
                    {
                      '$project': {
                        'stock': doc.stock,
                        'likes': true
                      }
                    }
                  ]).exec();

                  aggregatePromises.push(aggregatePromise);
                });

                
                Promise.all(aggregatePromises).then(
                  function onfulfilled(docs2) {
                    let likeMap = docs2.reduce((previousValue, currentValue) => {
                      if(currentValue[0]){
                        previousValue[currentValue[0].stock] = currentValue[0].likes;
                      }
                      return previousValue;
                    }, {});
 
                    let response = {
                      stockData: []
                    };
                    value.forEach(function(v) {
                      response.stockData.push({
                        stock: v.data.symbol,
                        price: v.data.latestPrice,
                        likes: likeMap[v.data.symbol] || 0
                      });
                    });

                    response.stockData[0].rel_likes = response.stockData[0].likes - response.stockData[1].likes;
                    response.stockData[1].rel_likes = response.stockData[1].likes - response.stockData[0].likes;

                    delete response.stockData[0].likes;
                    delete response.stockData[1].likes;

                    res.json(response);
                  },
                  function onrejected(reason) {
                    res.send(reason);
                  }
                );
              },
              function onrejected(reason) {
                res.send(reason);
              }
            );
          }
          else {
            let aggregatePromises = [];
                value.forEach(function(val) {
                  let aggregatePromise = Likes.aggregate([
                    {
                      '$match': {
                        'stock': val.data.symbol
                      }
                    }, {
                      '$count': 'likes'
                    },
                    {
                      '$project': {
                        'stock': val.data.symbol,
                        'likes': true
                      }
                    }
                  ]).exec();

                  aggregatePromises.push(aggregatePromise);
                });

                
                Promise.all(aggregatePromises).then(
                  function onfulfilled(docs2) {
                    let likeMap = docs2.reduce((previousValue, currentValue) => {
                      if(currentValue[0]){
                        previousValue[currentValue[0].stock] = currentValue[0].likes;
                      }
                      return previousValue;
                    }, {});
                    let response = {
                      stockData: []
                    };
                    value.forEach(function(v) {
                      response.stockData.push({
                        stock: v.data.symbol,
                        price: v.data.latestPrice,
                        likes: likeMap[v.data.symbol] || 0
                      });
                    });

                    response.stockData[0].rel_likes = response.stockData[0].likes - response.stockData[1].likes;
                    response.stockData[1].rel_likes = response.stockData[1].likes - response.stockData[0].likes;

                    delete response.stockData[0].likes;
                    delete response.stockData[1].likes;

                    res.json(response);
                  },
                  function onrejected(reason) {
                    res.send(reason);
                  }
                );
          }
        } else {
          if (req.query.like) {
            Likes.findOneAndUpdate(
              {
                stock: value[0].data.symbol,
                ip: req.ip
              },
              {},
              {
                upsert: true,
                new: true,
                useFindAndModify: false
              },
              function likeCallback(err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  Likes.aggregate(
                    [
                      {
                        $match: {
                          stock: value[0].data.symbol
                        }
                      },
                      {
                        $count: "likes"
                      }
                    ],
                    function countCallback(err2, doc2) {
                      let response = {
                        stockData: []
                      };

                      if (err2) {
                        res.send(err2);
                      } else {
                        response.stockData.push({
                          stock: value[0].data.symbol,
                          price: value[0].data.latestPrice,
                          likes: doc2[0].likes || 0
                        });
                        res.json(response);
                      }
                    }
                  );
                }
              }
            );
          } else {
            Likes.aggregate(
              [
                {
                  $match: {
                    stock: value[0].data.symbol
                  }
                },
                {
                  $count: "likes"
                }
              ],
              function countCallback(err2, doc2) {
                let response = {
                  stockData: []
                };

                if (err2) {
                  res.send(err2);
                } else {
                  response.stockData.push({
                    stock: value[0].data.symbol,
                    price: value[0].data.latestPrice,
                    likes: doc2[0].likes || 0
                  });
                  res.json(response);
                }
              }
            );
          }
        }
      },
      function onrejected(reason) {
        res.send(reason);
      }
    );
  });
};
