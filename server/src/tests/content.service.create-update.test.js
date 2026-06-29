jest.mock("../modules/contents/content.model", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../modules/tiers/tier.model", () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../modules/uploads/upload.service", () => ({
  getSecureUrl: jest.fn(),
}));

jest.mock("../modules/subscriptions/subscription.model", () => ({
  findOne: jest.fn(),
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

const contentService = require("../modules/contents/content.service");
const Content = require("../modules/contents/content.model");
const Tier = require("../modules/tiers/tier.model");
const uploadService = require("../modules/uploads/upload.service");
const AppError = require("../utils/AppError");

describe("Content Service - Create & Update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createContent", () => {
    const creatorId = "creator-1";

    const contentData = {
      title: "React Tutorial",
      description: "Learn React",
      fileKey: "videos/react.mp4",
      tierId: "tier-1",
    };

    it("should create content successfully", async () => {
      Tier.findByPk.mockResolvedValue({
        id: "tier-1",
        creatorId,
      });

      Content.findOne.mockResolvedValue(null);

      Content.create.mockResolvedValue({
        toJSON: () => ({
          id: "content-1",
          ...contentData,
          creatorId,
        }),
      });

      const result = await contentService.createContent(
        contentData,
        creatorId
      );

      expect(Tier.findByPk).toHaveBeenCalledWith("tier-1");

      expect(Content.create).toHaveBeenCalled();

      expect(result.title).toBe("React Tutorial");
    });

    it("should throw when tierId is missing", async () => {
      await expect(
        contentService.createContent(
          {
            title: "Test",
          },
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when tier does not exist", async () => {
      Tier.findByPk.mockResolvedValue(null);

      await expect(
        contentService.createContent(
          contentData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when creator does not own tier", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId: "otherCreator",
      });

      await expect(
        contentService.createContent(
          contentData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when title already exists", async () => {
      Tier.findByPk.mockResolvedValue({
        creatorId,
      });

      Content.findOne.mockResolvedValue({
        id: "existing",
      });

      await expect(
        contentService.createContent(
          contentData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("updateContent", () => {
    const creatorId = "creator-1";

    const updatedData = {
      title: "Updated",
      description: "Updated Description",
      tierId: "tier-1",
    };

    it("should update content successfully", async () => {
      const update = jest.fn();

      const content = {
        creatorId,
        fileKey: "video.mp4",
        update,
        toJSON: () => ({
          id: "content-1",
          ...updatedData,
        }),
      };

      Content.findByPk.mockResolvedValue(content);

      Tier.findByPk.mockResolvedValue({
        creatorId,
      });

      uploadService.getSecureUrl.mockResolvedValue(
        "https://signed-url"
      );

      const result =
        await contentService.updateContent(
          "content-1",
          updatedData,
          creatorId
        );

      expect(update).toHaveBeenCalledWith(updatedData);

      expect(result.previewUrl).toBe(
        "https://signed-url"
      );
    });

    it("should throw when content is not found", async () => {
      Content.findByPk.mockResolvedValue(null);

      await expect(
        contentService.updateContent(
          "id",
          updatedData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when creator is unauthorized", async () => {
      Content.findByPk.mockResolvedValue({
        creatorId: "otherCreator",
      });

      await expect(
        contentService.updateContent(
          "id",
          updatedData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when tierId is missing", async () => {
      Content.findByPk.mockResolvedValue({
        creatorId,
      });

      await expect(
        contentService.updateContent(
          "id",
          {},
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when tier is invalid", async () => {
      Content.findByPk.mockResolvedValue({
        creatorId,
      });

      Tier.findByPk.mockResolvedValue(null);

      await expect(
        contentService.updateContent(
          "id",
          updatedData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should throw when tier belongs to another creator", async () => {
      Content.findByPk.mockResolvedValue({
        creatorId,
      });

      Tier.findByPk.mockResolvedValue({
        creatorId: "otherCreator",
      });

      await expect(
        contentService.updateContent(
          "id",
          updatedData,
          creatorId
        )
      ).rejects.toThrow(AppError);
    });

    it("should generate secure preview URL", async () => {
      const update = jest.fn();

      const content = {
        creatorId,
        fileKey: "video.mp4",
        update,
        toJSON: () => ({
          id: "content-1",
        }),
      };

      Content.findByPk.mockResolvedValue(content);

      Tier.findByPk.mockResolvedValue({
        creatorId,
      });

      uploadService.getSecureUrl.mockResolvedValue(
        "secure-url"
      );

      const result =
        await contentService.updateContent(
          "id",
          updatedData,
          creatorId
        );

      expect(
        uploadService.getSecureUrl
      ).toHaveBeenCalledWith("video.mp4");

      expect(result.previewUrl).toBe("secure-url");
    });
  });
});