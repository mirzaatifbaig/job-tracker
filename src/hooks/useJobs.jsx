import { useContext } from "react";
import { JobContext } from "@/context/JobContext.jsx";

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
