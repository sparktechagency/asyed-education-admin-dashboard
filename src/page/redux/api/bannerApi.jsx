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
    getAllBanners: builder.query({
      query: () => {
        return {
          url: `/banners`,
          method: "GET",
        };
      },
      providesTags: ['Banners'],
    }),

    addBanner: builder.mutation({
      query: (data) => {
        return {
          url: "/banners",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Banners"],
    }),

      updateBanner: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/banners/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Banners"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => { 
        return {
          url: `/banners/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Banners"],
    }),

  
  }),
});

export const { 
    useGetAllBannersQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation 
} = blogApi;
