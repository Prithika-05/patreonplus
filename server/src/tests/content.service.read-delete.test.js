jest.mock("../modules/contents/content.model", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../modules/subscriptions/subscription.model", () => ({
  findOne: jest.fn(),
}));

jest.mock("../modules/tiers/tier.model", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../modules/uploads/upload.service", () => ({
  getSecureUrl: jest.fn(),
}));

jest.mock("../modules/users/user.model", () => ({}));

jest.mock("../modules/contentLikes/contentLike.model", () => ({
  count: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../modules/contentComments/contentComment.model", () => ({
  count: jest.fn(),
  findAll: jest.fn(),
}));

const contentService = require("../modules/contents/content.service");
const Content = require("../modules/contents/content.model");
const Subscription = require("../modules/subscriptions/subscription.model");
const Tier = require("../modules/tiers/tier.model");
const uploadService = require("../modules/uploads/upload.service");
const AppError = require("../utils/AppError");


describe("Content Service - Read & Delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllContents", () => {
    it("should return all contents with preview URLs", async () => {
      const contents = [
        {
          fileKey: "video1.mp4",
          toJSON: () => ({ id: "1", title: "First" }),
        },
        {
          fileKey: "video2.mp4",
          toJSON: () => ({ id: "2", title: "Second" }),
        },
      ];

      Content.findAll.mockResolvedValue(contents);

      uploadService.getSecureUrl
        .mockResolvedValueOnce("url1")
        .mockResolvedValueOnce("url2");

      const result = await contentService.getAllContents(
        "creator1"
      );

      expect(result).toEqual([
        {
          id: "1",
          title: "First",
          previewUrl: "url1",
        },
        {
          id: "2",
          title: "Second",
          previewUrl: "url2",
        },
      ]);
    });

    it("should return empty array", async () => {
      Content.findAll.mockResolvedValue([]);

      const result = await contentService.getAllContents(
        "creator1"
      );

      expect(result).toEqual([]);
    });
  });

  describe("getContentById", () => {
    const content = {
      id: "content1",
      creatorId: "creator1",
      tierId: "tier1",
      fileKey: "video.mp4",
      toJSON: () => ({
        id: "content1",
        title: "React",
      }),
    };

    beforeEach(() => {
      uploadService.getSecureUrl.mockResolvedValue(
        "secure-url"
      );
    });

    it("should allow creator to access own content", async () => {
      Content.findByPk.mockResolvedValue(content);

      const result =
        await contentService.getContentById(
          "content1",
          "creator1"
        );

      expect(result.previewUrl).toBe("secure-url");
    });

    it("should allow subscribed user", async () => {
      Content.findByPk.mockResolvedValue(content);

      Subscription.findOne.mockResolvedValue({
        tier: {
          level: 2,
        },
      });

      Tier.findByPk.mockResolvedValue({
        level: 1,
      });

      const result =
        await contentService.getContentById(
          "content1",
          "subscriber1"
        );

      expect(result.previewUrl).toBe("secure-url");
    });

    it("should reject missing user id", async () => {
      await expect(
        contentService.getContentById(
          "content1",
          null
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject missing content", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentService.getContentById(
          "content1",
          "user"
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject unsubscribed user", async () => {
      Content.findByPk.mockResolvedValue(content);

      Subscription.findOne.mockResolvedValue(null);

      await expect(
        contentService.getContentById(
          "content1",
          "subscriber1"
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject user with lower tier", async () => {
      Content.findByPk.mockResolvedValue(content);

      Subscription.findOne.mockResolvedValue({
        tier: {
          level: 1,
        },
      });

      Tier.findByPk.mockResolvedValue({
        level: 3,
      });

      await expect(
        contentService.getContentById(
          "content1",
          "subscriber1"
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteContent", () => {
    it("should delete content successfully", async () => {
      const destroy = jest.fn();

      Content.findByPk.mockResolvedValue({
        creatorId: "creator1",
        destroy,
      });

      const result =
        await contentService.deleteContent(
          "content1",
          "creator1"
        );

      expect(result).toBe(true);

      expect(destroy).toHaveBeenCalled();
    });

    it("should throw if content not found", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentService.deleteContent(
          "content1",
          "creator1"
        )
      ).rejects.toThrow(AppError);
    });

    it("should reject unauthorized delete", async () => {
      Content.findByPk.mockResolvedValue({
        creatorId: "otherCreator",
      });

      await expect(
        contentService.deleteContent(
          "content1",
          "creator1"
        )
      ).rejects.toThrow(AppError);
    });
  });
});