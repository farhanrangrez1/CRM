// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const ProposalEmailUI = () => {
//   const proposalData = {
//     sendTo: "bob@bobsburgers.com",
//     subject: "Proposal for serdhbdf",
//     message: `Hi,

// Please find attached the proposal for serdhbdf. You can view and either accept or reject the proposal by clicking the following link:
// ^Link^

// Regards,
// Lalit Singh`,
//     pdfImagePreview: "https://cdn.openai.com/chatgpt/4caf8052-e5e5-41f9-9352-2cd78723a4cc.png",
//   };

//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile({
//         name: file.name,
//         size: `${(file.size / 1024).toFixed(2)} KB`,
//       });
//     }
//   };

//   const handleProjectDocSelect = () => {
//     const fakeFile = {
//       name: "project-document.pdf",
//       size: "240 KB",
//     };
//     setSelectedFile(fakeFile);
//   };

//   return (
//     <div className="container-fluid bg-light p-4">
//       <div className="row mb-4">
//         <div className="col-12">
//           <h5 className="text-muted">serdhbdf</h5>
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
//                 <input type="email" className="form-control" value={proposalData.sendTo} readOnly />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Subject</label>
//                 <input type="text" className="form-control" value={proposalData.subject} readOnly />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Message</label>
//                 <textarea
//                   className="form-control"
//                   rows={6}
//                   value={proposalData.message}
//                   readOnly
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Attachments</label>

//                 <div className="d-flex gap-2 mb-2">
//                   <input type="file" onChange={handleFileChange} className="form-control" />
//                   <button type="button" className="btn btn-outline-primary" onClick={handleProjectDocSelect}>
//                     Select from Project
//                   </button>
//                 </div>

//                 {selectedFile && (
//                   <div className="d-flex justify-content-between align-items-center border p-2 rounded">
//                     <span className="text-primary">📎 {selectedFile.name}</span>
//                     <small className="text-muted">{selectedFile.size}</small>
//                   </div>
//                 )}
//               </div>

//               <button type="button" className="btn btn-success me-2">Send email</button>
//               <button type="button" className="btn btn-outline-secondary">Discard</button>
//             </form>

//             <div className="mt-4">
//               <button type="button" className="btn btn-link p-0">Advanced settings ▾</button>
//             </div>
//           </div>
//         </div>

//         {/* Proposal HTML Preview Section */}
//         <div className="col-md-5">
//           <div className="card shadow-sm p-3">
//             <div className="d-flex justify-content-between align-items-center">
//               <h6 className="fw-bold">Preview PDF</h6>
//               <span className="text-muted">Page 1/1</span>
//             </div>
//             <div
//               className="mt-3 border rounded overflow-auto"
//               style={{ height: "600px", background: "#fff", padding: "1rem" }}
//             >
//               <div className="proposal">
//                 <h5 className="text-center fw-bold border-bottom pb-2">PROPOSAL</h5>

//                 <div className="row mb-3">
//                   <div className="col-6"><strong>ATTN:</strong> 33</div>
//                   <div className="col-6"><strong>PROJECT:</strong> serhbdhf</div>
//                 </div>
//                 <div className="row mb-3">
//                   <div className="col-6">
//                     <strong>TO:</strong><br />
//                     Bob Belcher<br />
//                     303 Ocean Avenue<br />
//                     Jersey City, NJ 07305
//                   </div>
//                   <div className="col-6">
//                     <strong>LOCATION:</strong> 303 Ocean Avenue<br />
//                     Jersey City, NJ<br />
//                     <strong>DATE:</strong> 7/2/2025
//                   </div>
//                 </div>

//                 <p>
//                   We propose to furnish all materials, equipment, and labor, subject to any exclusions listed below,
//                   required to complete the following:
//                 </p>

//                 <table className="table table-bordered mt-3">
//                   <tbody>
//                     <tr>
//                       <td>1.</td>
//                       <td>dd</td>
//                       <td className="text-end">$4,444.00</td>
//                     </tr>
//                     <tr>
//                       <td>2.</td>
//                       <td>interior</td>
//                       <td className="text-end">$44.00</td>
//                     </tr>
//                     <tr>
//                       <td colSpan="2" className="text-end"><strong>Total Proposal Value:</strong></td>
//                       <td className="text-end fw-bold">$4,488.00</td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 <p>
//                   The above price is valid for 30 days. kiaan technology agrees that they will enter into a standard AIA
//                   subcontract with General Contractor, and that basic provisions such as insurance and W-9 shall be in
//                   place prior to start.
//                 </p>

//                 <div className="row mt-5 align-items-end">
//                   <div className="col-6">
//                     <p><strong>Contractor:</strong> <u>Lalit Singh</u><br />
//                       <small>kiaan technology</small>
//                     </p>
//                   </div>
//                   <div className="col-6 text-end">
//                     <p><small>Date</small><br />7/2/2025</p>
//                   </div>
//                 </div>

//                 <p><strong>ACCEPTANCE OF PROPOSAL:</strong> The above prices, scope, specifications and conditions are satisfactory and hereby accepted. You are authorized to do the work specified.</p>

//                 <div className="row mt-4">
//                   <div className="col-6">
//                     <p><strong>ACCEPTED BY:</strong> _____________________________</p>
//                   </div>
//                   <div className="col-6">
//                     <p>______________________</p>
//                   </div>
//                 </div>

//                 <p className="text-center small mt-5">
//                   kiaan technology · 02 Revenue Nagar Anpurna Road Above Bajaj Shorom · Indore, MP 452001
//                 </p>
//               </div>
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

const ProposalEmailUI = () => {
  const proposalRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [signatureData, setSignatureData] = useState({});

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
    const generatePDF = async () => {
      const element = proposalRef.current;
      if (!element || !signatureData?.line_items?.length) return;

      // Small delay to ensure DOM is fully rendered
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

    const formData = new FormData();
    formData.append("email", proposalData.sendTo);
    formData.append("subject", proposalData.subject);
    formData.append("message", proposalData.message);
    formData.append("attachment", selectedFile.file);

    try {
      const response = await axios.post(
        "https://netaai-crm-backend-production-c306.up.railway.app/api/sendProposalEmail",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Email sent successfully!");
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to send email.");
      console.error(error);
    }
  };



  return (
    <div className="container-fluid bg-light p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="text-muted">serdhbdf</h5>
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
                    {/* <span className="text-primary">📎 {selectedFile.name}</span> */}
                    <span className="text-primary">📎 <a href={pdfUrl} download="proposal.pdf" className=" mb-3">
                      {selectedFile.name}
                    </a></span>
                    <small className="text-muted">{selectedFile.size}</small>
                  </div>
                )}
              </div>

              {/* <a href={pdfUrl} download="proposal.pdf" className="btn btn-outline-primary mb-3">
                Download Proposal PDF
              </a> */}

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
                <div className="col-6"><strong>PROJECT:</strong> {signatureData?.proposal_id}</div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <strong>TO:</strong><br />
                  {signatureData?.client_id}
                </div>
                <div className="col-6">
                  {/* <strong>LOCATION:</strong> 303 Ocean Avenue<br />
                  Jersey City, NJ<br /> */}
                  <strong>DATE:</strong> { }
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
