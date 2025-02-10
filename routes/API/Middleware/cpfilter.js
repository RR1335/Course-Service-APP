const  express = require("express")

function cpfilterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank,
        free: req.body.free,
    };
}
module.exports = {
    cpfilterBody
}