import api from "@/lib/axios";

export const contentService = {
  getAllContents: async () => {
    const response = await api.get("/contents/");
    return response.data;
  },

  createContent: async (data) => {
    const response = await api.post("/contents/create", data);
    return response.data;
  },

  updateContent: async (id, data) => {
    const response = await api.put(`/contents/update/${id}`, data);
    return response.data;
  },

  deleteContent: async (id) => {
    const response = await api.delete(`/contents/delete/${id}`);
    return response.data;
  },

  getSubscriberFeed: async () => {
    const response = await api.get("/contents/feed");
    return response.data;
  },

  recordView: async (data) => {
    const response = await api.post("/content-views", data);
    return response.data;
  },

  toggleLike: async (contentId) => {
    const response = await api.post(
      `/content-likes/${contentId}/toggle`
    );
    return response.data;
  },

  getLikes: async (contentId) => {
    const response = await api.get(
      `/content-likes/${contentId}`
    );
    return response.data;
  },

  getComments: async (contentId) => {
    const response = await api.get(
      `/content-comments/${contentId}`
    );
    return response.data;
  },

  addComment: async (contentId, text) => {
    const response = await api.post(
      `/content-comments/${contentId}`,
      { comment: text },
    );
    return response.data;
  },

  updateComment: async (commentId, text) => {
    const response = await api.put(
      `/content-comments/${commentId}`,
      { text }
    );
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(
      `/content-comments/${commentId}`
    );
    return response.data;
  },
};
