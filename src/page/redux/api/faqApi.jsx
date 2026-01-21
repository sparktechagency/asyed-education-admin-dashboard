import { baseApi } from "./baseApi";


const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

     createFAQ: builder.mutation({
            query: (data) => ({
                url: '/faq',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["FAQ"],
        }),

    getAllFaq: builder.query({
      query: () => {
        return {
          url: "/faq",
          method: "GET",
        };
      },
      providesTags: ["FAQ"],
    }),
      updateFaq: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/faq/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ["FAQ"],
        }),
       deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/faq/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FAQ']
        }),
    

  }),
});


export const { useGetAllFaqQuery, useCreateFAQMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi;