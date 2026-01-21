import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

  //  getBlogs: builder.query({
  //           query: (params) => {
  //               const { search } = params || {};
  //               const queryParams = new URLSearchParams();
  //               if (search) queryParams.append('search', search);
                

  //               return {
  //                   url: `/blog?${queryParams.toString()}`,
  //                   method: 'GET',
  //               };
  //           },
  //           providesTags: ['Blogs'],
  //       }),
    getAllBlogs: builder.query({
      query: () => {
        return {
          url: `/blog`,
          method: "GET",
        };
      },
      providesTags: ['Blogs'],
    }),

    addBlogs: builder.mutation({
      query: (data) => {
        return {
          url: "/blog",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/blog/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => {
        return {
          url: `/blog/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Blogs"],
    }),

  
  }),
});

export const { useGetAllBlogsQuery, useAddBlogsMutation, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi;
