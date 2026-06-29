const uploadService = require("../modules/uploads/upload.service");
const s3 = require("../config/s3");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

jest.mock("../config/s3", () => ({
  send: jest.fn(),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

describe("Upload Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.AWS_BUCKET_NAME = "test-bucket";
  });

  describe("uploadFile", () => {
    it("should upload file and return key", async () => {
      s3.send.mockResolvedValue({});

      const file = {
        originalname: "video.mp4",
        mimetype: "video/mp4",
        buffer: Buffer.from("test"),
      };

      const key = await uploadService.uploadFile(file);

      expect(s3.send).toHaveBeenCalled();

      expect(key).toContain("content/");
      expect(key).toContain("video.mp4");
    });

    it("should throw when S3 upload fails", async () => {
      s3.send.mockRejectedValue(
        new Error("AWS Error")
      );

      const file = {
        originalname: "video.mp4",
        mimetype: "video/mp4",
        buffer: Buffer.from("test"),
      };

      await expect(
        uploadService.uploadFile(file)
      ).rejects.toThrow("AWS Error");
    });
  });

  describe("getSecureUrl", () => {
    it("should generate signed url", async () => {
      getSignedUrl.mockResolvedValue(
        "https://signed-url"
      );

      const url =
        await uploadService.getSecureUrl(
          "content/file.mp4"
        );

      expect(getSignedUrl).toHaveBeenCalled();

      expect(url).toBe("https://signed-url");
    });

    it("should return null for empty key", async () => {
      const url =
        await uploadService.getSecureUrl();

      expect(url).toBeNull();

      expect(getSignedUrl)
        .not.toHaveBeenCalled();
    });

    it("should throw if signed url generation fails", async () => {
      getSignedUrl.mockRejectedValue(
        new Error("Presign failed")
      );

      await expect(
        uploadService.getSecureUrl(
          "content/file.mp4"
        )
      ).rejects.toThrow("Presign failed");
    });
  });
});