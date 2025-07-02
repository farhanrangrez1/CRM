import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Barcode from 'react-barcode';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject } from '../../../redux/slices/ProjectsSlice';
import { createjob, Project_job_Id, updatejob } from '../../../redux/slices/JobsSlice';

function AddJobTracker() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Project name sho
  const { id: paramId } = useParams();
  const location = useLocation();
  const { job } = location.state || {};
  const projectId = location.state?.id;

  const id = paramId || job?._id;



  const { project, loading, error } = useSelector((state) => state.projects);
  useEffect(() => {
    if (projectId && project?.data?.length) {
      const foundProject = project.data.find(p => p._id === projectId);
      if (foundProject) {
        setFormData(prev => ({
          ...prev,
          projectsId: foundProject._id,
        }));
      }
    }
  }, [projectId, project]);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  // Form submit f
  const [formData, setFormData] = useState({
    projectsId: '',
    brandName: '',
    subBrand: '',
    flavour: '',
    packType: '',
    packCode: '',
    packSize: '',
    priority: '',
    Status: '',
    totalTime: '',
    assign: 'Not Assing',
    barcode: "",
  });

  // Static options
  const brandOptions = [
    { value: 'Pepsi', label: 'Pepsi' },
    { value: 'CocaCola', label: 'CocaCola' },
    { value: 'Fanta', label: 'Fanta' },
  ];

  const flavourOptions = [
    { value: 'Orange', label: 'Orange' },
    { value: 'Lime', label: 'Lime' },
    { value: 'Ginger Ale', label: 'Ginger Ale' },
  ];

  const packSizeOptions = [
    { value: '250ml', label: '250ml' },
    { value: '500ml', label: '500ml' },
    { value: '1L', label: '1L' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (job && project?.data?.length) {
      let projectId = '';
      if (Array.isArray(job.projectId) && job.projectId.length > 0) {
        projectId = job.projectId[0]._id;
      } else if (Array.isArray(job.projectsId) && job.projectsId.length > 0) {
        projectId = typeof job.projectsId[0] === 'object'
          ? job.projectsId[0]._id
          : job.projectsId[0];
      }
      setFormData((prev) => ({
        ...prev,
        ...job,
        projectsId: projectId,
      }));
    }
  }, [job, project?.data]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      projectsId: [formData.projectsId],
    };

    if (job) {
      dispatch(updatejob({ id: job._id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Job updated successfully!");
          const selectedProjectId = formData.projectsId;
          // navigate(`/admin/ProjectOverview/${selectedProjectId}`, { state: { openTab: 'jobs' } });
          navigate(-1);
          dispatch(Project_job_Id(selectedProjectId));
        })
        .catch(() => {
          toast.error("Failed to update job!");
        });
    } else {
      dispatch(createjob(payload))
        .unwrap()
        .then(() => {
          toast.success("Job created successfully!");
          const selectedProjectId = formData.projectsId;
          // navigate(`/admin/ProjectOverview/${selectedProjectId}`, { state: { openTab: 'jobs' } });
          navigate(-1);
          dispatch(Project_job_Id(selectedProjectId));
        })
        .catch(() => {
          toast.error("Failed to create job!");
        });
    }
  };


  const handleCancel = () => {
    navigate("/admin/projectList");
  }
  const Cancel = () => {
    navigate('/admin/ProjectOverview', { state: { openTab: 'jobs' } });
  }

  // Project name sho
  const selectedProjectName = project?.data?.find(p => p._id === formData.projectsId)?.projectName || "";

  const reversedProjectList = project?.data?.slice().reverse() || [];

  const idToIndexMap = {};
  reversedProjectList.forEach((project, index) => {
    idToIndexMap[project._id] = String(index + 1).padStart(4, '0');
  });

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="mb-4">{job?._id ? "Edit Jobs" : "Add Jobs"}</h2>

            <form className="row g-3" onSubmit={handleSubmit}>
              {/* Project Name */}
              {/* <div className="col-md-6">
                <label className="form-label">Project Name</label> */}
              {/* <select
                  name="projectsId"
                  className="form-control"
                  value={formData.projectsId}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a project</option>
                  {project?.data?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select> */}
              {/* <select
                  name="projectsId"
                  className="form-control"
                  value={formData.projectsId}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a project</option>
                  {project?.data?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select> */}
              {/* ok map  */}
              {/* <select
                  name="projectsId"
                  className="form-control"
                  value={formData.projectsId || ""}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a project</option>
                  {project?.data?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select> */}

              {/* <select
                  name="projectsId"
                  className="form-control"
                  value={formData.projectsId || ""}
                  onChange={handleChange}
                >
                  <option value={selectedProjectName}>
                    {selectedProjectName}
                  </option>
                </select>
              </div> */}

              {/* <div className="col-md-6">
                <label className="form-label">Project</label>
                <select
                  name="projectsId"
                  className="form-control"
                  value={formData.projectsId || ""}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a project</option>
                  {project?.data?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {idToIndexMap[p._id] || '----'}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="col-md-6">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  className="form-control"
                  value={selectedProjectName || ""}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Project Number</label>
                <input
                  type="text"
                  name="projectNumber"
                  className="form-control"
                  value={idToIndexMap[formData.projectsId] || ""}
                  readOnly
                />
              </div>

              {/* Brand Name */}
              <div className="col-md-6">
                <label className="form-label">Brand Name</label>
                <Select
                  options={brandOptions}
                  value={brandOptions.find(opt => opt.value === formData.brandName)}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, brandName: option?.value || '' }))
                  }
                  isClearable
                  required

                />
              </div>

              {/* Sub Brand */}
              <div className="col-md-6">
                <label className="form-label">Sub Brand</label>
                <input
                  type="text"
                  className="form-control"
                  name="subBrand"
                  value={formData.subBrand}
                  onChange={handleChange}
                  required

                />
              </div>

              {/* Flavour */}
              <div className="col-md-6">
                <label className="form-label">Flavour</label>
                <Select
                  options={flavourOptions}
                  value={flavourOptions.find(opt => opt.value === formData.flavour)}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, flavour: option?.value || '' }))
                  }
                  isClearable
                  required

                />
              </div>

              {/* Pack Type */}
              <div className="col-md-6">
                <label className="form-label">Pack Type</label>
                <select
                  className="form-select"
                  name="packType"
                  value={formData.packType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="FW">Firstwrap – FW</option>
                  <option value="SB">Showbox – SB</option>
                  <option value="OC">Outercase – OC</option>
                  <option value="Can">Can</option>
                  <option value="BOT">Bottle – BOT</option>
                  <option value="PH">Pouch – PH</option>
                  <option value="Bag">Bag</option>
                  <option value="DC">DisplayCase – DC</option>
                  <option value="PET">Plastic Bottle – PET</option>
                  <option value="BNR">Banner – BNR</option>
                  <option value="PST">Poster – PST</option>
                  <option value="HDR">Header – HDR</option>
                  <option value="SHF">Shelf – SHF</option>
                </select>
              </div>

              {/* Pack Code */}
              <div className="col-md-6">
                <label className="form-label">Pack Code</label>
                <select
                  className="form-select"
                  name="packCode"
                  value={formData.packCode}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="FW">Firstwrap – FW</option>
                  <option value="SB"> Showbox – SB</option>
                  <option value="OC"> Outercase – OC</option>
                  <option value="Can"> Can – Can</option>
                  <option value="BOT"> Bottle – BOT</option>
                  <option value="PH"> Pouch – PH</option>
                </select>
              </div>

              {/* Pack Size */}
              <div className="col-md-6">
                <label className="form-label">Pack Size</label>
                <Select
                  options={packSizeOptions}
                  value={packSizeOptions.find(opt => opt.value === formData.packSize)}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, packSize: option?.value || '' }))
                  }
                  isClearable
                  required
                />
              </div>

              {/* Priority */}
              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required

                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              {/* Total Time Logged */}
              {/* <div className="col-md-6">
                <label className="form-label">Total Time Logged</label>
                <input
                  type="time"
                  className="form-control"
                  name="totalTime"
                  value={formData.totalTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, totalTime: e.target.value }))
                  }
                />
              </div> */}

              {/* assign */}
              {/* <div className="col-md-6">
                <label className="form-label">assign</label>
                <select
                  className="form-select"
                  name="assign"
                  value={formData.assign}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Production">Production</option>
                  <option value="Designer">Designer</option>
                </select>
              </div> */}

              {/* Barcode */}
              {/* Barcode Input */}
              <div className="col-md-6">
                <label className="form-label">Barcode</label>
                <input
                  type="text"
                  className="form-control"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter barcode"
                />
              </div>

              {/* Barcode Preview */}
              {formData.barcode && (
                <div className="col-md-6 d-flex align-items-center">
                  <Barcode value={formData.barcode} />
                </div>
              )}


              {/* Buttons */}
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => Cancel()}>Cancel</button>
                <button type="submit" className="btn btn-dark">
                  {id || job?._id ? "Save" : "Create Jobs"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddJobTracker;
