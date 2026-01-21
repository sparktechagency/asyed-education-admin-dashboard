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
    getAllVideos: builder.query({
      query: () => {
        return {
          url: `/video`,
          method: "GET",
        };
      },
      providesTags: ['Videos'],
    }),

    addVideos: builder.mutation({
      query: (data) => {
        return {
          url: "/video",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Videos"],
    }),

    // updateVideo: builder.mutation({
    //   query: ({ data, id }) => {
    //     return {
    //       url: `/video/${id}`,
    //       method: "PATCH",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: ["Videos"],
    // }),

    deleteVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/video/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Videos"],
    }),

  
  }),
});

export const { 
    useGetAllVideosQuery,
    useAddVideosMutation,
    useDeleteVideoMutation 
} = blogApi;
