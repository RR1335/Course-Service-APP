const  express = require("express")
const  router = express.Router()
const { Op } = require("sequelize")

const { Article } = require("../../../models")
const {filerBody}  = require("../Middleware/filter")
const {getArticles} = require('../Middleware/getarticles')
const {
        success,
        failure
    } = require('../../../utils/responses')


/**
 * 查询 全部文章
 */
router.get('/', async function(req,res) {
try{
    const query = req.query

    // 通过前端定义，获取分页数据
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const  offset = (currentPage - 1) * pageSize

    const condition = {
        where: {},
        order:[['id','DESC']],
        limit: pageSize,
        offset:offset
    }

    //已经 删除的文章list
    if (query.deleted === 'true') {
        condition.paranoid = false
        condition.where.deletedAt = {
            [Op.not]: null
        }
    }

    if (query.title) {
        condition.where.title = {
                [Op.like]:  `%${query.title}%`
        }
    }

    // 通过异步获取数据
    const { count,rows} = await Article.findAndCountAll(condition)

    res.json({
        status: true,
        message: "查询成功",
        data: {
            articles: rows,
            pagination: {
                total: count,
                currentPage: currentPage,
                pageSize: pageSize
            }
        }
    })
}catch (err) {
    failure(res,err)
}

})

/**
 * 查询特定文章
 */
router.get('/:id', async function(req,res) {
   try {
       const article = await getArticles(req)

       success(res,"查询文章，成功！",{article})
    }catch (err) {
       failure(res,err)
   }
})

/**
 * 新增文章
 */
router.post('/', async function(req,res) {
    try {
        const body = filerBody(req)

        const article = await Article.create(body)

        success(res, "新增文章，成功！", {article}, 201)

    }catch (err) {
        failure(res,err)
    }
})

/**
 * 删除文章——软删除
 */
router.post('/delete', async function (req, res) {
    try {
        const { id } = req.body;

        // req.body 可以 Array ，即：同时删除多个
        await Article.destroy({ where: { id: id } });

        success(res, '已删除到回收站。');
    } catch (error) {
        failure(res, error);
    }
});


router.post('/delDone',async function(req,res) {
    try {
        const {id} = req.body

        await Article.destroy({
            where: {id: id},
            force: true
        })
        success(res,'已经彻底删除')
    } catch (error) {
        failure(res,err)
    }
})

/**
 * 恢复文章
 */
router.post('/restore', async function (req, res) {
    try {
        const { id } = req.body;

        await Article.restore({ where: { id: id } });

        success(res, '已恢复成功。')
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新文章
 */
router.put('/:id', async function(req,res) {
    try{
        const article = await getArticles(req)

        const body = filerBody(req)
        await article.update(body)

        success(res,"更新文章，成功！",{article})

    }catch (err) {
        failure(res, err)
    }
})




module.exports = router
