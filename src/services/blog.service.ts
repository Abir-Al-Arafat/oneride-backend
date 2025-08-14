import blogModel from "../models/blog.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";

const queryHelper = new QueryHelper();

const addBlogService = async (data: any) => {
  const blog = await blogModel.create(data);
  return blog;
};

const updateBlogService = async (id: string, data: any) => {
  const blog = await blogModel.findByIdAndUpdate(id, data, { new: true });
  return blog;
};

const deleteBlogService = async (id: string) => {
  const blog = await blogModel.findByIdAndDelete(id);
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
  updateBlogService,
  deleteBlogService,
  getAllBlogsService,
};
