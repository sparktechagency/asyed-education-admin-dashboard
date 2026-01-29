import { baseApi } from "./baseApi";



const adminApi = baseApi.injectEndpoints({
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
    // getAllBanners: builder.query({
    //   query: () => {
    //     return {
    //       url: `/banners`,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ['Banners'],
    // }),

    addAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "/users/admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admin"],
    }),

    getAdmins: builder.query({
      query: (params) => {
        return {
          url: "/users?role=admin",
          method: "GET",
          params,
        };
      },
      providesTags: ["admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `/users/admin/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["admin"],
    }),

    //   updateBanner: builder.mutation({
    //   query: ({ data, id }) => {
    //     return {
    //       url: `/banners/${id}`,
    //       method: "PATCH",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: ["Banners"],
    // }),

    // deleteBanner: builder.mutation({
    //   query: (id) => { 
    //     return {
    //       url: `/banners/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: ["Banners"],
    // }),


  }),
});

export const {
  useAddAdminMutation,
  useGetAdminsQuery,
  useDeleteAdminMutation
} = adminApi;
