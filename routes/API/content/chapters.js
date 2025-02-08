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
const {  BadRequest } = require('http-errors');
const {chapterClearCache} = require('../Middleware/chapterClearCache')
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
        throw new BadRequest('获取章节列表失败，课程ID不能为空。');
    }

    const condition = {
        ...getCondition(),
        where: {},
        order: [['rank', 'ASC'], ['id', 'ASC']],
        limit: pageSize,
        offset: offset
    };

    condition.where.courseId = query.courseId

    if (query.title) {
        condition.where.title = {
                [Op.like]: `%${ query.title }%`
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

        //创建章节
        const chapter = await Chapter.create(body)
        //章节创建成功后，章节数加一
        await Course.increment('chaptersCount',{where:{id:chapter.courseId}})

        // 清空缓存
        await chapterClearCache(chapter)
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

        //删除章节
        await chapter.destroy()
        // 章节统计减一
        await Course.decrement('chaptersCount',{where:{id:chapter.courseId}})

        //清空
        await chapterClearCache(chapter)
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

        //清空
        await chapterClearCache(chapter)
        success(res,"更新章节，成功！",{chapter})

    }catch (err) {
        failure(res, err)
    }
})




module.exports = router
