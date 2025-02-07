const  express = require("express")
const  router = express.Router()
const { Op } = require("sequelize")

const { Category,Course} = require("../../../models")
const {cfilerBody}  = require("../Middleware/Cfilter")
const {getCategory} = require('../Middleware/getcategory')
const {
        success,
        failure
    } = require('../../../utils/responses')


/**
 * 查询分类 All
 */
router.get('/', async function (req, res) {
    try {
        const query = req.query;

        const condition = {
            where: {},
            order: [['rank', 'ASC'], ['id', 'ASC']],
        };

        if (query.name) {
            condition.where.name = {
                [Op.like]: `%${ query.name }%`
            };
        }

        const categories = await Category.findAll(condition);
        success(res, '查询分类列表成功。', {
            categories: categories,
        });
    } catch (error) {
        failure(res, error);
    }
});




/**
 * 查询 全部分类
 */
// router.get('/', async function(req,res) {
// try{
//     const query = req.query
//
//     // 通过前端定义，获取分页数据
//     const currentPage = Math.abs(Number(query.currentPage)) || 1
//     const pageSize = Math.abs(Number(query.pageSize)) || 10
//
//     const  offset = (currentPage - 1) * pageSize
//
//     const condition = {
//         where:{},
//         order:[['id','DESC']],
//         limit: pageSize,
//         offset:offset
//     }
//
//     if (query.name) {
//         condition.where.name = {
//                 [Op.like]:  `%${query.name}%`
//         }
//     }
//
//     // 通过异步获取数据
//     const { count,rows} = await Category.findAndCountAll(condition)
//
//     res.json({
//         status: true,
//         message: "查询成功",
//         data: {
//             category: rows,
//             pagination: {
//                 total: count,
//                 currentPage: currentPage,
//                 pageSize: pageSize
//             }
//         }
//     })
// }catch (err) {
//     failure(res,err)
// }
//
// })

/**
 * 查询特定分类
 */
router.get('/:id', async function(req,res) {
   try {
       const category = await getCategory(req)

       success(res,"查询分类，成功！",{category})
    }catch (err) {
       failure(res,err)
   }
})

/**
 * 新增分类
 */
router.post('/', async function(req,res) {
    try {
        const body = cfilerBody(req)

        const category = await Category.create(body)

        success(res, "新增分类，成功！", {category}, 201)

    }catch (err) {
        failure(res,err)
    }
})

/**
 * 删除分类
 */
router.delete('/:id', async function(req,res) {
    try{
        const category = await getCategory(req)

        // 判断是否有关联的课程，有则终止删除
        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }



        await category.destroy()

        success(res,"删除分类，成功！")


    }catch (err) {
        failure(res, err)
    }
})

/**
 * 更新分类
 */
router.put('/:id', async function(req,res) {
    try{
        const category = await getCategory(req)

        const body = cfilerBody(req)
        await category.update(body)

        success(res,"更新分类，成功！",{category})

    }catch (err) {
        failure(res, err)
    }
})




module.exports = router
