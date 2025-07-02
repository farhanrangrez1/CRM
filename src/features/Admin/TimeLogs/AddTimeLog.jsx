import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createTimeLogs, updateTimeLogs } from '../../../redux/slices/TimeLogsSlice';
import { fetchProject } from '../../../redux/slices/ProjectsSlice';
import { fetchjobs } from '../../../redux/slices/JobsSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddTimeLog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { log } = location.state || {};
  console.log("ghiuo", log);

  const { project } = useSelector((state) => state.projects);
  const { job } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(fetchjobs());
  }, [dispatch]);

  const reversedProjectList = project?.data?.slice().reverse() || [];
  const reversedJobList = job?.jobs?.slice().reverse() || [];

  const [formData, setFormData] = useState({
    projectsId: '',
    jobId: '',
    date: '',
    hours: '',
    extraHours: '0',
    taskNotes: ''
  });

  useEffect(() => {
    if (log) {
      setFormData({
        projectsId: log.projectId?.[0]?._id || '',
        jobId: log.jobId?.[0]?._id || '',
        date: log.date ? log.date.substring(0, 10) : '',
        hours: log.hours?.toString() || '',
        extraHours: log.extraHours?.toString() || '0',
        taskNotes: log.taskNotes || '',
      });
    }
  }, [log]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      projectsId: [formData.projectsId],
      jobId: [formData.jobId]
    };

    if (log && log._id) {
      dispatch(updateTimeLogs({ id: log._id, data: dataToSend }))
        .unwrap()
        .then(() => {
          toast.success("Time log updated successfully!");
          navigate("/admin/TimeLogs");
        })
        .catch(() => {
          toast.error("Failed to update time log!");
        });
    } else {
      dispatch(createTimeLogs(dataToSend))
        .unwrap()
        .then(() => {
          toast.success("Time log created successfully!");
          navigate("/admin/TimeLogs");
        })
        .catch(() => {
          toast.error("Failed to create time log!");
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title h4 mb-4">Add Time Log</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Project Dropdown */}
              <div className="col-md-6">
                <label className="form-label">Project</label>
                <select
                  className="form-select"
                  name="projectsId"
                  value={formData.projectsId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedProject = project?.data?.find(p => p._id === selectedId);
                    setFormData({
                      ...formData,
                      projectsId: selectedId,
                      projectName: selectedProject?.projectName || "",
                    });
                  }}
                  required
                >
                  <option value="">Select a project</option>
                  {reversedProjectList.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jobs Dropdown */}
              <div className="col-md-6">
                <label className="form-label">Jobs</label>
                <select
                  className="form-select"
                  name="jobId"
                  value={formData.jobId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedJob = reversedJobList.find(j => j._id === selectedId);
                    setFormData({
                      ...formData,
                      jobId: selectedId,
                      jobName: selectedJob?.jobName || "",
                    });
                  }}
                  required
                >
                  <option value="">Select a job</option>
                  {reversedJobList.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j?.jobName || j.brandName + " " + j.subBrand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="col-md-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Hours */}
              <div className="col-md-6">
                <label className="form-label">Hours</label>
                <input
                  type="time"
                  className="form-control"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  step="1800"
                  required
                />
              </div>

              {/* Task Notes */}
              <div className="col-md-12">
                <label className="form-label">Task Notes</label>
                <textarea
                  className="form-control"
                  name="taskNotes"
                  value={formData.taskNotes}
                  onChange={handleInputChange}
                  placeholder="Enter task details"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button id='All_btn' type="submit" className="btn btn-primary">
                  Save Time Log
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTimeLog;
