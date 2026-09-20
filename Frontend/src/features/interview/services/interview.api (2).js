import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

/**
 * @description Pipes requirements to WebDev-GenAI execution block & compiles code sandbox.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription); 
    formData.append("selfDescription", selfDescription); 
    if (resumeFile) {
        formData.append("resume", resumeFile); 
    }

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * @description Fetches architecture specifications and module codeblocks by workflow ID.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description Pulls recent compilation snapshots for user dashboard view.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

/**
 * @description Triggers backend bundler, downloads compiled architecture source-code as a .zip file.
 */
export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob" 
    });

    // Auto-trigger clean browser down-pipe for the compiled zip build
    const blob = new Blob([response.data], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `webdev-genai-build-${interviewReportId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return response.data;
};
