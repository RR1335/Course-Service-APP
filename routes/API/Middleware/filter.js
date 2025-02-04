const  express = require("express")

function filerBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

module.exports = {
    filerBody
}