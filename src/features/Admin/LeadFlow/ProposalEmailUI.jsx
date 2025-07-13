
// import React, { useState, useRef, useEffect } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { fetchClient } from "../../../redux/slices/ClientSlice";
// import { useSelector } from "react-redux";
// import { apiUrl } from "../../../redux/utils/config";
// import { updateProject } from "../../../redux/slices/ProjectsSlice";
// const ProposalEmailUI = ({ setShowAddInvoice }) => {
//   const proposalRef = useRef();
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [client, setClient] = useState({});
//   const { Clients } = useSelector((state) => state.client);

//   const [signatureData, setSignatureData] = useState({});
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchClient());
//   }, [dispatch]);
//   const projectId = localStorage.getItem("proposalId")

//   useEffect(() => {
//     const storedSignature = localStorage.getItem("SignatureData");
//     if (storedSignature) {
//       try {
//         const parsedSignature = JSON.parse(storedSignature);
//         setSignatureData(parsedSignature);
//       } catch (error) {
//         console.error("Invalid signatureData in localStorage:", error);
//       }
//     }
//   }, []);



//   const [proposalData, setProposalData] = useState({
//     sendTo: "",
//     subject: "",
//     message: "",
//   });


//   useEffect(() => {
//     const clientId = Array.isArray(signatureData?.clientId)
//       ? signatureData.clientId[0]
//       : signatureData?.clientId?.id;

//     if (clientId && Clients?.data?.length > 0) {
//       const client = Clients.data.find((c) => c._id === clientId);

//       if (client) {
//         setSelectedClient(client);
//         setClient(client);
//         setProposalData((prev) => ({
//           ...prev,
//           sendTo: client?.contactPersons?.[0]?.email || "",
//         }));
//       }
//     }
//   }, [signatureData, Clients]);

//   // useEffect(() => {
//   //   if ((signatureData?.clientId?.id) && Clients?.data?.length > 0) {
//   //     const client = Clients?.data?.find(c => (c._id === signatureData?.clientId?.id));
//   //     setSelectedClient(client);
//   //     setClient(client);
//   //     setProposalData((prev) => ({
//   //       ...prev,
//   //       sendTo: selectedClient?.contactPersons[0]?.email || "",
//   //     }));
//   //   }
//   // }, [signatureData, Clients]);




//   useEffect(() => {
//     const generatePDF = async () => {
//       const element = proposalRef.current;
//       if (!element || !signatureData?.line_items?.length) return;

//       // Small delay to ensure DOM is fully rendered
//       await new Promise((res) => setTimeout(res, 500));

//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//       const blob = pdf.output("blob");
//       const file = new File([blob], "proposal.pdf", { type: "application/pdf" });

//       setSelectedFile({
//         name: file.name,
//         size: `${(file.size / 1024).toFixed(2)} KB`,
//         file: file,
//       });

//       const pdfBlobUrl = URL.createObjectURL(blob);
//       setPdfUrl(pdfBlobUrl);
//     };

//     if (signatureData?.line_items?.length) {
//       generatePDF();
//     }
//   }, [signatureData]);
//   const [loadingSpinner, setLoadingSpinner] = useState(false); // 👈 Add loading state


//   const handleSendEmail = async () => {
//     if (!selectedFile?.file) {
//       toast.error("PDF not ready.");
//       return;
//     }

//     setLoadingSpinner(true);

//     const formData = new FormData();
//     formData.append("email", proposalData.sendTo);
//     formData.append("subject", proposalData.subject);
//     formData.append("message", proposalData.message);
//     formData.append("attachment", selectedFile.file);
//     formData.append("project_id", projectId);

//     try {
//       const response = await axios.post(
//         `${apiUrl}/sendProposalForSignature`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       await dispatch(
//         updateProject({
//           id: localStorage.getItem("proposalId"),
//           // payload: { status: "Signature" },
//           payload: { status: "Bidding" },
//         })
//       );
//       toast.success("Email sent successfully!");
//       setLoadingSpinner(true);
//       setShowAddInvoice(true);
//     } catch (error) {
//       toast.error("Failed to send email.");
//       console.error(error);
//     }
//   };



