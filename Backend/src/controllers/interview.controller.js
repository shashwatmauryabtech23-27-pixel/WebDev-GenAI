const pdfParse = require("pdf-parse")
const crypto = require("node:crypto")
const { generateInterviewReport, generateResumePdf, calibrateMatchScore } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

function normalizeInput(value = "") {
    return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function createInputHash({ resume, selfDescription, jobDescription }) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify({
            resume: normalizeInput(resume),
            selfDescription: normalizeInput(selfDescription),
            jobDescription: normalizeInput(jobDescription)
        }))
        .digest("hex")
}

async function calibrateSavedReport(report) {
    if (!report) return report

    const calibratedScore = calibrateMatchScore(report.rawMatchScore ?? report.matchScore, report.skillGaps)
    if (report.matchScore !== calibratedScore) {
        report.matchScore = calibratedScore
        await report.save()
    }

    return report
}

async function refreshLegacyReport(report) {
    if (!report || report.scoringVersion === 2) return calibrateSavedReport(report)

    const refreshedReport = await generateInterviewReport({
        resume: report.resume || "",
        selfDescription: report.selfDescription || "",
        jobDescription: report.jobDescription
    })

    report.set(refreshedReport)
    await report.save()
    return report
}



/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }
        const { selfDescription = "", jobDescription = "" } = req.body

        if (!jobDescription.trim()) {
            return res.status(400).json({ message: "Job description is required." })
        }
        if (!resumeText.trim() && !selfDescription.trim()) {
            return res.status(400).json({ message: "Upload a resume PDF or provide a self description." })
        }

        const inputHash = createInputHash({ resume: resumeText, selfDescription, jobDescription })
        let existingReport = await interviewReportModel.findOne({ user: req.user.id, inputHash })
            .select("+rawMatchScore +scoringVersion")

        // Reuse matching reports created before inputHash was introduced.
        if (!existingReport) {
            existingReport = await interviewReportModel.findOne({
                user: req.user.id,
                resume: resumeText,
                selfDescription,
                jobDescription
            }).sort({ createdAt: -1 }).select("+rawMatchScore +scoringVersion")

            if (existingReport && !existingReport.inputHash) {
                existingReport.inputHash = inputHash
                await existingReport.save()
            }
        }

        if (existingReport) {
            await refreshLegacyReport(existingReport)
            return res.status(200).json({
                message: "Existing interview report reused for the same resume and job description.",
                reused: true,
                interviewReport: existingReport
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            inputHash,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Interview report generation failed:", error.message)
        res.status(500).json({ message: "Unable to generate interview report. Check the Gemini API configuration and try again." })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel
        .findOne({ _id: interviewId, user: req.user.id })
        .select("+rawMatchScore +scoringVersion")

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    await refreshLegacyReport(interviewReport)

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const reports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-__v -technicalQuestions -behavioralQuestions -preparationPlan")

    const seenInputs = new Set()
    const interviewReports = []

    for (const report of reports) {
        const fingerprint = createInputHash({
            resume: report.resume || "",
            selfDescription: report.selfDescription || "",
            jobDescription: report.jobDescription || ""
        })

        if (seenInputs.has(fingerprint)) continue
        seenInputs.add(fingerprint)

        const calibratedScore = calibrateMatchScore(report.matchScore, report.skillGaps)
        if (report.matchScore !== calibratedScore) {
            report.matchScore = calibratedScore
            await report.save()
        }

        const safeReport = report.toObject()
        delete safeReport.resume
        delete safeReport.selfDescription
        delete safeReport.jobDescription
        delete safeReport.inputHash
        delete safeReport.skillGaps
        interviewReports.push(safeReport)
    }

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
