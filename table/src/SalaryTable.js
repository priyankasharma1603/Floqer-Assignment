import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from "@mui/material";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Automatically registers components

import salaryData from "./salaryData.json";

// If using Chart.js 3.x or later, make sure to import and register the necessary components
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalaryTable = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("year");
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const processedData = processData(salaryData.features);
      setRows(processedData);
    } catch (error) {
      console.error("Error processing data:", error);
      setError("Failed to load salary data. Please try again later.");
    }
  }, []);

  const processData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error("Data is not in the expected format");
    }

    const yearMap = new Map();

    data.forEach((job) => {
      const year = job.properties.work_year;
      const salary = parseFloat(job.properties.salary_in_usd);

      if (isNaN(salary)) {
        throw new Error(`Invalid salary data for year ${year}`);
      }

      if (yearMap.has(year)) {
        const yearData = yearMap.get(year);
        yearMap.set(year, {
          totalJobs: yearData.totalJobs + 1,
          totalSalary: yearData.totalSalary + salary,
        });
      } else {
        yearMap.set(year, {
          totalJobs: 1,
          totalSalary: salary,
        });
      }
    });

    return Array.from(yearMap.entries()).map(([year, { totalJobs, totalSalary }]) => ({
      year,
      totalJobs,
      avgSalary: (totalSalary / totalJobs).toFixed(2),
    }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = rows.sort((a, b) => {
    if (orderBy === "year") {
      return order === "asc" ? a.year - b.year : b.year - a.year;
    } else if (orderBy === "totalJobs") {
      return order === "asc" ? a.totalJobs - b.totalJobs : b.totalJobs - a.totalJobs;
    } else if (orderBy === "avgSalary") {
      return order === "asc" ? a.avgSalary - b.avgSalary : b.avgSalary - a.avgSalary;
    }
    return 0;
  });

  // Line Chart Data
  const lineChartData = {
    labels: rows.map(row => row.year),
    datasets: [{
      label: 'Total Jobs',
      data: rows.map(row => row.totalJobs),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }]
  };

  // Handle row click to show aggregated job titles
  const handleRowClick = (year) => {
    try {
      setSelectedYear(year);
      const jobsByTitle = {};

      salaryData.features.forEach((job) => {
        if (job.properties.work_year === year) {
          const title = job.properties.job_title;
          if (jobsByTitle[title]) {
            jobsByTitle[title]++;
          } else {
            jobsByTitle[title] = 1;
          }
        }
      });

      const aggregatedJobTitles = Object.entries(jobsByTitle).map(([jobTitle, count]) => ({
        jobTitle,
        count,
      }));

      setJobTitles(aggregatedJobTitles);
    } catch (error) {
      console.error("Error aggregating job titles:", error);
      setError("Failed to load job titles. Please try again.");
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <h2>Line Graph of Total Jobs</h2>
      <Line data={lineChartData} />

      <h2>Main Table</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "year"}
                  direction={order}
                  onClick={() => handleSort("year")}
                >
                  Year
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "totalJobs"}
                  direction={order}
                  onClick={() => handleSort("totalJobs")}
                >
                  Total Jobs
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "avgSalary"}
                  direction={order}
                  onClick={() => handleSort("avgSalary")}
                >
                  Avg Salary (USD)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.year} onClick={() => handleRowClick(row.year)}>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.totalJobs}</TableCell>
                <TableCell>{row.avgSalary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedYear && (
        <div>
          <h2>Aggregated Job Titles for {selectedYear}</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Number of Jobs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobTitles.map((job, index) => (
                  <TableRow key={index}>
                    <TableCell>{job.jobTitle}</TableCell>
                    <TableCell>{job.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
