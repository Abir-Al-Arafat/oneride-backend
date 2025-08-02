import blogModel from "../models/blog.model";

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

const getAllBlogsService = async (status?: string) => {
  const query = status ? { status } : {};
  const blogs = await blogModel.find(query);
  return blogs;
};

export {
  addBlogService,
  updateBlogService,
  deleteBlogService,
  getAllBlogsService,
};
