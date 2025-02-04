const  express = require("express")

function cfilerBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    }
}

module.exports = {
    cfilerBody
}