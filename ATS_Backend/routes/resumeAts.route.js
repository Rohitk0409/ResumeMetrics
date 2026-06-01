const { Router } = require("express");
const multer = require("multer");
const { calculateAtsScore } = require("../controller/atsResume.controller");

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
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
