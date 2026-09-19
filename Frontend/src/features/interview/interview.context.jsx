import { createContext, useState, useEffect } from "react";
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

    // Automatically load user's history when workspace initialises
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllInterviewReports();
                setReports(data || []);
            } catch (error) {
                console.error("Failed to load initial sandbox snapshots:", error);
            }
        };
        fetchReports();
    }, []);

    /**
     * @description Orchestrates the payload delivery to WebDev-GenAI pipelines
     */
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            // Add new architecture to the active list snapshot
            setReports(prev => [data, ...prev]);
            return data;
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
            setReport(data);
            return data;
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
            getResumePdf
        }}>
            {children}
        </InterviewContext.Provider>
    );
};