/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import {
  getAllInterviewReports,
  generateInterviewReport,     // <-- MISSING IMPORT ADDED
  getInterviewReportById,       // <-- MISSING IMPORT ADDED
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
            console.error("Failed to load workspaces:", error);
            return [];
        }
    };

    /**
     * @description Orchestrates the payload delivery to WebDev-GenAI pipelines
     */
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            // Add new architecture to the active list snapshot
            setReports(prev => [data.interviewReport, ...prev]);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error("Context Error - Code Synthesis Failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Syncs the application context state with a specific workspace build
     */
    const getReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (error) {
            console.error("Context Error - Fetching Build Details Failed:", error);
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Triggers the binary build downloader service
     */
    const getResumePdf = async (interviewReportId) => {
        try {
            await generateResumePdf(interviewReportId);
        } catch (error) {
            console.error("Context Error - Exporting Build ZIP Failed:", error);
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
