const createError = require('http-errors');
const slugify = require("slugify");
const Blog = require('../models/blogModel');


const createBlog = async (blogData) => {
    try {
        const {
            title,
            image,
            medium,
            category,
            subject,
            studentHelp,
            description,
            authorName,
            authorEducationLevel,
            authorStudySubject,
            authorProfession,
            userId,
        } = blogData;

         if (!authorName || typeof authorName !== 'string' || authorName.trim().length === 0) {
            throw new Error("Author name is required and must be a non-empty string.");
        }
        // Generate initials
        const initials = authorName
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("");

        const existingBlogsCount = await Blog.countDocuments(); 
        const uniqueNumber = String(existingBlogsCount + 1).padStart(4, "0");

        blogData.blogCode = `${initials}-${uniqueNumber}`;

        // Create a new Blog 
        const newTuitionJob = await Blog.create({
            blogCode: blogData.blogCode,
            title,
            slug: slugify(title),
            image,
            medium,
            category,
            subject,
            studentHelp,
            description,
            authorName,
            authorEducationLevel,
            authorStudySubject,
            authorProfession,
            userId,
        });

        return newTuitionJob;
    } catch (error) {
        throw error;
    }
}

const getBlogs = async (page = 1, limit = 5, filter = {}) => {
    const blogs = await Blog.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!blogs) {
        throw createError(404, 'Blog Not Found')
    }
    const count = await Blog.find(filter).countDocuments();

    return {
        blogs,
        count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
    }
}

const getSingleBlog = async (slug) => {
    try {
        const blog = await Blog.findOne({ slug }).lean()
        if (!blog) throw createError(404, 'This Blog not found.')
        return blog
    } catch (error) {
        throw error;
    }
}

const updateBlogById = async (id, req) => {
    try {
        const updateOptions = { new: true, context: 'query' };
        let updates = {}
        const allowedFields = [
            'title',
            'medium',
            'category',
            'subject',
            'studentHelp',
            'description',
            'authorEducationLevel',
            'authorStudySubject',
            'authorProfession',
        ]
        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                if (key === 'title') {
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }
        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image file is too large. It must be less than 2 MB.")
            }
            updates.image = image.buffer.toString('base64')
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updates,
            updateOptions,
        )
        if (!updatedBlog) {
            throw createError(404, "Blog with this ID don's not exist.")
        }
        return updatedBlog;
    } catch (error) {
        throw error;
    }
}

const deleteBlogById = async (id) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: id });
        if (!blog) throw createError(404, 'This Blog Id is not found.')
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getSingleBlog,
    updateBlogById,
    deleteBlogById,
}