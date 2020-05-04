const express = require('express');
const app = express();

import chalk from "chalk";

import institutions from '../institutions';

import User from "../models/user.model";

module.exports = (passport) => {
	app.get(
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

	// 'GET returnURL'
	// `passport.authenticate` will try to authenticate the content returned in
	// query (such as authorization code). If authentication fails, user will be
	// redirected to '/' (home page); otherwise, it passes to the next middleware.
	app.get(
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
	app.post(
		'/auth/openid/return',
		function(req, res, next) {
			passport.authenticate('azuread-openidconnect', {
				response: res, // required
				failureRedirect: '/'
			})(req, res, next);
		},
		async function(req, res) {
			console.log(chalk.bgGreen.bold('/LOGIN'), req.user.displayName);
			await User.create(req.user.upn);
			res.redirect(req.body.state);
		}
	);

	// 'logout' route, logout from passport, and destroy the session with AAD.
	app.get('/logout', function(req, res) {
		console.log(chalk.bgRed.bold('/LOGOUT'), req.user.displayName);

		req.session.destroy(function(err) {
			req.logOut();
			res.redirect(req.query.redirect);
		});
	});

	return app;
};