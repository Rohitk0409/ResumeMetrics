const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractKeywords = (text) => {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "have",
    "will",
    "your",
    "you",
    "our",
    "are",
    "was",
    "were",
    "has",
    "had",
    "their",
    "they",
    "them",
    "his",
    "her",
    "she",
    "him",
    "its",
    "can",
    "may",
    "all",
    "any",
    "job",
    "role",
    "work",
    "good",
    "able",
    "using",
    "used",
    "into",
    "than",
    "then",
    "also",
    "more",
    "most",
    "need",
    "required",
    "requirements",
  ]);

  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word),
        ),
    ),
  ];
};

const extractTextFromFile = async (file) => {
  // PDF
  if (file.mimetype === "application/pdf") {
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error(
    `${file.originalname}: Only PDF and DOCX files are supported`,
  );
};

exports.calculateAtsScore = async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription?.trim() || "";

    const resumeFiles = req.files?.resumeFiles || [];
    const jdFile = req.files?.jobDescriptionPdf?.[0];

    if (!jobDescription && !jdFile) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either Job Description text or upload a PDF/DOCX Job Description file",
      });
    }

    if (!resumeFiles.length) {
      return res.status(400).json({
        success: false,
        message: "Resume files are required",
      });
    }

    // Extract JD text from uploaded file
    if (jdFile) {
      try {
        jobDescription = await extractTextFromFile(jdFile);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    const jdKeywords = extractKeywords(jobDescription);

    if (!jdKeywords.length) {
      return res.status(400).json({
        success: false,
        message: "No valid keywords found in Job Description",
      });
    }

    const candidates = [];

    for (const file of resumeFiles) {
      try {
        const extractedText = await extractTextFromFile(file);

        const resumeText = extractedText.toLowerCase().replace(/[^\w\s]/g, " ");

        const matchedKeywords = jdKeywords.filter((keyword) =>
          resumeText.includes(keyword),
        );

        const atsScore = Math.round(
          (matchedKeywords.length / jdKeywords.length) * 100,
        );

        candidates.push({
          candidateName: file.originalname.replace(/\.(pdf|docx)$/i, ""),
          atsScore,
          matchedKeywordsCount: matchedKeywords.length,
          totalKeywords: jdKeywords.length,
          matchedKeywords,
        });
      } catch (error) {
        candidates.push({
          candidateName: file.originalname,
          atsScore: 0,
          matchedKeywordsCount: 0,
          totalKeywords: jdKeywords.length,
          matchedKeywords: [],
          error: error.message,
        });
      }
    }

    candidates.sort((a, b) => b.atsScore - a.atsScore);

    const ranking = candidates.map((candidate, index) => ({
      rank: index + 1,
      ...candidate,
    }));

    return res.status(200).json({
      success: true,
      totalCandidates: ranking.length,
      totalJDKeywords: jdKeywords.length,
      ranking,
    });
  } catch (error) {
    console.error("ATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
