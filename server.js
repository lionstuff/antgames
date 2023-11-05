'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverFactory = void 0;
var fastify_1 = require("fastify");
var serverFactory = function (options) {
    if (options === void 0) { options = {}; }
    var app = (0, fastify_1.default)(options);
    app.register(Promise.resolve().then(function () { return require('@fastify/cors'); }), {
        // put your options here
        origin: [
            /** @localhost */
            "".concat(process.env.CLIENT_HOST, ":").concat(process.env.CLIENT_PORT),
            'https://127.0.0.1:5050',
            'https://localhost:5050',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
            'https://127.0.0.1:8080',
            'https://localhost:8080',
        ],
        sessionPlugin: '@fastify/secure-session',
    });
    return app;
};
exports.serverFactory = serverFactory;
