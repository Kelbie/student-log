'use strict';

import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import passport from 'passport';
import bunyan from 'bunyan';
import config from './config';
import connect from 'connect';
import path from 'path';
import chalk from 'chalk';
require('dotenv').config();

// GraphQL
import { GraphQLServer } from 'graphql-yoga';
import { default as resolvers } from './resolvers';
import { default as typeDefs } from './typeDefs';

// PostgreSQL
import { Client } from 'pg';
import institutions from './institutions';
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASS,
  port: process.env.PGPORT
});

console.log(process.env);

client.connect();

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

var app = express();
var proxy = require('http-proxy-middleware');

server.express.use(
  '/api/generate/resume',
  proxy({ target: 'http://localhost:3001', changeOrigin: true })
);

server.express.use(require('body-parser').text());
server.express.set('views', __dirname + '/views');
server.express.set('view engine', 'ejs');
server.express.use(methodOverride());
server.express.use(cookieParser());
server.express.use(connect());

server.express.use(
  expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  })
);

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

  res.redirect(`/login${res.locals.redirect}`);
}

// server.express.get('/', function(req, res) {
//   console.log(req.user);
//   res.render('index', { user: req.user });
// });

// '/account' is only available to logged in user

server.express.get(
  '/login',
  function(req, res, next) {
    let redirect = req.query.redirect;
    let uni = req.query.uni;
    passport.authenticate('azuread-openidconnect', {
      response: res, // required
      // resourceURL: config.resourceURL, // optional. Provide a value if you want to specify the resource.
      customState: redirect, // optional. Provide a value if you want to provide custom state value.
      tenantIdOrName: institutions[uni].id,
      failureRedirect: '/'
    })(req, res, next);
  },
  function(req, res) {
    res.redirect('/');
  }
);

// server.express.get("/:any", function(req, res, next) {
//     res.locals.redirect = `?redirect=/${req.params.any}`
//     console.log(123,res.locals.redirect)
//     return next();
// }, ensureAuthenticated, function(req, res) {
//     res.redirect(`/${req.params.any}`)
// });

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
server.express.get(
  '/auth/openid/return',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
      response: res, // required
      failureRedirect: '/',
      tenantIdOrName: '51a0a69c-0e4f-4b3d-b642-12e013198635'
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
      failureRedirect: '/',
      tenantIdOrName: '51a0a69c-0e4f-4b3d-b642-12e013198635'
    })(req, res, next);
  },
  async function(req, res) {
    console.log(chalk.bgGreen.bold('/LOGIN'), req.user.displayName);
    await client.query(
      `
            INSERT INTO users (
                id
            ) VALUES (
                $1
            ) ON CONFLICT 
                DO NOTHING
        `,
      [req.user.upn]
    );
    res.redirect(req.body.state);
  }
);

// 'logout' route, logout from passport, and destroy the session with AAD.
server.express.get('/logout', function(req, res) {
  console.log(chalk.bgRed.bold('/LOGOUT'), req.user.displayName);

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

  console.log(req.url);
  if (req.url.match(/\/logos\/([1-9A-HJ-NP-Za-km-z]{22}).[a-z]{3}/g)) {
    console.log(123, path.join(__dirname + req.url));
    res.sendFile(path.join(__dirname + req.url));
  }

  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.start(opts, () => console.log('Server is running on localhost:30662'));