//   return (
//     <div className="container-fluid bg-light p-4">
//       <div className="row mb-4">
//         <div className="col-12">
//           <h5 className="text-muted">{client?.contactPersons?.[0]?.jobTitle || "N/A"}</h5>
//           <h7 className="text-muted">{client?.clientName}</h7>
//           <p>Complete email details and verify preview to send out for signature.</p>
//         </div>
//       </div>
//       <div className="row">
//         {/* Email Form Section */}
//         <div className="col-md-7 mb-4">
//           <div className="card shadow-sm p-4">
//             <h6 className="fw-bold mb-3">Email details</h6>
//             <form>
//               <div className="mb-3">
//                 <label className="form-label">Send to</label>
//                 <input
//                   readOnly
//                   type="email"
//                   className="form-control"
//                   value={proposalData.sendTo}
//                   onChange={(e) => setProposalData({ ...proposalData, sendTo: e.target.value })}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Subject</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={proposalData.subject}
//                   onChange={(e) => setProposalData({ ...proposalData, subject: e.target.value })}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Message</label>
//                 <textarea
//                   className="form-control"
//                   rows={6}
//                   value={proposalData.message}
//                   onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Attachments</label>
//                 {selectedFile && (
//                   <div className="d-flex justify-content-between align-items-center border p-2 rounded">
//                     {/* <span className="text-primary">📎 {selectedFile.name}</span> */}
//                     <span className="text-primary">📎 <a href={pdfUrl} download="proposal.pdf" className=" mb-3">
//                       {selectedFile.name}
//                     </a></span>
//                     <small className="text-muted">{selectedFile.size}</small>
//                   </div>
//                 )}
//               </div>

//               {/* <a href={pdfUrl} download="proposal.pdf" className="btn btn-outline-primary mb-3">
//                 Download Proposal PDF
//               </a> */}

//               <div>
//                 <button
//                   type="button"
//                   className="btn btn-success me-2"
//                   onClick={handleSendEmail}
//                 >
//                   Send email
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>

//         {/* PDF Preview Section */}
//         <div className="col-md-5">
//           <div className="card shadow-sm p-3">
//             <div className="d-flex justify-content-between align-items-center">
//               <h6 className="fw-bold">PDF Preview</h6>
//               <span className="text-muted">Page 1/1</span>
//             </div>

//             {pdfUrl ? (
//               <iframe
//                 title="PDF Preview"
//                 src={pdfUrl}
//                 style={{ height: "600px", width: "100%", border: "none", marginTop: "1rem" }}
//               />
//             ) : (
//               <p className="text-center text-muted mt-4">Generating PDF preview...</p>
//             )}

//             {/* Hidden HTML content used for PDF generation */}
//             <div
//               ref={proposalRef}
//               style={{
//                 position: "absolute",
//                 top: "-9999px",
//                 left: "-9999px",
//                 width: "800px", // Ensure fixed width for PDF consistency
//                 padding: "1rem",
//                 backgroundColor: "#fff",
//               }}
//             >
//               <h5 className="text-center fw-bold border-bottom pb-2">PROPOSAL</h5>
//               <div className="row mb-3">
//                 <div className="col-6"><strong>PROJECT: </strong>
//                   {client?.contactPersons?.[0]?.jobTitle}
//                 </div>
//               </div>
//               <div className="row mb-3">
//                 <div className="col-6">
//                   <strong>TO: </strong>
//                   {/* {signatureData?.client_id} */}
//                   {client?.clientName}
//                 </div>
//                 <div className="col-6">
//                   {/* <strong>LOCATION:</strong> 303 Ocean Avenue<br />
//                   Jersey City, NJ<br /> */}
//                   <strong>DATE:</strong> {client?.updatedAt?.split("T")[0]}
//                 </div>
//               </div>
//               <p>
//                 We propose to furnish all materials, equipment, and labor, subject to any exclusions listed below,
//                 required to complete the following:
//               </p>
//               {signatureData?.line_items?.length > 0 ? (
//                 <table className="table table-bordered mt-3">
//                   <tbody>
//                     {signatureData.line_items.map((item, index) => {
//                       const lineAmount = item.quantity * item.rate;
//                       return (
//                         <tr key={index}>
//                           <td>{index + 1}.</td>
//                           <td>{item.description}</td>
//                           <td className="text-end">${lineAmount.toFixed(2)}</td>
//                         </tr>
//                       );
//                     })}
//                     <tr>
//                       <td colSpan="2" className="text-end"><strong>Total Proposal Value:</strong></td>
//                       <td className="text-end fw-bold">
//                         $
//                         {signatureData.line_items
//                           .reduce((total, item) => total + item.quantity * item.rate, 0)
//                           .toFixed(2)}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               ) : (
//                 <p className="text-muted">No line items to show.</p>
//               )}

