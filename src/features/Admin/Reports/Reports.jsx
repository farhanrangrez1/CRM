// import React, { useEffect } from 'react';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReports } from '../../../redux/slices/ReportsSlice';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function Reports() {
//   // Sample data for Project Status
// const dispatch =useDispatch()

//    const { Reports, loading, error } = useSelector((state) => state.reportss);
// console.log(Reports);

//   useEffect(() => {
//     dispatch(fetchReports());
//   }, [dispatch]);

//   const projectStatusData = {
//     labels: ['Completed', 'In Progress', 'On Hold', 'Delayed'],
//     datasets: [{
//       data: [45, 25, 20, 10],
//       backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
//       borderWidth: 0,
//     }],
//   };

//   // Sample data for Work Hours
//   const workHoursData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//     datasets: [{
//       label: 'Hours',
//       data: [8, 9, 8.5, 7.5, 6.5],
//       backgroundColor: '#007bff',
//       borderRadius: 5,
//     }],
//   };

//   // Sample data for Financial Overview
//   const financialData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//       {
//         label: 'Revenue',
//         data: [25000, 30000, 35000, 45000],
//         borderColor: '#28a745',
//         tension: 0.4,
//       },
//       {
//         label: 'Expenses',
//         data: [20000, 25000, 30000, 35000],
//         borderColor: '#dc3545',
//         tension: 0.4,
//       },
//     ],
//   };

//   // Sample data for PO Status
//   const poStatusData = {
//     labels: ['Approved', 'Pending', 'Rejected'],
//     datasets: [{
//       data: [60, 30, 10],
//       backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
//       borderWidth: 0,
//     }],
//   };

//   // Sample data for Timesheet Compliance
//   const timesheetData = {
//     labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
//     datasets: [{
//       label: 'Compliance %',
//       data: [92, 88, 90, 85, 89],
//       backgroundColor: '#007bff',
//       borderRadius: 5,
//     }],
//   };

//   // Sample data for Project Timeline
//   const timelineData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//       {
//         label: 'Project A',
//         data: [20, 40, 60, 90],
//         borderColor: '#007bff',
//         tension: 0.4,
//       },
//       {
//         label: 'Project B',
//         data: [15, 35, 55, 80],
//         borderColor: '#28a745',
//         tension: 0.4,
//       },
//     ],
//   };

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//     },
//   };

//   return (
//     <div className=" p-4 m-3" style={{backgroundColor:"white",borderRadius:"10px",}}>
//       <h4 className="mb-4">Reports & Analytics</h4>
      
//       {/* Filter Buttons */}
//       <div className="mb-4">
//         <button className="btn btn-outline-secondary btn-sm me-2">Last 7 Days</button>
//         <button className="btn btn-outline-secondary btn-sm me-2">All Clients</button>
//         <button className="btn btn-outline-secondary btn-sm">All Projects</button>
//       </div>

//       {/* First Row */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card h-100">
//             <div className="card-body">
//               <h6 className="card-title mb-3">Project Status</h6>
//               <div style={{ height: '200px' }}>
//                 <Doughnut data={projectStatusData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card h-100">
//             <div className="card-body">
//               <h6 className="card-title mb-3">Work Hours</h6>
//               <div style={{ height: '200px' }}>
//                 <Bar data={workHoursData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card h-100">
//             <div className="card-body">
//               <h6 className="card-title mb-3">Financial Overview</h6>
//               <div style={{ height: '200px' }}>
//                 <Line data={financialData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card h-100">
//             <div className="card-body">
//               <h6 className="card-title mb-3">PO Status</h6>
//               <div style={{ height: '200px' }}>
//                 <Doughnut data={poStatusData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Second Row */}
//       <div className="row">
//         <div className="col-md-6">
//           <div className="card h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h6 className="card-title mb-0">Timesheet Compliance</h6>
//                 <button className="btn btn-outline-secondary btn-sm">This Week</button>
//               </div>
//               <div style={{ height: '300px' }}>
//                 <Bar data={timesheetData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="card h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h6 className="card-title mb-0">Project Timeline</h6>
//                 <button className="btn btn-outline-secondary btn-sm">Active Projects</button>
//               </div>
//               <div style={{ height: '300px' }}>
//                 <Line data={timelineData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Third Row - Detailed Time Report */}
//       <div className="row mt-4">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h6 className="card-title mb-0">Detailed Time Report</h6>
//                 <div>
//                   <button className="btn btn-outline-secondary btn-sm me-2">By Job</button>
//                   <button className="btn btn-outline-secondary btn-sm">Total Project</button>
//                 </div>
//               </div>
//               <div className="table-responsive">
//                 <table className="table table-hover">
//                   <thead>
//                     <tr>
//                       <th>Project/Job Name</th>
//                       <th>Team Member</th>
//                       <th>Date</th>
//                       <th>Hours Spent</th>
//                       <th>Progress</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Website Redesign</td>
//                       <td>John Doe</td>
//                       <td>2024-01-15</td>
//                       <td>8.5</td>
//                       <td>
//                         <div className="progress" style={{ height: '5px' }}>
//                           <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
//                         </div>
//                       </td>
//                       <td><span className="badge bg-success">Completed</span></td>
//                     </tr>
//                     <tr>
//                       <td>Mobile App Development</td>
//                       <td>Jane Smith</td>
//                       <td>2024-01-15</td>
//                       <td>6.5</td>
//                       <td>
//                         <div className="progress" style={{ height: '5px' }}>
//                           <div className="progress-bar bg-primary" style={{ width: '45%' }}></div>
//                         </div>
//                       </td>
//                       <td><span className="badge bg-primary">In Progress</span></td>
//                     </tr>
//                     <tr>
//                       <td>Database Optimization</td>
//                       <td>Mike Johnson</td>
//                       <td>2024-01-15</td>
//                       <td>4.5</td>
//                       <td>
//                         <div className="progress" style={{ height: '5px' }}>
//                           <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
//                         </div>
//                       </td>
//                       <td><span className="badge bg-warning">On Hold</span></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Reports;
















