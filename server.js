let sec = require('./utils/security');
let jwt_utils = require('./utils/jwt-util');

const express = require('express');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ms = require('ms');

const next = require('next');

const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const downstream_basepath = dev ? "http://localhost:8080" : process.env.OAUTH_SERVER;

let cookieSecret = process.env.COOKIE_SECRET ? process.env.COOKIE_SECRET : "COOKIE_SECRET";
const cookieParams = {
    httpOnly: true,
    signed: dev,
    maxAge: ms('365d'),
    sameSite: true,
    secure: !dev
};
//const cookieEncrypter = require('cookie-encrypter');

app
    .prepare()
    .then(() => {
        const server = express();

        server.use(cookieParser(cookieSecret));
        //server.use(cookieEncrypter(cookieSecret));
        server.use(bodyParser.json());
        server.use(session({
            secret: 'super-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 60000 }
        }));

        server.get('/login', (req, res) => {
            const callback = {
                grant_type: 'password',
                client_id: process.env.API_CLIENT_ID ? process.env.API_CLIENT_ID : 'system_neuw',
                client_secret: process.env.API_CLIENT_SECRET ? process.env.API_CLIENT_SECRET : 'system_neuw',
                //redirect_uri: process.env.API_REDIRECT_URI,
                username: 'user',
                password: 'password'
                //code: req.query.code
            };

            let formBody = [];
            for (let property in callback) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(callback
                    [property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            // Query API for token
            fetch(downstream_basepath+'/oauth/token', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody
            })
                .then(r => r.json())
                .then(data => jsonErrorCheck(data))
                .then(data => {

                    jwt.verify(data.access_token, jwt_utils.getJWTPublicKey, { algorithms: ['RS256'] }, function(err, decoded) {
                        console.log(decoded["user_name"])
                    });

                    console.log("data.access_token -> "+data["access_token"]);
                    console.log("data.refresh_token -> "+data["refresh_token"]);

                    // store object in session (with express-session)
                    req.session["user_access_token"] = data["access_token"];

                    res.cookie("nekot", data["refresh_token"], cookieParams);

                    return res.redirect('/home');
                });

        });

        server.get('/dashboard', sec.getUser, (req, res) => {
            return app.render(req, res, '/dashboard', { token: res.locals.token, user: res.locals.user })
        });

        server.get('/home', (req, res) => {
            const actualPage = '/';
            let user_access_token = req.session["user_access_token"];
            console.log(user_access_token);
            console.log("accessed home");
            app.render(req, res, actualPage);
        });

        server.get('/p/:id', (req, res) => {
            const actualPage = '/post';
            const queryParams = { id: req.params.id };
            app.render(req, res, actualPage, queryParams);
        });

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });

function jsonErrorCheck(data) {
    if('error' in data)
    {
        return data.error;
    }
    return data
}

// TODO verify and check logged in user's token etc
