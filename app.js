'use strict';

require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import passport from 'passport';
import config from './config';
import connect from 'connect';
import path from 'path';

// GraphQL
import { GraphQLServer } from 'graphql-yoga';
import { default as resolvers } from './resolvers';
import { default as typeDefs } from './typeDefs';

// GraphQL Options
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

// GraphQL Context
const context = req => ({
  req: req.request
});

const server = new GraphQLServer({ typeDefs, resolvers, context });

// Azure
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

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
    // log.info("we are using user: ", user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

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


// Forward requests to /api/generate/resume to resumake to handle
var proxy = require('http-proxy-middleware');
server.express.use(
  '/api/generate/resume',
  proxy({ target: 'http://localhost:3001', changeOrigin: true })
);

server.express.use(require('body-parser').text());
server.express.use(methodOverride());
server.express.use(cookieParser());
server.express.use(connect());

server.express.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

// body parser stuff required to parse request bodies
server.express.use(bodyParser.urlencoded({ extended: true }));
server.express.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
server.express.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.use(express.static('public'));


// need to pass passport to routes to maintain state
const user = require('./routes/user')(passport);

server.express.use(user);

// Serve React build
server.express.use(express.static(path.join(__dirname + '/client/build')));

server.express.get('*', (req, res, next) => {
  // Handle graphql-yoga specific routes
  if (req.url == opts.playground || req.url == opts.subscriptions || req.url == opts.endpoint) {
    // Return next() so that the GraphQLServer will handle it
    return next();
  }

  // If the url matches the logo pattern we have
  if (req.url.match(/\/logos\/([1-9A-HJ-NP-Za-km-z]{22}).[a-z]{3}/g)) {
    res.sendFile(path.join(__dirname + req.url));
  }

  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.start(opts, () => console.log('Server is running on localhost:30662'));
