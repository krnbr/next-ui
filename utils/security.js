const jwt = require('./jwt-util');

function getUser(req, res, next) {
    if (req.session["user_access_token"]) {

        const content = {
            token: req.session["user_access_token"]
        };

        let formBody = [];
        for (let property in content) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(content
                [property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        const request_details = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        };

        const validateSession = async () => {
            await fetch('http://localhost:8080/oauth/check_token', request_details)
                .then(r => r.json())
                .then(data => jsonErrorCheck(data))
                .then(data => {
                    console.log("new Date().getTime() "+new Date().getTime());


                    res.locals.token = req.session["user_access_token"];

                    let dec = async () => {
                        await jwt.getDecodedToken(req.session["user_access_token"]);
                    };

                    let decodeToken = dec();

                    let now = Date.now()/1000;

                    console.log("now -> "+now);

                    if(now >= decodeToken.exp * 1000)

                    console.log("dec.exp -> "+ decodeToken.exp);

                    res.locals["user_data"] = data;
                    next()
                });
        }
        validateSession();
    } else {
        next()
    }
};

function jsonErrorCheck(data) {
    if('error' in data)
    {
        return data.error;
    }
    return data
}

module.exports = { getUser }
