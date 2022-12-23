const { google } = require("googleapis");
const stream = require("stream");
const path = require("path");
const folderId = process.env.FOLDER_ID;

const getDriveService = () => {
  const KEYFILEPATH = path.join(__dirname, "key.json");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: "v3", auth });
  return driveService;
};

const uploadFile = async (fileObject, driveService) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  console.log("uploading file...");

  const { data } = await driveService.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [folderId],
    },
    fields: "id",
  });

  return data.id;
};

const getImageFromDrive = async (id, driveService) => {
  const response = await driveService.files.get(
    {
      fileId: id,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
      encoding: null,
    }
  );

  const imageType = response.headers["content-type"];
  const base64 = Buffer.from(response.data, "utf8").toString("base64");
  const dataURI = "data:" + imageType + ";base64," + base64;

  return dataURI;
};

module.exports = {
  getDriveService: getDriveService,
  uploadToDrive: uploadFile,
  getImageFromDrive: getImageFromDrive,
};
