const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const ms = require('ms');

const client = jwksClient({
    strictSsl: true, // Default value
    jwksUri: 'http://localhost:8080/.well-known/jwks.json',
    requestHeaders: {}, // Optional
    cache: true,
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: ms('10h'), // Default value
});

let signingKey = "";

const kid = 'neuw-key-id';

let hard_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5ldXcta2V5LWlkIn0.eyJzdWIiOiIxc3lzdGVtIiwiYXVkIjpbIm5ldXdfYXBpX3Jlc291cmNlcyJdLCJ1c2VyX25hbWUiOiJzeXN0ZW0iLCJzY29wZSI6WyJzeXN0ZW0iXSwib3" +
    "JnYW5pemF0aW9uIjoic3lzdGVtIiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5hcGlzLm4ydy5pbiIsImV4cCI6MTU2MjI1MjY1OSwiYXV0aG9yaXRpZXMiOlsiU1lTVEVNIl0sImp0aSI6ImRhNmQ5ZTg3LTA1YmUtNDgzNy04ODhjLTMzOGJiM2Jk" +
    "YjgwZCIsImNsaWVudF9pZCI6InN5c3RlbV9uZXV3In0.P0ariz3pSAwkDKBkt9-3DWLIdMS-kykEZb6NxMMYzWJ0VBD1QZJjonTLC25UK81YjVnMOck-mMI6PznNP6KeX9ozq2E7c2shN5NgrQww3-Jt0swifzCdfNOKNYg3uaQR0aTW5A_pv2" +
    "x9eUmMlXfV_F78Z6JMOp1nUVVmC4I-It2VvLPOhOlA2dLqN5aRNyulZdfqLLB1gFsgvzWwZXCDcKAnJSx1rBd00KZSF4N9kKlt-6LcD7_3NpgFBAuuCEhmfzGWE5-q7PVL9OqEq7N3ols5ZBIpDXRj6VihLU9X7D_4HWUXlsweunkInU3rAO_L" +
    "Xwn8TmgkNCPauKBeszXMSg";

let token2 = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5ldXcta2V5LWlkIn0.eyJzdWIiOiIxc3lzdGVtIiwiYXVkIjpbIm5ldXdfYXBpX3Jlc291cmNlcyJdLCJ1c2VyX25hb" +
    "WUiOiJzeXN0ZW0iLCJzY29wZSI6WyJzeXN0ZW0iXSwib3JnYW5pemF0aW9uIjoic3lzdGVtIiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5hcGlzLm4ydy5pbiIsImV4cCI6MTU2MjI3Mjg5NCwiYXV" +
    "0aG9yaXRpZXMiOlsiU1lTVEVNIl0sImp0aSI6ImY4NjIyZWM4LTgzODktNDdhOC04NzdmLTBjODBhNmY1ZmQ4ZiIsImNsaWVudF9pZCI6InN5c3RlbV9uZXV3In0.SjZPbVLcQXMeFMMKw3GRu" +
    "RJOQjRTQ5C8Nm_GGWrySDHJ5iPtOhbCEaea25MxxAXy0oEhXjA-ajZk1h8dRD3moqSF91VaLpEj0xrtdbWG1mGInq9f5vzGUVQ6GxGr1DDyVrFjZbLEzVP3kgW-YHGzxgbmYO1lg16iM6kMAwG" +
    "CJ2-yN2k7oV464nH8bFq6CN2fgAh2plWMxuu8PyplZZ_cITjtQ1Z5oKBzM9ElArHQ15nGSmcyr_A7fE3zsbmUwZSKhvSHF2-6L8BqCj6UrIvtRj0zJLSObpvcrJKcawb1jymKlyVv7929xwUl6" +
    "1oDFrGl4lQzK7g6oU1RvIbDJqa_bg";

client.getSigningKey(kid, (err, key) => {
    signingKey = key.publicKey || key.rsaPublicKey;

    console.log("signingKey -> "+signingKey);

    jwt.verify(hard_token , signingKey, { algorithms: ['RS256'] }, function(err, decoded) {
        if(err instanceof jwt.TokenExpiredError){
            console.log(err.expiredAt);
            return;
        }
        console.log(decoded["user_name"]);
    });

});
