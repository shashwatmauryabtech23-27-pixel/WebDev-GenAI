/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf
} from "./services/interview.api.js"; 

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    const getReports = async () => {
        try {
            const data = await getAllInterviewReports();
            setReports(data.interviewReports || []);
            return data.interviewReports || [];
        } catch (error) {
            console.error("Failed to load interview reports:", error);
            return [];
        }
    };

    /**
     * @description Generates a personalized interview report.
     */
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReports(prev => [data.interviewReport, ...prev]);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error("Interview report generation failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Loads a saved interview report.
     */
    const getReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error("Failed to fetch interview report:", error);
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Downloads an ATS-optimized resume PDF.
     */
    const getResumePdf = async (interviewReportId) => {
        try {
            await generateResumePdf(interviewReportId);
        } catch (error) {
            console.error("Failed to download resume PDF:", error);
        }
    };

    return (
        <InterviewContext.Provider value={{ 
            loading, 
            setLoading, 
            report, 
            setReport, 
            reports, 
            setReports,
            generateReport,
            getReportById,
            getReports,
            getResumePdf
        }}>
            {children}
        </InterviewContext.Provider>
    );
};
