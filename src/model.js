require('dotenv').config()

exports.getMapsApiKey = (req, res, next) => {
    req.log.info('Bunyan log: getMapsApiKey');
    if (process?.env?._GOOGLE_MAPS_API_KEY) {
        console.debug("sending back api key: ", process.env._GOOGLE_MAPS_API_KEY);
        req.log.info("sending back api key: ", process.env._GOOGLE_MAPS_API_KEY);
        return res.send({
            status: "ok",
            apiKey: process.env._GOOGLE_MAPS_API_KEY
        });
    }
    else {
        req.log.info("No process.env: ", process.env);
        return  res.send({
        status: "not ok",
        apiKey: "abc123"
    });
    }

};

