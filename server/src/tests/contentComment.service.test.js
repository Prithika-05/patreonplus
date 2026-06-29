jest.mock("../modules/contentComments/contentComment.model", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
}));

jest.mock("../modules/contents/content.model", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../modules/users/user.model", () => ({}));

const contentCommentService = require("../modules/contentComments/contentComment.service");
const ContentComment = require("../modules/contentComments/contentComment.model");
const Content = require("../modules/contents/content.model");
const User = require("../modules/users/user.model");
const AppError = require("../utils/AppError");

describe("ContentComment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addComment", () => {
    it("should add a comment successfully", async () => {
      Content.findByPk.mockResolvedValue({ id: "content1" });

      ContentComment.create.mockResolvedValue({
        id: "comment1",
      });

      ContentComment.findByPk.mockResolvedValue({
        id: "comment1",
        comment: "Nice post!",
      });

      const result =
        await contentCommentService.addComment(
          "content1",
          "user1",
          "Nice post!"
        );

      expect(ContentComment.create).toHaveBeenCalledWith({
        contentId: "content1",
        userId: "user1",
        comment: "Nice post!",
      });

      expect(result.comment).toBe("Nice post!");
    });

    it("should throw if content does not exist", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentCommentService.addComment(
          "content1",
          "user1",
          "Hello"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("getComments", () => {
    it("should return all comments", async () => {
      Content.findByPk.mockResolvedValue({
        id: "content1",
      });

      ContentComment.findAll.mockResolvedValue([
        {
          id: "1",
          comment: "First",
        },
        {
          id: "2",
          comment: "Second",
        },
      ]);

      const result =
        await contentCommentService.getComments(
          "content1"
        );

      expect(result).toHaveLength(2);
    });

    it("should return empty array", async () => {
      Content.findByPk.mockResolvedValue({
        id: "content1",
      });

      ContentComment.findAll.mockResolvedValue([]);

      const result =
        await contentCommentService.getComments(
          "content1"
        );

      expect(result).toEqual([]);
    });

    it("should throw if content does not exist", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentCommentService.getComments(
          "content1"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("updateComment", () => {
    it("should update comment successfully", async () => {
      const update = jest.fn();

      ContentComment.findByPk.mockResolvedValue({
        id: "comment1",
        userId: "user1",
        update,
      });

      await contentCommentService.updateComment(
        "comment1",
        "user1",
        "Updated"
      );

      expect(update).toHaveBeenCalledWith({
        comment: "Updated",
      });
    });

    it("should throw if comment not found", async () => {
      ContentComment.findByPk.mockResolvedValue(null);

      await expect(
        contentCommentService.updateComment(
          "comment1",
          "user1",
          "Updated"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if user is unauthorized", async () => {
      ContentComment.findByPk.mockResolvedValue({
        userId: "anotherUser",
      });

      await expect(
        contentCommentService.updateComment(
          "comment1",
          "user1",
          "Updated"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteComment", () => {
    it("should delete comment successfully", async () => {
      const destroy = jest.fn();

      ContentComment.findByPk.mockResolvedValue({
        userId: "user1",
        destroy,
      });

      const result =
        await contentCommentService.deleteComment(
          "comment1",
          "user1"
        );

      expect(destroy).toHaveBeenCalled();

      expect(result).toBe(true);
    });

    it("should throw if comment not found", async () => {
      ContentComment.findByPk.mockResolvedValue(null);

      await expect(
        contentCommentService.deleteComment(
          "comment1",
          "user1"
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw if unauthorized", async () => {
      ContentComment.findByPk.mockResolvedValue({
        userId: "anotherUser",
      });

      await expect(
        contentCommentService.deleteComment(
          "comment1",
          "user1"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("getCommentsCount", () => {
    it("should return comments count", async () => {
      ContentComment.count.mockResolvedValue(15);

      const result =
        await contentCommentService.getCommentsCount(
          "content1"
        );

      expect(ContentComment.count).toHaveBeenCalledWith({
        where: {
          contentId: "content1",
        },
      });

      expect(result).toBe(15);
    });

    it("should return zero when there are no comments", async () => {
      ContentComment.count.mockResolvedValue(0);

      const result =
        await contentCommentService.getCommentsCount(
          "content1"
        );

      expect(result).toBe(0);
    });
  });
});