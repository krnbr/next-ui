const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {
        const server = express();

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
                username: 'system',
                password: 'system'
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
            fetch('http://localhost:8080/oauth/token', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody
            })
                .then(r => r.json())
                .then(data => jsonErrorCheck(data))
                .then(data => {
                    // Store JWT from response in cookies
                    /*res.cookie('app_context_tok', data.access_token, {
                        maxAge: 900000,
                        httpOnly: true
                    });*/

                    // store object in session (with express-session)

                    console.log("data.access_token -> "+data.access_token);

                    req.session.token = data.access_token;

                    return res.redirect('/home');
                });

        });

        server.get('/home', (req, res) => {
            const actualPage = '/home';
            app.render(req, res, actualPage, queryParams);
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
        return data;
    }
    return data
}
