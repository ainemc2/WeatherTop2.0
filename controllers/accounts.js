"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    const password = userstore.getUserByPassword(request.body.password);
    if (user && password) {
      response.cookie("station", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },
  
  account(request, response) {
    const user = userstore.getUserByEmail(request.cookies.station);
    const viewData = {
      title: "Account details",
      user: user
    };
    response.render("accountdetails", viewData);
  },
  
  updatedetails(request, response) {
    const userId = request.params.id;
    const user = userstore.getUserById(userId);
    const newUser = {
      firstName: request.body.firstName,
      email: request.body.email,
      lastName: request.body.lastName,
      password: request.body.password
    };
    userstore.updateUser(user, newUser);
    response.redirect("/login");
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.station;
    if (userEmail) {
      return userstore.getUserByEmail(userEmail);
    } else {
      return null;
    }
  }

};

module.exports = accounts;
