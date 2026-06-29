jest.mock("../modules/contentViews/contentView.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../modules/contents/content.model", () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../modules/tiers/tier.model", () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));

const contentViewService = require("../modules/contentViews/contentView.service");
const ContentView = require("../modules/contentViews/contentView.model");
const Content = require("../modules/contents/content.model");
const Tier = require("../modules/tiers/tier.model");

describe("Content View Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("recordView", () => {
    it("should create a new view", async () => {
      ContentView.findOne.mockResolvedValue(null);

      Content.findByPk.mockResolvedValue({
        creatorId: "creator1",
      });

      ContentView.create.mockResolvedValue({
        id: "view1",
      });

      const result = await contentViewService.recordView({
        contentId: "content1",
        viewerId: "user1",
        watchDuration: 120,
        completed: true,
      });

      expect(ContentView.create).toHaveBeenCalled();

      expect(result.id).toBe("view1");
    });

    it("should not create duplicate view within five minutes", async () => {
      ContentView.findOne.mockResolvedValue({
        id: "existingView",
      });

      const result = await contentViewService.recordView({
        contentId: "content1",
        viewerId: "user1",
      });

      expect(ContentView.create).not.toHaveBeenCalled();

      expect(result.id).toBe("existingView");
    });

    it("should use supplied creatorId", async () => {
      ContentView.findOne.mockResolvedValue(null);

      ContentView.create.mockResolvedValue({
        id: "view1",
      });

      await contentViewService.recordView({
        contentId: "content1",
        viewerId: "user1",
        creatorId: "creator1",
      });

      expect(Content.findByPk).not.toHaveBeenCalled();
    });
  });

  describe("getContentViews", () => {
    it("should return total and unique views", async () => {
      ContentView.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(70);

      const result =
        await contentViewService.getContentViews(
          "content1"
        );

      expect(result).toEqual({
        totalViews: 100,
        uniqueViews: 70,
      });
    });

    it("should return zero views", async () => {
      ContentView.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result =
        await contentViewService.getContentViews(
          "content1"
        );

      expect(result.totalViews).toBe(0);
      expect(result.uniqueViews).toBe(0);
    });
  });

  describe("getCreatorEngagement", () => {
    it("should calculate creator engagement", async () => {
      ContentView.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(70)
        .mockResolvedValueOnce(80);

      ContentView.findOne.mockResolvedValue({
        averageWatchTime: 250,
      });

      const result =
        await contentViewService.getCreatorEngagement(
          "creator1"
        );

      expect(result.totalViews).toBe(100);
      expect(result.uniqueViewers).toBe(70);
      expect(result.completedViews).toBe(80);
      expect(result.completionRate).toBe(80);
      expect(result.averageWatchTime).toBe(250);
    });

    it("should handle zero views", async () => {
      ContentView.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      ContentView.findOne.mockResolvedValue({
        averageWatchTime: null,
      });

      const result =
        await contentViewService.getCreatorEngagement(
          "creator1"
        );

      expect(result.completionRate).toBe(0);
    });
  });

  describe("getTopContent", () => {
    it("should return top viewed content", async () => {
      ContentView.findAll.mockResolvedValue([
        {
          contentId: "content1",
          views: "45",
        },
      ]);

      Content.findAll.mockResolvedValue([
        {
          id: "content1",
          title: "React Course",
          createdAt: new Date(),
          tier: {
            name: "Premium",
          },
        },
      ]);

      const result =
        await contentViewService.getTopContent(
          "creator1"
        );

      expect(result[0]).toEqual({
        id: "content1",
        title: "React Course",
        views: 45,
        tierName: "Premium",
        createdAt: expect.any(Date),
      });
    });

    it("should return Untitled Content if missing", async () => {
      ContentView.findAll.mockResolvedValue([
        {
          contentId: "content1",
          views: "5",
        },
      ]);

      Content.findAll.mockResolvedValue([]);

      const result =
        await contentViewService.getTopContent(
          "creator1"
        );

      expect(result[0].title)
        .toBe("Untitled Content");

      expect(result[0].tierName)
        .toBe("Free Tier");
    });

    it("should return empty array", async () => {
      ContentView.findAll.mockResolvedValue([]);

      Content.findAll.mockResolvedValue([]);

      const result =
        await contentViewService.getTopContent(
          "creator1"
        );

      expect(result).toEqual([]);
    });
  });

  describe("getContentEngagement", () => {
    it("should calculate engagement", async () => {
      ContentView.count
        .mockResolvedValueOnce(60)
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(30);

      ContentView.findOne.mockResolvedValue({
        averageWatchTime: 190,
      });

      const result =
        await contentViewService.getContentEngagement(
          "content1"
        );

      expect(result.totalViews).toBe(60);
      expect(result.uniqueViewers).toBe(50);
      expect(result.completedViews).toBe(30);
      expect(result.completionRate).toBe(50);
      expect(result.averageWatchTime).toBe(190);
    });

    it("should handle zero engagement", async () => {
      ContentView.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      ContentView.findOne.mockResolvedValue({
        averageWatchTime: null,
      });

      const result =
        await contentViewService.getContentEngagement(
          "content1"
        );

      expect(result.completionRate).toBe(0);
      expect(result.averageWatchTime).toBe(0);
    });
  });
});