import React, { useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../../redux/slices/ReportsSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const dispatch = useDispatch();
  const { Reports, loading, error } = useSelector((state) => state.reportss);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  console.log(Reports);

  const data = Reports?.data || {};

  // 1️⃣ Project Status
  const projectStatusData = {
    labels: data?.projectStatus?.map((item) => item.label) || [],
    datasets: [{
      data: data?.projectStatus?.map((item) => item.value) || [],
      backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
      borderWidth: 0,
    }],
  };

  // 2️⃣ Work Hours
  const workHoursData = {
    labels: data?.workHours?.map((item) => item.day) || [],
    datasets: [{
      label: 'Hours',
      data: data?.workHours?.map((item) => item.hours) || [],
      backgroundColor: '#007bff',
      borderRadius: 5,
    }],
  };

  // 3️⃣ Financial Overview
  const financialData = {
    labels: data?.financialOverview?.weeks || [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.financialOverview?.revenue || [],
        borderColor: '#28a745',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: data?.financialOverview?.expenses || [],
        borderColor: '#dc3545',
        tension: 0.4,
      },
    ],
  };

  // 4️⃣ PO Status
  const poStatusData = {
    labels: data?.poStatus?.map((item) => item.label) || [],
    datasets: [{
      data: data?.poStatus?.map((item) => item.value) || [],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      borderWidth: 0,
    }],
  };

  // 5️⃣ Timesheet Compliance
  const timesheetData = {
    labels: data?.timesheetCompliance?.map((item) => item.week) || [],
    datasets: [{
      label: 'Compliance %',
      data: data?.timesheetCompliance?.map((item) => item.percent) || [],
      backgroundColor: '#007bff',
      borderRadius: 5,
    }],
  };

  // 6️⃣ Project Timeline
  const timelineData = {
    labels: data?.projectTimeline?.weeks || [],
    datasets: [
      {
        label: 'Active Projects',
        data: data?.projectTimeline?.activeProjects || [],
        borderColor: '#007bff',
        tension: 0.4,
      },
      {
        label: 'Completed Projects',
        data: data?.projectTimeline?.completedProjects || [],
        borderColor: '#28a745',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className=" p-4 m-3" style={{ backgroundColor: "white", borderRadius: "10px" }}>
      <h4 className="mb-4">Reports & Analytics</h4>

      {/* First Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Project Status</h6>
              <div style={{ height: '200px' }}>
                <Doughnut data={projectStatusData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Work Hours</h6>
              <div style={{ height: '200px' }}>
                <Bar data={workHoursData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Financial Overview</h6>
              <div style={{ height: '200px' }}>
                <Line data={financialData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">PO Status</h6>
              <div style={{ height: '200px' }}>
                <Doughnut data={poStatusData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="row">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title mb-0">Timesheet Compliance</h6>
                <button className="btn btn-outline-secondary btn-sm">This Week</button>
              </div>
              <div style={{ height: '300px' }}>
                <Bar data={timesheetData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title mb-0">Project Timeline</h6>
                <button className="btn btn-outline-secondary btn-sm">Active Projects</button>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={timelineData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reports;
