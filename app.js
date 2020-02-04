/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the 'Software'), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

/******************************************************************************
 * Module dependencies.
 *****************************************************************************/

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var util = require('util');
var bunyan = require('bunyan');
var config = require('./config');
var connect = require('connect');
const path = require('path');
var http = require('http');

// set up database for express session
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');

import latex from 'node-latex';

import ical from 'node-ical';

// GraphQL
import { GraphQLServer } from 'graphql-yoga';
import { default as resolvers } from './resolvers';
import { default as typeDefs } from './typeDefs';

const opts = {
  port: 30662,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
  cors: {
    credentials: true,
    origin: ['http://localhost:30662'] // your frontend url.
  }
};

const context = req => ({
  req: req.request
});

const server = new GraphQLServer({ typeDefs, resolvers, context });

// Start QuickStart here

var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var log = bunyan.createLogger({
  name: 'Microsoft OIDC Example Web Application'
});

/******************************************************************************
 * Set up passport in the app
 ******************************************************************************/

//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------
passport.serializeUser(function(user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function(oid, done) {
  findByOid(oid, function(err, user) {
    done(err, user);
  });
});

// array to hold logged in users
var users = [];

var findByOid = function(oid, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    log.info('we are using user: ', user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
//
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
//
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(
  new OIDCStrategy(
    {
      identityMetadata: config.creds.identityMetadata,
      clientID: config.creds.clientID,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      redirectUrl: config.creds.redirectUrl,
      allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
      clientSecret: config.creds.clientSecret,
      validateIssuer: config.creds.validateIssuer,
      isB2C: config.creds.isB2C,
      issuer: config.creds.issuer,
      passReqToCallback: config.creds.passReqToCallback,
      scope: config.creds.scope,
      loggingLevel: config.creds.loggingLevel,
      nonceLifetime: config.creds.nonceLifetime,
      nonceMaxAmount: config.creds.nonceMaxAmount,
      useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
      cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
      clockSkew: config.creds.clockSkew
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      if (!profile.oid) {
        return done(new Error('No oid found'), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function() {
        findByOid(profile.oid, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  )
);

//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
var app = express();
var proxy = require('http-proxy-middleware');

server.express.use(
  '/api/generate/resume',
  proxy({ target: 'http://localhost:3001', changeOrigin: true })
);

server.express.set('views', __dirname + '/views');
server.express.set('view engine', 'ejs');
server.express.use(methodOverride());
server.express.use(cookieParser());
server.express.use(connect());

// set up session middleware
// if (config.useMongoDBSessionStore) {
//   mongoose.connect(config.databaseUri);
//   app.use(express.session({
//     secret: 'secret',
//     cookie: {maxAge: config.mongoDBSessionMaxAge * 1000},
//     store: new MongoStore({
//       mongooseConnection: mongoose.connection,
//       clear_interval: config.mongoDBSessionMaxAge
//     })
//   }));
// } else {
server.express.use(
  expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  })
);
// }

server.express.use(bodyParser.urlencoded({ extended: true }));
// server.express.use(bodyParser.json())

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.use(express.static(__dirname + '/../../public'));

//-----------------------------------------------------------------------------
// Set up the route controller
//
// 1. For 'login' route and 'returnURL' route, use `passport.authenticate`.
// This way the passport middleware can redirect the user to login page, receive
// id_token etc from returnURL.
//
// 2. For the routes you want to check if user is already logged in, use
// `ensureAuthenticated`. It checks if there is an user stored in session, if not
// it will call `passport.authenticate` to ask for user to log in.
//-----------------------------------------------------------------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// '/account' is only available to logged in user
server.express.get('/account', ensureAuthenticated, function(req, res) {
  console.log(req.session);
  res.render('account', { user: req.user });
});

server.express.get(
  '/login',
  function(req, res, next) {
    let redirect = req.query.redirect;
    passport.authenticate('azuread-openidconnect', {
      response: res, // required
      customState: redirect, // optional. Provide a value if you want to provide custom state value.
      // tenantIdOrName: '51a0a69c-0e4f-4b3d-b642-12e013198635',
      failureRedirect: '/'
    })(req, res, next);
  },
  function(req, res) {
    log.info('Login was called in the Sample');
    res.redirect('/');
  }
);

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
server.express.get(
  '/auth/openid/return',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
      response: res, // required
      failureRedirect: '/'
    })(req, res, next);
  },
  function(req, res) {
    log.info('We received a return from AzureAD.');
    res.redirect(req.body.state);
  }
);

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
server.express.post(
  '/auth/openid/return',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
      response: res, // required
      failureRedirect: '/'
    })(req, res, next);
  },
  function(req, res) {
    log.info('We received a return from AzureAD.');
    res.redirect(req.body.state);
  }
);

// 'logout' route, logout from passport, and destroy the session with AAD.
server.express.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    req.logOut();
    res.redirect(req.query.redirect);
  });
});

server.express.use(express.static(path.join(__dirname + '/client/build')));

server.express.get('*', (req, res, next) => {
  // Handle graphql-yoga specific routes
  if (req.url == opts.playground || req.url == opts.subscriptions || req.url == opts.endpoint) {
    // Return next() so that the GraphQLServer will handle it
    return next();
  }
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.start(opts, () => console.log('Server is running on localhost:30662'));