//               <p>
//                 The above price is valid for 30 days. <b>COMPANY NAME</b> agrees that they will enter into a standard AIA
//                 subcontract with General Contractor, and that basic provisions such as insurance and W-9 shall be in
//                 place prior to start.
//               </p>
//               <div className="row mt-5 align-items-end">
//                 <div className="col-6">
//                   <p><strong>Contractor:</strong> <u>Lalit Singh</u><br />
//                     <small>kiaan technology</small>
//                   </p>
//                 </div>
//                 <div className="col-6 text-end">
//                   <p><small>Date</small><br />7/2/2025</p>
//                 </div>
//               </div>
//               <p><strong>ACCEPTANCE OF PROPOSAL:</strong> The above prices, scope, specifications and conditions are satisfactory and hereby accepted. You are authorized to do the work specified.</p>
//               <div className="row mt-4">
//                 <div className="col-6">
//                   <p><strong>ACCEPTED BY:</strong> _____________________________</p>
//                 </div>
//                 <div className="col-6">
//                   <p>______________________</p>
//                 </div>
//               </div>
//               <p className="text-center small mt-5">
//                 Address will come here
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalEmailUI;

import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchClient } from "../../../redux/slices/ClientSlice";
import { useSelector } from "react-redux";
import { apiUrl } from "../../../redux/utils/config";
import { updateProject } from "../../../redux/slices/ProjectsSlice";
import { ThreeDots } from 'react-loader-spinner';
import './proposalEmail.css';
import { useLocation, useNavigate } from "react-router-dom";

