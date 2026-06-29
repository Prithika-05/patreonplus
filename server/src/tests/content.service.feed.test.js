jest.mock("../modules/contents/content.model", () => ({
  findAll: jest.fn(),
}));

jest.mock("../modules/subscriptions/subscription.model", () => ({
  findAll: jest.fn(),
}));

jest.mock("../modules/tiers/tier.model", () => ({
  findAll: jest.fn(),
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

jest.mock("../modules/uploads/upload.service", () => ({
  getSecureUrl: jest.fn(),
}));

const contentService = require("../modules/contents/content.service");
const Content = require("../modules/contents/content.model");
const Subscription = require("../modules/subscriptions/subscription.model");
const Tier = require("../modules/tiers/tier.model");
const ContentLike = require("../modules/contentLikes/contentLike.model");
const ContentComment = require("../modules/contentComments/contentComment.model");
const uploadService = require("../modules/uploads/upload.service");

describe("Content Service - getSubscriberFeed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array when user has no active subscriptions", async () => {
    Subscription.findAll.mockResolvedValue([]);

    const result = await contentService.getSubscriberFeed("user1");

    expect(result).toEqual([]);
  });

  it("should return feed for subscribed creators", async () => {
    Subscription.findAll.mockResolvedValue([
      {
        creatorId: "creator1",
        tier: { level: 2 },
      },
    ]);

    Tier.findAll.mockResolvedValue([
      { id: "tier1" },
      { id: "tier2" },
    ]);

    Content.findAll.mockResolvedValue([
      {
        id: "content1",
        creatorId: "creator1",
        fileKey: "video.mp4",
        createdAt: new Date(),
        toJSON: () => ({
          id: "content1",
          title: "React",
        }),
      },
    ]);

    ContentLike.count.mockResolvedValue(10);
    ContentComment.count.mockResolvedValue(5);

    ContentLike.findOne.mockResolvedValue({
      id: "like1",
    });

    ContentComment.findAll.mockResolvedValue([]);

    uploadService.getSecureUrl.mockResolvedValue(
      "secure-url"
    );

    const result =
      await contentService.getSubscriberFeed("user1");

    expect(result).toHaveLength(1);

    expect(result[0].likesCount).toBe(10);
    expect(result[0].commentsCount).toBe(5);
    expect(result[0].liked).toBe(true);
    expect(result[0].previewUrl).toBe("secure-url");
  });

  it("should return liked=false when user has not liked content", async () => {
    Subscription.findAll.mockResolvedValue([
      {
        creatorId: "creator1",
        tier: { level: 1 },
      },
    ]);

    Tier.findAll.mockResolvedValue([
      { id: "tier1" },
    ]);

    Content.findAll.mockResolvedValue([
      {
        id: "content1",
        creatorId: "creator1",
        fileKey: "video.mp4",
        createdAt: new Date(),
        toJSON: () => ({
          id: "content1",
        }),
      },
    ]);

    ContentLike.count.mockResolvedValue(0);
    ContentComment.count.mockResolvedValue(0);

    ContentLike.findOne.mockResolvedValue(null);

    ContentComment.findAll.mockResolvedValue([]);

    uploadService.getSecureUrl.mockResolvedValue(
      "secure-url"
    );

    const result =
      await contentService.getSubscriberFeed("user1");

    expect(result[0].liked).toBe(false);
  });

  it("should include comments", async () => {
    Subscription.findAll.mockResolvedValue([
      {
        creatorId: "creator1",
        tier: { level: 1 },
      },
    ]);

    Tier.findAll.mockResolvedValue([
      { id: "tier1" },
    ]);

    Content.findAll.mockResolvedValue([
      {
        id: "content1",
        creatorId: "creator1",
        fileKey: "video.mp4",
        createdAt: new Date(),
        toJSON: () => ({
          id: "content1",
        }),
      },
    ]);

    ContentLike.count.mockResolvedValue(0);
    ContentComment.count.mockResolvedValue(1);

    ContentLike.findOne.mockResolvedValue(null);

    ContentComment.findAll.mockResolvedValue([
      {
        id: "comment1",
        text: "Great content!",
      },
    ]);

    uploadService.getSecureUrl.mockResolvedValue(
      "secure-url"
    );

    const result =
      await contentService.getSubscriberFeed("user1");

    expect(result[0].comments).toHaveLength(1);
  });

  it("should sort feed by newest content first", async () => {
    Subscription.findAll.mockResolvedValue([
      {
        creatorId: "creator1",
        tier: { level: 3 },
      },
    ]);

    Tier.findAll.mockResolvedValue([
      { id: "tier1" },
    ]);

    Content.findAll.mockResolvedValue([
      {
        id: "old",
        creatorId: "creator1",
        fileKey: "old.mp4",
        createdAt: new Date("2024-01-01"),
        toJSON: () => ({
          id: "old",
        }),
      },
      {
        id: "new",
        creatorId: "creator1",
        fileKey: "new.mp4",
        createdAt: new Date("2025-01-01"),
        toJSON: () => ({
          id: "new",
        }),
      },
    ]);

    ContentLike.count.mockResolvedValue(0);
    ContentComment.count.mockResolvedValue(0);
    ContentLike.findOne.mockResolvedValue(null);
    ContentComment.findAll.mockResolvedValue([]);
    uploadService.getSecureUrl.mockResolvedValue(
      "secure-url"
    );

    const result =
      await contentService.getSubscriberFeed("user1");

    expect(result[0].id).toBe("new");
    expect(result[1].id).toBe("old");
  });

  it("should generate secure preview URLs", async () => {
    Subscription.findAll.mockResolvedValue([
      {
        creatorId: "creator1",
        tier: { level: 1 },
      },
    ]);

    Tier.findAll.mockResolvedValue([
      { id: "tier1" },
    ]);

    Content.findAll.mockResolvedValue([
      {
        id: "content1",
        creatorId: "creator1",
        fileKey: "video.mp4",
        createdAt: new Date(),
        toJSON: () => ({
          id: "content1",
        }),
      },
    ]);

    ContentLike.count.mockResolvedValue(0);
    ContentComment.count.mockResolvedValue(0);
    ContentLike.findOne.mockResolvedValue(null);
    ContentComment.findAll.mockResolvedValue([]);

    uploadService.getSecureUrl.mockResolvedValue(
      "signed-url"
    );

    const result =
      await contentService.getSubscriberFeed("user1");

    expect(uploadService.getSecureUrl)
      .toHaveBeenCalledWith("video.mp4");

    expect(result[0].previewUrl)
      .toBe("signed-url");
  });
});