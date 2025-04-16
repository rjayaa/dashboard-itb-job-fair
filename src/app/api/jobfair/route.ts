// app/api/jobfair/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Define database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eip_staging',
};

export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  // Parse dates or set defaults (April 8-15, 2025)
  const startDate = startDateParam 
    ? new Date(startDateParam) 
    : new Date('2025-04-08');
  const endDate = endDateParam 
    ? new Date(endDateParam) 
    : new Date('2025-04-15');

  // Format dates for MySQL query
  const formattedStartDate = startDate.toISOString().split('T')[0] + ' 00:00:00';
  const formattedEndDate = endDate.toISOString().split('T')[0] + ' 23:59:59';

  try {
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    // Get total applications in the date range
    const [totalResults]: any = await connection.execute(
      `SELECT COUNT(*) as total
       FROM candidate_web
       WHERE apply_date BETWEEN ? AND ?`,
      [formattedStartDate, formattedEndDate]
    );
    const totalApplications = totalResults[0].total;

    // Get position distribution
    const [positionResults]: any = await connection.execute(
      `SELECT jvw.position, COUNT(cw.id_apply_candidate) as count
       FROM candidate_web cw
       JOIN job_vacanacy_web jvw ON cw.id_job_vacanacy = jvw.id_job_vacanacy
       WHERE cw.apply_date BETWEEN ? AND ?
       GROUP BY jvw.position
       ORDER BY count DESC`,
      [formattedStartDate, formattedEndDate]
    );
    
    // Get gender distribution
    const [genderResults]: any = await connection.execute(
      `SELECT gender, COUNT(*) as count
       FROM candidate_web
       WHERE apply_date BETWEEN ? AND ?
       GROUP BY gender`,
      [formattedStartDate, formattedEndDate]
    );
    
    // Get education distribution
    const [educationResults]: any = await connection.execute(
      `SELECT pendidikan_terakhir, COUNT(*) as count
       FROM candidate_web
       WHERE apply_date BETWEEN ? AND ?
       GROUP BY pendidikan_terakhir
       ORDER BY count DESC`,
      [formattedStartDate, formattedEndDate]
    );
    
    // Get source distribution
    const [sourceResults]: any = await connection.execute(
      `SELECT sumber, COUNT(*) as count
       FROM candidate_web
       WHERE apply_date BETWEEN ? AND ?
       GROUP BY sumber
       ORDER BY count DESC`,
      [formattedStartDate, formattedEndDate]
    );
    
    // Get daily trend
    const [dailyTrendResults]: any = await connection.execute(
      `SELECT DATE(apply_date) as date, COUNT(*) as count
       FROM candidate_web
       WHERE apply_date BETWEEN ? AND ?
       GROUP BY DATE(apply_date)
       ORDER BY date`,
      [formattedStartDate, formattedEndDate]
    );

    // Get unique positions count
    const [uniquePositionsResults]: any = await connection.execute(
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

    // Close connection
    await connection.end();

    // Return data
    return NextResponse.json({
      totalApplications,
      uniquePositions,
      genderRatio,
      topSource,
      positionData,
      genderData,
      educationData,
      sourceData,
      dailyTrendData,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job fair data' },
      { status: 500 }
    );
  }
}