const ProposalEmailUI = ({ setShowAddInvoice }) => {
  const proposalRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [client, setClient] = useState({});
  const { Clients } = useSelector((state) => state.client);
  const [signatureData, setSignatureData] = useState({});
  const dispatch = useDispatch();
  const [loadingSpinner, setLoadingSpinner] = useState(false); // Loading state
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  const projectId = localStorage.getItem("proposalId");

  useEffect(() => {
    const storedSignature = localStorage.getItem("SignatureData");
    if (storedSignature) {
      try {
        const parsedSignature = JSON.parse(storedSignature);
        setSignatureData(parsedSignature);
      } catch (error) {
        console.error("Invalid signatureData in localStorage:", error);
      }
    }
  }, []);

  const [proposalData, setProposalData] = useState({
    sendTo: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const clientId = Array.isArray(signatureData?.clientId)
      ? signatureData.clientId[0]
      : signatureData?.clientId?._id;

    if (clientId && Clients?.data?.length > 0) {
      const client = Clients.data.find((c) => c._id === clientId);
      if (client) {
        setSelectedClient(client);
        setClient(client);
        setProposalData((prev) => ({
          ...prev,
          sendTo: client?.contactPersons?.[0]?.email || "",
        }));
      }
    }
  }, [signatureData, Clients]);

  useEffect(() => {
    const generatePDF = async () => {
      const element = proposalRef.current;
      if (!element || !signatureData?.line_items?.length) return;

      await new Promise((res) => setTimeout(res, 500));

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output("blob");
      const file = new File([blob], "proposal.pdf", { type: "application/pdf" });

      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        file: file,
      });

      const pdfBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfBlobUrl);
    };

    if (signatureData?.line_items?.length) {
      generatePDF();
    }
  }, [signatureData]);

  const handleSendEmail = async () => {
    if (!selectedFile?.file) {
      toast.error("PDF not ready.");
      return;
    }

    setLoadingSpinner(true); // Start loading

    const formData = new FormData();
    formData.append("email", proposalData.sendTo);
    formData.append("subject", proposalData.subject);
    formData.append("message", proposalData.message);
    formData.append("attachment", selectedFile.file);
    formData.append("project_id", projectId);

    try {
      const response = await axios.post(
        `${apiUrl}/sendProposalForSignature`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await dispatch(
        updateProject({
          id: localStorage.getItem("proposalId"),
          payload: { status: "Bidding" },
        })
      );
      toast.success("Email sent successfully!");
      if (location.pathname === "/admin/AddCostEstimates") {
        navigate(-1);
      } else {
        setShowAddInvoice(true);
      }
    } catch (error) {
      toast.error("Failed to send email.");
      console.error(error);
    } finally {
      setLoadingSpinner(false); // Stop loading
    }
  };

  return (
    <div className={`container-fluid bg-light p-4 ${loadingSpinner ? 'blur' : ''}`}>
      {loadingSpinner && (
        <div className="loading-overlay">
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      )}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="text-muted">{client?.contactPersons?.[0]?.jobTitle || "N/A"}</h5>
          <h7 className="text-muted">{client?.clientName}</h7>
          <p>Complete email details and verify preview to send out for signature.</p>
        </div>
      </div>
      <div className="row">
        {/* Email Form Section */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm p-4">
            <h6 className="fw-bold mb-3">Email details</h6>
            <form>
              <div className="mb-3">
                <label className="form-label">Send to</label>
                <input
                  readOnly
                  type="email"
                  className="form-control"
                  value={proposalData.sendTo}
                  onChange={(e) => setProposalData({ ...proposalData, sendTo: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  value={proposalData.subject}
                  onChange={(e) => setProposalData({ ...proposalData, subject: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={proposalData.message}
                  onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Attachments</label>
                {selectedFile && (
                  <div className="d-flex justify-content-between align-items-center border p-2 rounded">
                    <span className="text-primary">📎 <a href={pdfUrl} download="proposal.pdf" className=" mb-3">
                      {selectedFile.name}
                    </a></span>
                    <small className="text-muted">{selectedFile.size}</small>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={handleSendEmail}
                >
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="col-md-5">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-bold">PDF Preview</h6>
              <span className="text-muted">Page 1/1</span>
            </div>

            {pdfUrl ? (
              <iframe
                title="PDF Preview"
                src={pdfUrl}
                style={{ height: "600px", width: "100%", border: "none", marginTop: "1rem" }}
              />
            ) : (
              <p className="text-center text-muted mt-4">Generating PDF preview...</p>
            )}

            {/* Hidden HTML content used for PDF generation */}
            <div
              ref={proposalRef}
              style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                width: "800px", // Ensure fixed width for PDF consistency
                padding: "1rem",
                backgroundColor: "#fff",
              }}
            >
              <h5 className="text-center fw-bold border-bottom pb-2">PROPOSAL</h5>
              <div className="row mb-3">
                <div className="col-6"><strong>PROJECT: </strong>
                  {client?.contactPersons?.[0]?.jobTitle}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <strong>TO: </strong>
                  {client?.clientName}
                </div>
                <div className="col-6">
                  <strong>DATE:</strong> {client?.updatedAt?.split("T")[0]}
                </div>
              </div>
              <p>
                We propose to furnish all materials, equipment, and labor, subject to any exclusions listed below,
                required to complete the following:
              </p>
              {signatureData?.line_items?.length > 0 ? (
                <table className="table table-bordered mt-3">
                  <tbody>
                    {signatureData.line_items.map((item, index) => {
                      const lineAmount = item.quantity * item.rate;
                      return (
                        <tr key={index}>
                          <td>{index + 1}.</td>
                          <td>{item.description}</td>
                          <td className="text-end">${lineAmount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="2" className="text-end"><strong>Total Proposal Value:</strong></td>
                      <td className="text-end fw-bold">
                        $
                        {signatureData.line_items
                          .reduce((total, item) => total + item.quantity * item.rate, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No line items to show.</p>
              )}

              <p>
                The above price is valid for 30 days. <b>COMPANY NAME</b> agrees that they will enter into a standard AIA
                subcontract with General Contractor, and that basic provisions such as insurance and W-9 shall be in
                place prior to start.
              </p>
              <div className="row mt-5 align-items-end">
                <div className="col-6">
                  <p><strong>Contractor:</strong> <u>Lalit Singh</u><br />
                    <small>kiaan technology</small>
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p><small>Date</small><br />7/2/2025</p>
                </div>
              </div>
              <p><strong>ACCEPTANCE OF PROPOSAL:</strong> The above prices, scope, specifications and conditions are satisfactory and hereby accepted. You are authorized to do the work specified.</p>
              <div className="row mt-4">
                <div className="col-6">
                  <p><strong>ACCEPTED BY:</strong> _____________________________</p>
                </div>
                <div className="col-6">
                  <p>______________________</p>
                </div>
              </div>
              <p className="text-center small mt-5">
                Address will come here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalEmailUI;
