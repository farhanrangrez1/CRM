// import { useSelector, useDispatch } from "react-redux";
// import {
//   deleteDocument,
//   fetchDocumentById,
// } from "../../../redux/slices/saveDocumentSlice";
// import { useEffect, useState } from "react";
// import { fetchAllDailyLogs } from "../../../redux/slices/dailyLogsSlice";

// const DocumentList = ({ documents, previewUrl, setPreviewUrl }) => {
//   const dispatch = useDispatch();
//   const [invoice, setInvoice] = useState(null);
//   useEffect(() => {
//     const storedInvoice = localStorage.getItem("invoice");
//     if (storedInvoice) {
//       setInvoice(JSON.parse(storedInvoice));
//     }
//   }, []);
//   // const proposalId = localStorage.getItem("proposalId");
//   const dailyLogs = useSelector((state) => state?.dailyLogs?.logs || []);
//   useEffect(() => {
//     dispatch(fetchDocumentById(invoice?._id));
//     dispatch(fetchAllDailyLogs())
//   }, [invoice, dispatch])

//   const handlePreview = (url) => setPreviewUrl(url);

//   const handleDownload = (url) => {
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = url.split("/").pop();
//     a.click();
//   };

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this document?");
//     if (!confirm) return;

//     try {
//       await dispatch(deleteDocument(id)).unwrap();
//       await dispatch(fetchDocumentById(invoice?._id));
//     } catch (err) {
//       console.error("Failed to delete or fetch documents:", err);
//     }
//   };

//   return (
//     <>
//       <div className="container mt-4">
//         <h4 className="fw-bold mb-3">Uploaded Documents</h4>
//         <ul className="list-group">
//           {documents?.filter((item) => item.proposal_id == invoice?._id)?.map((doc) => (
//             <li
//               key={doc.id}
//               className="list-group-item d-flex justify-content-between align-items-center"
//             >
//               <div
//                 className="d-flex align-items-center gap-3"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePreview(doc.file_urls[0])}
//               >
//                 {doc.file_urls[0]?.endsWith(".pdf") ? (
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
//                     alt="PDF Icon"
//                     style={{ width: "40px", height: "auto" }}
//                   />
//                 ) : (
//                   <img
//                     src={doc.file_urls[0]}
//                     alt={doc.title}
//                     style={{
//                       width: "60px",
//                       height: "auto",
//                       objectFit: "cover",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 )}
//                 <span className="text-primary">{doc.title}</span>
//               </div>

//               <div>
//                 <button
//                   className="btn btn-sm btn-outline-success me-2"
//                   onClick={() => handleDownload(doc.file_urls[0])}
//                 >
//                   Download
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={() => handleDelete(doc.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>

//         {/* Preview Modal */}
//         {previewUrl && (
//           <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//             <div className="modal-dialog modal-lg" role="document">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Preview File</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setPreviewUrl(null)}
//                   ></button>
//                 </div>
//                 <div className="modal-body text-center">
//                   {previewUrl.endsWith(".pdf") ? (
//                     <iframe
//                       src={previewUrl}
//                       title="PDF Preview"
//                       width="100%"
//                       height="500px"
//                     />
//                   ) : (
//                     <img
//                       src={previewUrl}
//                       alt="Preview"
//                       style={{ maxWidth: "100%" }}
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default DocumentList;

import { useSelector, useDispatch } from "react-redux";
import {
  deleteDocument,
  fetchDocumentById,
} from "../../../redux/slices/saveDocumentSlice";
import { useEffect, useState } from "react";
import { fetchAllDailyLogs } from "../../../redux/slices/dailyLogsSlice";
import { fetchusers } from "../../../redux/slices/userSlice";

const DocumentList = ({ documents, previewUrl, setPreviewUrl }) => {
  const dispatch = useDispatch();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);

  const dailyLogs = useSelector((state) => state?.dailyLogs?.logs || []);

  useEffect(() => {
    if (invoice?._id) {
      dispatch(fetchDocumentById(invoice._id));
      dispatch(fetchAllDailyLogs());
    }
  }, [invoice, dispatch]);
  useEffect(() => {
    dispatch(fetchusers());
  }, [dispatch]);

  const { userAll } = useSelector((state) => state.user);
  const users = userAll?.data?.users || [];

  const getUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";
  };

  const handlePreview = (url) => setPreviewUrl(url);

  const handleDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    a.click();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this document?");
    if (!confirm) return;

    try {
      await dispatch(deleteDocument(id)).unwrap();
      await dispatch(fetchDocumentById(invoice?._id));
    } catch (err) {
      console.error("Failed to delete or fetch documents:", err);
    }
  };

  // Combine documents from upload and dailyLogs
  const allDocs = [
    ...(documents?.filter((doc) => doc.proposal_id === invoice?._id)?.map((doc) => ({
      id: doc.id,
      title: doc.title,
      fileUrl: doc.file_urls?.[0],
      source: "Upload Tab",
      uploadedBy: getUserNameById(doc.created_by),
    })) || []),
    ...(dailyLogs?.flatMap((log) =>
      (log.attachments || []).map((fileUrl, idx) => ({
        id: `${log.id}-${idx}`,
        title: `Daily Log: ${log.title || "Untitled"}`,
        fileUrl,
        source: "Daily Logs",
        uploadedBy: getUserNameById(log.created_by),
      }))
    ) || []),
  ];

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">All Uploaded Documents</h4>
      {allDocs.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <ul className="list-group">
          {allDocs.map((doc) => {
            return (
              <li
                key={doc.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div
                  className="d-flex align-items-center gap-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePreview(doc.fileUrl)}
                >
                  {doc.fileUrl?.endsWith(".pdf") ? (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                      alt="PDF Icon"
                      style={{ width: "40px", height: "auto" }}
                    />
                  ) : (
                    <img
                      src={doc.fileUrl}
                      alt="Preview"
                      style={{
                        width: "60px",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div>
                    <div className="fw-semibold text-primary">{doc.title}</div>
                    <div className="small text-muted">Source: {doc.source}</div>
                    <div className="small text-muted">Uploaded by: {doc.uploadedBy}</div>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-outline-success me-2"
                    onClick={() => handleDownload(doc.fileUrl)}
                  >
                    Download
                  </button>
                  {doc.source === "Upload Tab" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            )
          }

          )}
        </ul>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview File</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPreviewUrl(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {previewUrl.endsWith(".pdf") ? (
                  <iframe
                    src={previewUrl}
                    title="PDF Preview"
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
