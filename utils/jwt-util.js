const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const ms = require('ms');

const dev = process.env.NODE_ENV !== 'production';

const downstream_basepath = dev ? "http://localhost:8080" : process.env.OAUTH_SERVER;

const client = jwksClient({
    strictSsl: true, // Default value
    jwksUri: downstream_basepath+'/.well-known/jwks.json',
    requestHeaders: {}, // Optional
    cache: true,
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: ms('10h'), // Default value
});

let signingKey = "";

const kid = 'neuw-key-id';
client.getSigningKey(kid, (err, key) => {
    signingKey = key.publicKey || key.rsaPublicKey;
    console.log("signingKey loaded inside jwt-utils");
});

function getDecodedToken(token) {

    jwt.verify(token, signingKey, {algorithms: ['RS256']}, function (err, decoded) {
        console.log("decoded -> "+JSON.stringify(decoded));
        console.log("decoded exp -> "+decoded["exp"]);
        return decoded;
    });

}

function getJWTPublicKey(){
    return signingKey;
}

module.exports = { getDecodedToken, getJWTPublicKey }
