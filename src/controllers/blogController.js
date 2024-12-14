const createError = require('http-errors');
const slugify = require("slugify")
const { successResponse } = require("../Helper/responseController");
const { getBlogs, getSingleBlog, updateBlogById, deleteBlogById } = require('../services/blogService');

const handelGetBlogs = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        const filter = {
            $or: [
                { title: { $regex: searchRegExp } },
                { category: { $regex: searchRegExp } },
                { subject: { $regex: searchRegExp } },
                { authorName: { $regex: searchRegExp } },
            ]
        }

        const blogData = await getBlogs(page, limit, filter)

        return successResponse(res, {
            statusCode: 201,
            message: `Return all Blog successfully.`,
            payload: {
                blogs: blogData.blogs,
                pagination: {
                    totalPage: blogData.totalPage,
                    currentPage: blogData.currentPage,
                    previousPage: page - 1,
                    nextPage: page + 1,
                    totalNumberOfBlog: blogData.count
                }
            },
        })
    } catch (error) {
        next(error)
    }
}

const handelGetSingleBlog = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const blog = await getSingleBlog(slug);
        return successResponse(res, {
            statusCode: 201,
            message: `Return Blog successfully.`,
            payload: { blog }
        }
        )
    } catch (error) {
        next(error)
    }
}

const handelUpdateBlog = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateBlog = await updateBlogById(id, req);

        return successResponse(res, {
            statusCode: 201,
            message: `Return update blog successfully.`,
            payload: { updateBlog }
        }
        )
    } catch (error) {
        next(error)
    }
}

const handelDeleteBlog = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteBlogById(id);
        return successResponse(res, {
            statusCode: 201,
            message: `Delete were blog successfully.`,
        }
        )
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handelGetBlogs,
    handelGetSingleBlog,
    handelUpdateBlog,
    handelDeleteBlog,
}