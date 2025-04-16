// lib/db.ts
import mysql from 'mysql2/promise';

// Define database connection configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eip_staging',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Types for our data
export interface JobFairStats {
  totalApplications: number;
  uniquePositions: number;
  genderRatio: number;
  topSource: string;
  positionData: PositionData[];
  genderData: ChartData[];
  educationData: ChartData[];
  sourceData: ChartData[];
  dailyTrendData: DailyTrendData[];
}

export interface PositionData {
  position: string;
  count: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface DailyTrendData {
  date: string;
  count: number;
}

// Get job fair stats for a specific date range
export async function getJobFairStats(startDate: Date, endDate: Date): Promise<JobFairStats> {
  const formattedStartDate = startDate.toISOString().split('T')[0] + ' 00:00:00';
  const formattedEndDate = endDate.toISOString().split('T')[0] + ' 23:59:59';

  // Get total applications
  const totalResults: any = await executeQuery(
    `SELECT COUNT(*) as total
     FROM candidate_web
     WHERE apply_date BETWEEN ? AND ?`,
    [formattedStartDate, formattedEndDate]
  );
  const totalApplications = totalResults[0].total;

  // Get position distribution
  const positionResults: any = await executeQuery(
    `SELECT jvw.position, COUNT(cw.id_apply_candidate) as count
     FROM candidate_web cw
     JOIN job_vacanacy_web jvw ON cw.id_job_vacanacy = jvw.id_job_vacanacy
     WHERE cw.apply_date BETWEEN ? AND ?
     GROUP BY jvw.position
     ORDER BY count DESC`,
    [formattedStartDate, formattedEndDate]
  );
  
  // Get gender distribution
  const genderResults: any = await executeQuery(
    `SELECT gender, COUNT(*) as count
     FROM candidate_web
     WHERE apply_date BETWEEN ? AND ?
     GROUP BY gender`,
    [formattedStartDate, formattedEndDate]
  );
  
  // Get education distribution
  const educationResults: any = await executeQuery(
    `SELECT pendidikan_terakhir, COUNT(*) as count
     FROM candidate_web
     WHERE apply_date BETWEEN ? AND ?
     GROUP BY pendidikan_terakhir
     ORDER BY count DESC`,
    [formattedStartDate, formattedEndDate]
  );
  
  // Get source distribution
  const sourceResults: any = await executeQuery(
    `SELECT sumber, COUNT(*) as count
     FROM candidate_web
     WHERE apply_date BETWEEN ? AND ?
     GROUP BY sumber
     ORDER BY count DESC`,
    [formattedStartDate, formattedEndDate]
  );
  
  // Get daily trend
  const dailyTrendResults: any = await executeQuery(
    `SELECT DATE(apply_date) as date, COUNT(*) as count
     FROM candidate_web
     WHERE apply_date BETWEEN ? AND ?
     GROUP BY DATE(apply_date)
     ORDER BY date`,
    [formattedStartDate, formattedEndDate]
  );

  // Get unique positions count
  const uniquePositionsResults: any = await executeQuery(
    `SELECT COUNT(DISTINCT jvw.position) as uniquePositions
     FROM candidate_web cw
     JOIN job_vacanacy_web jvw ON cw.id_job_vacanacy = jvw.id_job_vacanacy
     WHERE cw.apply_date BETWEEN ? AND ?`,
    [formattedStartDate, formattedEndDate]
  );
  const uniquePositions = uniquePositionsResults[0].uniquePositions;

  // Calculate gender ratio (Male:Female)
  const maleCount = genderResults.find((g: any) => g.gender === 'Male')?.count || 0;
  const femaleCount = genderResults.find((g: any) => g.gender === 'Female')?.count || 0;
  const genderRatio = femaleCount > 0 ? maleCount / femaleCount : maleCount;

  // Get top source
  const topSource = sourceResults.length > 0 ? sourceResults[0].sumber : 'N/A';

  // Format data for charts
  const positionData = positionResults.map((item: any) => ({
    position: item.position,
    count: item.count,
  }));

  const genderData = genderResults.map((item: any) => ({
    name: item.gender,
    value: item.count,
  }));

  const educationData = educationResults.map((item: any) => ({
    name: item.pendidikan_terakhir,
    value: item.count,
  }));

  const sourceData = sourceResults.map((item: any) => ({
    name: item.sumber,
    value: item.count,
  }));

  const dailyTrendData = dailyTrendResults.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    count: item.count,
  }));

  return {
    totalApplications,
    uniquePositions,
    genderRatio,
    topSource,
    positionData,
    genderData,
    educationData,
    sourceData,
    dailyTrendData,
  };
}