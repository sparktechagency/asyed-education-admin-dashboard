import { baseApi } from "./baseApi";

const parantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllParents: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/parents?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),



    getAllTutors: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/tutors?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addTutors: builder.mutation({
      query: (data) => {
        return {
          url: "/tutors",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateTutor: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/tutors/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteTutor: builder.mutation({
      query: (id) => {
        return {
          url: `/tutors/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),
  }),
});

export const { useGetAllParentsQuery, useAddTutorsMutation, useDeleteTutorMutation, useGetAllTutorsQuery, useUpdateTutorMutation } = parantsApi;
