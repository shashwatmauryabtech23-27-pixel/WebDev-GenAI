const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
})

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"
const MAX_AI_ATTEMPTS = 3

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function isRetryableAiError(error) {
    const status = Number(error?.status || error?.code)
    const message = String(error?.message || "").toLowerCase()
    return [ 408, 429, 500, 502, 503, 504 ].includes(status)
        || message.includes("rate limit")
        || message.includes("overloaded")
        || message.includes("temporarily unavailable")
        || message.includes("fetch failed")
}

async function generateContentWithRetry(request) {
    let lastError

    for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt += 1) {
        try {
            return await ai.models.generateContent(request)
        } catch (error) {
            lastError = error
            if (!isRetryableAiError(error) || attempt === MAX_AI_ATTEMPTS) throw error
            await wait(attempt * 750)
        }
    }

    throw lastError
}

function parseJsonResponse(text) {
    const cleanedText = String(text || "")
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")

    return JSON.parse(cleanedText)
}

/**
 * Gemini creates the qualitative report, but the API owns the final score.
 * This makes the score internally consistent with the reported skill gaps and
 * prevents an optimistic model response (for example 80 with a critical gap)
 * from being shown as an ATS-style match score.
 */
const SCORE_WEIGHTS = { eligibility: 10, programming: 20, data: 15, coreSkills: 45, domain: 10 }

function scoreFromEvidence(breakdown) {
    return Object.entries(SCORE_WEIGHTS).reduce((total, [key, maximum]) => {
        const value = Number(breakdown?.[key]?.points)
        return total + (Number.isFinite(value) ? Math.min(maximum, Math.max(0, Math.round(value))) : 0)
    }, 0)
}


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    scoreBreakdown: z.object(Object.fromEntries(Object.entries(SCORE_WEIGHTS).map(([key, maximum]) => [key, z.object({
        points: z.number().describe(`Evidence-supported points out of ${maximum}`),
        evidence: z.string().describe("Specific supporting resume evidence, or a concise explanation of the missing requirement")
    })]))),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an evidence-based interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

Scoring rules:
- Assess the job requirements against the candidate evidence. Return scoreBreakdown with these weights: eligibility 10, programming/problem solving 20, databases/data processing 15, core mandatory role skills 45, related domain skills 10. For another role, map its actual requirements into these categories.
- Give full points only for clear, specific evidence; partial points for transferable or incomplete evidence; zero for absent essential skills. For example, a CSE graduate with strong Java projects and coding practice, some MongoDB exposure, but no SAP ABAP or SAP BW evidence should score around 35, not 25 by default.
- For each category, explain the evidence or the missing requirement. The final score is calculated by the server from these five category points.
- Give credit only for skills and experience explicitly supported by the resume or self description.
- Do not infer MDM, enterprise consulting, business analysis, QA/testing, SLA, RCA, stakeholder management, or other job requirements when they are not stated.
- Essential missing requirements must appear in skillGaps. Return 4 to 8 concise, non-duplicate gaps when applicable.
- 80-100 means nearly all essential requirements have direct evidence; 60-79 means several requirements are supported but meaningful gaps remain; below 60 means multiple essential requirements lack evidence.
- Keep questions, gaps, preparation plan, and score mutually consistent.
`

    const response = await generateContentWithRetry({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            temperature: 0,
            seed: 42,
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    const report = interviewReportSchema.parse(parseJsonResponse(response.text))
    report.rawMatchScore = Math.max(0, Math.min(100, Math.round(Number(report.matchScore) || 0)))
    report.matchScore = scoreFromEvidence(report.scoreBreakdown)
    report.scoringVersion = 3
    return report


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateContentWithRetry({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = resumePdfSchema.parse(parseJsonResponse(response.text))

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf, scoreFromEvidence }
