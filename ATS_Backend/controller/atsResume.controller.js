const pdfParse = require("pdf-parse");

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

exports.calculateAtsScore = async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription || "";

    const resumeFiles = req.files?.resumeFiles || [];
    const jdPdf = req.files?.jobDescriptionPdf?.[0];

    if (!jobDescription && !jdPdf) {
      return res.status(400).json({
        success: false,
        message: "Provide either Job Description text or Job Description PDF",
      });
    }

    if (resumeFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume PDFs are required",
      });
    }

    // JD PDF uploaded
    if (jdPdf) {
      const jdData = await pdfParse(jdPdf.buffer);
      jobDescription = jdData.text;
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
        const pdfData = await pdfParse(file.buffer);

        const resumeText = pdfData.text.toLowerCase().replace(/[^\w\s]/g, " ");

        const matchedKeywords = jdKeywords.filter((keyword) =>
          resumeText.includes(keyword),
        );

        const atsScore = Math.round(
          (matchedKeywords.length / jdKeywords.length) * 100,
        );

        candidates.push({
          candidateName: file.originalname.replace(".pdf", ""),
          atsScore,
          matchedKeywordsCount: matchedKeywords.length,
          totalKeywords: jdKeywords.length,
          matchedKeywords,
        });
      } catch (error) {
        candidates.push({
          candidateName: file.originalname.replace(".pdf", ""),
          atsScore: 0,
          matchedKeywordsCount: 0,
          totalKeywords: jdKeywords.length,
          matchedKeywords: [],
          error: "Unable to parse PDF",
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
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
