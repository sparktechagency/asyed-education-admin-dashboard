import { baseApi } from "./baseApi";

const manageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaq: builder.query({
      query: () => {
        return {
          url: `/faq`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addFaq: builder.mutation({
      query: (data) => {
        return {
          url: "/faq",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateFaq: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/faq/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteFaq: builder.mutation({
      query: (id) => {
        return {
          url: `/faq/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),


    getAllBanners: builder.query({
      query: () => {
        return {
          url: `/banners`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addBanners: builder.mutation({
      query: (data) => {
        return {
          url: "/banners",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateBanners: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/banners/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteBanners: builder.mutation({
      query: (id) => {
        return {
          url: `/banners/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),
  }),
});

export const {} = manageApi;
