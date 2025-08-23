import blogModel from "../models/blog.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";
import { deleteImageFile, handleFileUpload } from "../utilities/fileUtils";

const queryHelper = new QueryHelper();

const addBlogService = async (data: any, file?: Express.Multer.File) => {
  const blog = await blogModel.create(data);
  if (!blog) {
    return null;
  }
  if (file) {
    const savedFilePath = await handleFileUpload(file);
    if (savedFilePath) {
      blog.thumbnail = savedFilePath;
      await blog.save();
    }
  }
  return blog;
};

const getBlogByIdService = async (id: string) => {
  const blog = await blogModel.findById(id);
  return blog;
};

const updateBlogService = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const blog = await blogModel.findById(id);
  if (!blog) {
    return null;
  }
  Object.assign(blog, data);
  await blog.save();
  if (file) {
    const savedFilePath = await handleFileUpload(file, blog.thumbnail || null);
    if (savedFilePath) {
      blog.thumbnail = savedFilePath;
      await blog.save();
    }
  }
  return blog;
};

const deleteBlogService = async (id: string) => {
  const blog = await blogModel.findByIdAndDelete(id);
  if (blog && blog.thumbnail) {
    deleteImageFile(blog.thumbnail);
  }
  return blog;
};

const getAllBlogsService = async ({ status, search }: IQuery) => {
  return await queryHelper.query(blogModel, {
    search: search || undefined,
    searchFields: ["title"], // search only by title
    filter: status ? { status } : {},
  });
};

export {
  addBlogService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  getAllBlogsService,
};
