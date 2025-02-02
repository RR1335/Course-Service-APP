const  express = require("express")
const  router = express.Router()

const { Article } = require("../../../models")

router.get('/', async function(req,res) {
try{
    const condition = {
        order:[['id','DESC']]
    }

    // 通过异步获取数据
    const articles = await Article.findAll(condition)

    res.json({
        status: true,
        message: "查询成功",
        data: {
            articles
        }
    })
}catch (err) {
    res.status(500).json({
        status: false,
        message:'查询失败',
        error: [err.message]
    })
}

})

module.exports = router
