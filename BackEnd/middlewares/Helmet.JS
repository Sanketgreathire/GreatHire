const express = require('express');
const helmet = require('helmet');

module.exports = function(app) {
    app.use(helmet());

    // Additional Helmet configurations
    app.use(helmet.hidePoweredBy()); // Hide X-Powered-By header
    app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
    app.use(helmet.xssFilter()); // Enable XSS filter
    app.use(helmet.noSniff()); // Prevent MIME type sniffing
    app.use(helmet.ieNoOpen()); // Set X-Download-Options for IE8+
    app.use(helmet.hsts({ maxAge: 31536000 })); // HTTP Strict Transport Security
};
