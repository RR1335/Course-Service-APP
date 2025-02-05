const  express = require("express")
const  router = express.Router()
const { Op } = require("sequelize")

const { Chapter, Course } = require("../../../models")
const {cpfilterBody}  = require("../Middleware/cpfilter")
const {getChapters,getCondition} = require('../Middleware/getChapter')
const {
        success,
        failure
    } = require('../../../utils/responses')

/**
 * 查询 全部章节
 */
router.get('/', async function(req,res) {
try{
    const query = req.query

    // 通过前端定义，获取分页数据
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const  offset = (currentPage - 1) * pageSize

    if (!query.courseId) {
        throw new Error('获取章节列表失败，课程ID不能为空。');
    }

    const condition = {
        ...getCondition(),
        order: [['rank', 'ASC'], ['id', 'ASC']],
        limit: pageSize,
        offset: offset
    };

    condition.where = {
        courseId: {
            [Op.eq]: query.courseId
        }
    };

    if (query.title) {
        condition.where = {
            title: {
                [Op.like]: `%${ query.title }%`
            }
        };
    }


    // 通过异步获取数据
    const { count,rows} = await Chapter.findAndCountAll(condition)

    res.json({
        status: true,
        message: "查询成功",
        data: {
            chapters: rows,
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
 * 查询特定章节
 */
router.get('/:id', async function(req,res) {
   try {
       const chapter = await getChapters(req)

       success(res,"查询章节，成功！",{chapter})
    }catch (err) {
       failure(res,err)
   }
})

/**
 * 新增章节
 */
router.post('/', async function(req,res) {
    try {
        const body = cpfilterBody(req)

        const chapter = await Chapter.create(body)

        success(res, "新增章节，成功！", {chapter}, 201)

    }catch (err) {
        failure(res,err)
    }
})

/**
 * 删除章节
 */
router.delete('/:id', async function(req,res) {
    try{
        const chapter = await getChapters(req)


        await chapter.destroy()

        success(res,"删除章节，成功！")


    }catch (err) {
        failure(res, err)
    }
})

/**
 * 更新章节
 */
router.put('/:id', async function(req,res) {
    try{
        const chapter = await getChapters(req)

        const body = cpfilterBody(req)
        await chapter.update(body)

        success(res,"更新章节，成功！",{chapter})

    }catch (err) {
        failure(res, err)
    }
})




module.exports = router
