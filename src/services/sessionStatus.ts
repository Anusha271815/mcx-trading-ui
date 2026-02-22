import api from "@/lib/axios";
import { SessionsStatus } from "../types/sessions-status";

export const fetchSessionsStatus = async (): Promise<SessionsStatus[]> => {
    const res = await api.get("/analytics/session-status/");

    console.log("Session status raw response:", res.data);

    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.sessions)) return res.data.sessions;
    if (Array.isArray(res.data.data)) return res.data.data;
    if (Array.isArray(res.data.results)) return res.data.results;

    // Single object response — wrap in array
    if (res.data && typeof res.data === "object") return [res.data];

    return [];
}