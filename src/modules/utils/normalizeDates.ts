import { IProject } from "../../types/storeTypes";
import { getCurrentMonth } from "./getCurrentMonth";
import { calculateDateRange } from "./calculateDateRange";

export const normalizeDates = (projects: IProject[]) => {
  return projects.reduce((acc: IProject[], project) => {
    const lastDate = acc.length === 0 ? getCurrentMonth() : acc[acc.length - 1].firstDate;
    const firstDate = project.firstDate > lastDate ? lastDate : project.firstDate;

    acc.push({
      id: project.id,
      firstDate,
      lastDate,
      technologies: project.technologies,
      dateRange: calculateDateRange(firstDate, lastDate),
    });

    return acc;
  }, []);
};
