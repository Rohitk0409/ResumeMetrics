const { Router } = require("express");
const multer = require("multer");
const { calculateAtsScore } = require("../controller/atsResume.controller");

const router = Router();

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file type: ${file.originalname}. Only PDF and DOCX files are allowed.`,
        ),
      );
    }

    cb(null, true);
  },
});

router.post(
  "/resume/ats",
  upload.fields([
    {
      name: "resumeFiles",
      maxCount: 20,
    },
    {
      name: "jobDescriptionPdf",
      maxCount: 1,
    },
  ]),
  calculateAtsScore,
);

module.exports = router;
