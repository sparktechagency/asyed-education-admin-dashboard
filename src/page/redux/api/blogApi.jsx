import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

  
    getAllBlogs: builder.query({
      query: () => {
        return {
          url: `/blog`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addBlogs: builder.mutation({
      query: (data) => {
        return {
          url: "/blog",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateBlog: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/blog/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => {
        return {
          url: `/blog/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

  
  }),
});

export const { useGetAllParentsQuery } = blogApi;
