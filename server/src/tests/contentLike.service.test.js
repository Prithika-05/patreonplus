jest.mock("../modules/contentLikes/contentLike.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
}));

jest.mock("../modules/contents/content.model", () => ({
  findByPk: jest.fn(),
}));

const contentLikeService = require("../modules/contentLikes/contentLike.service");
const ContentLike = require("../modules/contentLikes/contentLike.model");
const Content = require("../modules/contents/content.model");
const AppError = require("../utils/AppError");

describe("ContentLike Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toggleLike", () => {
    const contentId = "content-1";
    const userId = "user-1";

    it("should like content successfully", async () => {
      Content.findByPk.mockResolvedValue({
        id: contentId,
      });

      ContentLike.findOne.mockResolvedValue(null);

      ContentLike.create.mockResolvedValue({});

      ContentLike.count.mockResolvedValue(5);

      const result = await contentLikeService.toggleLike(
        contentId,
        userId
      );

      expect(ContentLike.create).toHaveBeenCalledWith({
        contentId,
        userId,
      });

      expect(result).toEqual({
        liked: true,
        likesCount: 5,
      });
    });

    it("should unlike content successfully", async () => {
      const destroy = jest.fn();

      Content.findByPk.mockResolvedValue({
        id: contentId,
      });

      ContentLike.findOne.mockResolvedValue({
        destroy,
      });

      ContentLike.count.mockResolvedValue(4);

      const result = await contentLikeService.toggleLike(
        contentId,
        userId
      );

      expect(destroy).toHaveBeenCalled();

      expect(result).toEqual({
        liked: false,
        likesCount: 4,
      });
    });

    it("should throw AppError when content does not exist", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentLikeService.toggleLike(contentId, userId)
      ).rejects.toThrow(AppError);
    });

    it("should return updated likes count after liking", async () => {
      Content.findByPk.mockResolvedValue({
        id: contentId,
      });

      ContentLike.findOne.mockResolvedValue(null);

      ContentLike.create.mockResolvedValue({});

      ContentLike.count.mockResolvedValue(12);

      const result = await contentLikeService.toggleLike(
        contentId,
        userId
      );

      expect(result.likesCount).toBe(12);
    });

    it("should return updated likes count after unliking", async () => {
      Content.findByPk.mockResolvedValue({
        id: contentId,
      });

      ContentLike.findOne.mockResolvedValue({
        destroy: jest.fn(),
      });

      ContentLike.count.mockResolvedValue(8);

      const result = await contentLikeService.toggleLike(
        contentId,
        userId
      );

      expect(result.likesCount).toBe(8);
    });
  });

  describe("getLikesCount", () => {
    it("should return likes count", async () => {
      ContentLike.count.mockResolvedValue(20);

      const result =
        await contentLikeService.getLikesCount(
          "content-1"
        );

      expect(ContentLike.count).toHaveBeenCalledWith({
        where: {
          contentId: "content-1",
        },
      });

      expect(result).toBe(20);
    });

    it("should return 0 when there are no likes", async () => {
      ContentLike.count.mockResolvedValue(0);

      const result =
        await contentLikeService.getLikesCount(
          "content-1"
        );

      expect(result).toBe(0);
    });
  });

  describe("hasUserLiked", () => {
    it("should return true if user has liked content", async () => {
      ContentLike.findOne.mockResolvedValue({
        id: "like-1",
      });

      const result =
        await contentLikeService.hasUserLiked(
          "content-1",
          "user-1"
        );

      expect(result).toBe(true);
    });

    it("should return false if user has not liked content", async () => {
      ContentLike.findOne.mockResolvedValue(null);

      const result =
        await contentLikeService.hasUserLiked(
          "content-1",
          "user-1"
        );

      expect(result).toBe(false);
    });
  });
});