import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const booleanQuery = (value) => value === 'true' ? true : value === 'false' ? false : null;

export async function getBlogs(req, res) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, Number.parseInt(req.query.limit, 10) || 6));
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const featured = booleanQuery(req.query.featured);
    const sort = req.query.popular === 'true' || req.query.sort === 'popular' ? 'popular' : 'latest';
    const filter = { status: 'published' };

    if (category && category.toLowerCase() !== 'all') filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
    if (featured !== null) filter.featured = featured;
    if (search) {
      const regex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ title: regex }, { category: regex }, { tags: regex }];
    }

    const blogs = getDB().collection('blogs');
    const projection = { content: 0 };
    const sortBy = sort === 'popular' ? { views: -1, likes: -1, publishedAt: -1 } : { publishedAt: -1, _id: -1 };
    const [articles, total, featuredArticle, popularArticles] = await Promise.all([
      blogs.find(filter, { projection }).sort(sortBy).skip((page - 1) * limit).limit(limit).toArray(),
      blogs.countDocuments(filter),
      blogs.findOne({ status: 'published', featured: true }, { projection, sort: { publishedAt: -1 } }),
      blogs.find({ status: 'published' }, { projection }).sort({ views: -1, likes: -1, publishedAt: -1 }).limit(5).toArray()
    ]);

    return sendSuccess(res, 200, 'Blogs retrieved successfully', {
      articles,
      featured: featuredArticle,
      popular: popularArticles,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
    });
  } catch (error) {
    console.error('Get blogs failed:', error.message);
    return sendError(res, 500, 'Failed to get blogs');
  }
}

export async function getBlogBySlug(req, res) {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) return sendError(res, 400, 'Blog slug is required');

    const blogs = getDB().collection('blogs');
    const result = await blogs.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    const blog = result?.value || result;
    if (!blog) return sendError(res, 404, 'Blog not found');

    const relatedMatch = [{ category: blog.category }];
    if (Array.isArray(blog.tags) && blog.tags.length) relatedMatch.push({ tags: { $in: blog.tags } });
    const previewProjection = { content: 0 };
    const [related, previous, next] = await Promise.all([
      blogs.find({ _id: { $ne: blog._id }, status: 'published', $or: relatedMatch }, { projection: previewProjection }).sort({ publishedAt: -1 }).limit(4).toArray(),
      blogs.findOne({ status: 'published', publishedAt: { $lt: blog.publishedAt } }, { projection: previewProjection, sort: { publishedAt: -1 } }),
      blogs.findOne({ status: 'published', publishedAt: { $gt: blog.publishedAt } }, { projection: previewProjection, sort: { publishedAt: 1 } })
    ]);

    return sendSuccess(res, 200, 'Blog retrieved successfully', { blog, related, previous, next });
  } catch (error) {
    console.error('Get blog details failed:', error.message);
    return sendError(res, 500, 'Failed to get blog details');
  }
}
