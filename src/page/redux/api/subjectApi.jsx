import { baseApi } from "./baseApi";

const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

  
    getAllSubject: builder.query({
      query: () => {
        return {
          url: `/subject`,
          method: "GET",
        };
      },
      providesTags: ["subject"],
    }),

    addSubject: builder.mutation({
      query: (data) => {
        return {
          url: "/subject",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["subject"],
    }),

    updateSubject: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/subject/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["subject"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => {
        return {
          url: `/subject/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["subject"],
    }),

  
  }),
});

export const { useAddSubjectMutation,useDeleteSubjectMutation,useGetAllSubjectQuery,useUpdateSubjectMutation } = subjectApi;
