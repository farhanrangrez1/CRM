// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   Card,
//   Modal,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge
// } from 'react-bootstrap';
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft } from 'react-icons/fa';
// // import { fetchAllProposals } from '../../slices/proposalSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { createDailyLog, fetchAllDailyLogs, updateDailyLog, deleteDailyLog } from '../../../redux/slices/dailyLogsSlice';
// import { createComment, fetchAllComments, deleteComment, updateComment, fetchCommentById } from '../../../redux/slices/commentsSlice';
// import Swal from 'sweetalert2';
// import { deleteproject, fetchProject } from '../../../redux/slices/ProjectsSlice';
// import { fetchusers } from '../../../redux/slices/userSlice';
// const DailyLogs = () => {
//   // State management

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [currentLogIndex, setCurrentLogIndex] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [logCommentsMap, setLogCommentsMap] = useState({});
//   const [expandedLogs, setExpandedLogs] = useState(new Set());


//   const [invoice, setInvoice] = useState(null);
//   useEffect(() => {
//     const storedInvoice = localStorage.getItem("invoice");
//     if (storedInvoice) {
//       setInvoice(JSON.parse(storedInvoice));
//     }
//   }, []);

//   const permissiondata = JSON.parse(localStorage.getItem("permissions"));

//   const permissions = JSON.parse(localStorage.getItem('permissions'));
//   const user_id = permissions?.userId;


//   // const proposalId = localStorage.getItem("proposalId");
//   const [formData, setFormData] = useState({
//     job_id: invoice?._id,
//     date: new Date().toISOString().split('T')[0],
//     title: '',
//     notes: '',
//     image: null,
//     created_by: JSON.stringify(permissiondata?.userId)
//   });



//   useEffect(() => {
//     if (invoice) {
//       setFormData((prev) => ({
//         ...prev,
//         job_id: invoice?._id
//       }));
//     }
//   }, [invoice]);

//   const [blogId, setBlogId] = useState('')

//   const navigate = useNavigate();
//   const dispatch = useDispatch()
//   // const user_id = localStorage.getItem('user_id')
//   useEffect(() => {
//     // dispatch(fetchAllProposals())
//     dispatch(fetchAllDailyLogs())
//     dispatch(fetchProject())

//   }, [dispatch]);

//   const handleFormChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files : value,  // Save files as an array
//     }));
//   };

//   const handleSaveLog = () => {
//     const data = new FormData();
//     data.append("job_id", formData.job_id);
//     data.append("date", formData.date);
//     data.append("title", formData.title);
//     data.append("notes", formData.notes);
//     data.append("created_by", user_id); // <-- Add this line

//     if (formData.images) {
//       Array.from(formData.images).forEach((image) => {
//         data.append("images", image);
//       });
//     }

//     if (currentLogIndex !== null) {
//       const logId = dailyLogs[currentLogIndex]?.id;
//       dispatch(updateDailyLog({ id: logId, data }));
//     } else {
//       dispatch(createDailyLog(data));
//     }

//     setFormData({
//       job_id: invoice?._id || '',
//       date: new Date().toISOString().split('T')[0],
//       title: '',
//       notes: '',
//       image: null
//     });
//     dispatch(fetchAllDailyLogs())

//     setShowEditModal(false);
//     setCurrentLogIndex(null);
//   };



//   // const proposals = useSelector((state) => state?.proposals?.proposals || []);
//   const dailyLogs = useSelector((state) => state?.dailyLogs?.logs || []);
//   const comments = useSelector((state) => state?.comments?.comments || []);
//   const project = useSelector((state) => state.projects?.project?.data);
//   // console.log("Daily Logs:", dailyLogs);

//   //  console.log("pr",project)
//   const [dailyLogImage, setDailyLogImage] = useState(null);


//   const handleDeleteLog = (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "This will permanently delete the Log.",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         dispatch(deleteDailyLog(id))
//           .unwrap()
//           .then(() => {
//             Swal.fire('Deleted!', 'The Log has been removed.', 'success');
//             dispatch(fetchAllDailyLogs());
//           })
//           .catch((error) => {
//             Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
//           });
//       }
//     });
//   }


//   useEffect(() => {
//     dispatch(fetchusers());
//   }, [dispatch]);

//   const { userAll } = useSelector((state) => state.user);
//   const users = userAll?.data?.users || [];

//   const getUserNameById = (id) => {
//     const user = users.find((u) => u._id === id);
//     return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
//   };


//   // const handleAddComment = () => {
//   //   // console.log(id)
//   //   if (newComment.trim() === '') return;
//   //   const payload = {
//   //     user_id,
//   //     dailylog_id: blogId,
//   //     comment: newComment,

//   //   }
//   //   dispatch(createComment(payload))
//   //   setNewComment('');
//   //   setShowCommentModal(false);
//   // };

//   // const handleAddComment = () => {
//   //   if (newComment.trim() === '') return;

//   //   const payload = {
//   //     user_id,
//   //     dailylog_id: blogId,
//   //     comment: newComment,
//   //   };

//   //   dispatch(createComment(payload))
//   //     .unwrap()
//   //     .then((result) => {
//   //       // Assuming result contains the newly created comment
//   //       const newCommentData = {
//   //         ...result.data, // Adjust this based on your API response structure
//   //         user_id, // Add user_id if not included in the result
//   //       };

//   //       // Update the logCommentsMap with the new comment
//   //       setLogCommentsMap((prev) => ({
//   //         ...prev,
//   //         [blogId]: [...(prev[blogId] || []), newCommentData], // Append the new comment
//   //       }));

//   //       setNewComment('');
//   //       setShowCommentModal(false);
//   //     })
//   //     .catch((error) => {
//   //       Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
//   //     });
//   // };
//   const handleAddComment = () => {
//     if (newComment.trim() === '') return;
//     const payload = {
//       user_id,
//       dailylog_id: blogId,
//       comment: newComment,
//     };
//     dispatch(createComment(payload))
//       .unwrap()
//       .then((result) => {
//         const newCommentData = {
//           ...result.data, // Adjust this based on your API response structure
//           user_id, // Add user_id if not included in the result
//         };
//         // Update the logCommentsMap with the new comment
//         setLogCommentsMap((prev) => ({
//           ...prev,
//           [blogId]: [...(prev[blogId] || []), newCommentData], // Append the new comment
//         }));
//         setNewComment('');
//         setShowCommentModal(false);
//       })
//       .catch((error) => {
//         Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
//       });
//   };

//   const handleDownloadImages = async (images) => {
//     for (let i = 0; i < images.length; i++) {
//       try {
//         const response = await fetch(images[i], { mode: 'cors' });
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `daily-log-image-${i + 1}.jpg`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error("Download failed", error);
//       }
//     }
//   };

//   const filteredLogs = [...dailyLogs].filter(item => item.job_id == invoice?._id).reverse();

//   useEffect(() => {
//     const fetchVisibleLogComments = async () => {
//       for (let log of filteredLogs) {
//         if (!logCommentsMap[log.id]) {
//           try {
//             const result = await dispatch(fetchCommentById(log.id)).unwrap();
//             setLogCommentsMap(prev => ({
//               ...prev,
//               [log.id]: result.data.comments || []
//             }));
//           } catch (error) {
//             console.error(`Failed to fetch comments for log ${log.id}`, error);
//           }
//         }
//       }
//     };
//     if (filteredLogs.length > 0) {
//       fetchVisibleLogComments();
//     }
//   }, [filteredLogs]); // Only run when filteredLogs changes

//   return (
//     <div className="p-4">
//       {/* <div className="mb-3">
//         <Button variant="outline-secondary" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-1" /> Back
//         </Button>
//       </div> */}

//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="fw-bold mb-0">Daily Logs</h4>
//         <Button
//           variant="primary"
//           onClick={() => {
//             setCurrentLogIndex(null);
//             setFormData({
//               job_id: invoice?._id,
//               date: new Date().toISOString().split('T')[0],
//               title: '',
//               notes: '',
//               image: null
//             });
//             setDailyLogImage(null);
//             setShowEditModal(true);
//           }}
//         >
//           + New Daily Log
//         </Button>

//       </div>

//       {dailyLogs?.filter(item => item.job_id == invoice?._id).length === 0 ? (
//         <Card className="text-center p-4">
//           <Card.Body>
//             <h5>No daily logs found</h5>
//             <p className="text-muted">Create your first daily log to get started</p>
//             <Button
//               variant="primary"
//               onClick={() => setShowEditModal(true)}
//             >
//               Create Daily Log
//             </Button>
//           </Card.Body>
//         </Card>
//       ) : (
//         // dailyLogs?.filter(item => item.job_id == invoice?._id).map((log, idx) => (
//         [...dailyLogs]?.filter(item => item.job_id == invoice?._id).reverse().map((log, idx) => (

//           <Card key={log.id} className="mb-4 shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h5 className="mb-1">
//                     {log.title} <span className="text-muted small ms-2">{log.date}</span>
//                   </h5>
//                   <small className="text-muted">
//                     Created by: {getUserNameById(log.created_by) || 'Unknown'}
//                   </small>
//                   {/* <div className="mb-2">
//                     {log.badges.map((badge, i) => (
//                       <Badge key={i} bg="secondary" className="me-1">
//                         {badge}
//                       </Badge>
//                     ))}
//                   </div> */}
//                 </div>
//                 <div>
//                   <Button
//                     variant="outline-danger"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => handleDeleteLog(log?.id)}
//                   >
//                     Delete
//                   </Button>
//                   <Button
//                     variant="outline-secondary"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => {
//                       setCurrentLogIndex(idx);
//                       // const log = dailyLogs[idx];
//                       setFormData({
//                         job_id: log.job_id || '',
//                         date: log.date || '',
//                         title: log.title || '',
//                         notes: log.notes || '',
//                         image: log.image || ''
//                       });
//                       setDailyLogImage(null); // Clear previous preview
//                       setShowEditModal(true);
//                     }}
//                   >
//                     Edit
//                   </Button>

//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => {
//                       // handleAddComment(log.id);
//                       setBlogId(log?.id);
//                       // setCurrentLogIndex(idx);
//                       setShowCommentModal(true);
//                     }}
//                   >
//                     Comment
//                   </Button>
//                   {log.images?.length > 0 && (
//                     <Button
//                       variant="outline-success"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => handleDownloadImages(log.images)}
//                     >
//                       Download
//                     </Button>

//                   )}

//                 </div>
//               </div>

//               {/* Render images associated with the daily log */}
//               <div className="d-flex flex-wrap gap-2 mb-3">
//                 {log.images && log.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     alt={`log-image-${i}`}
//                     className="rounded"
//                     style={{
//                       width: 90,
//                       height: 70,
//                       objectFit: "cover",
//                       marginRight: "10px"
//                     }}
//                   />
//                 ))}
//               </div>


//               {/* )} */}

//               <div className="mb-3" style={{ whiteSpace: "pre-line" }}>
//                 {log.notes}
//               </div>

//               {/* Comment toggle icon */}
//               <div
//                 className="text-muted small d-flex align-items-center mb-2 cursor-pointer"
//                 onClick={async () => {
//                   const isExpanded = expandedLogs.has(log.id);
//                   const newSet = new Set(expandedLogs);

//                   if (isExpanded) {
//                     newSet.delete(log.id); // collapse
//                   } else {
//                     newSet.add(log.id); // expand

//                     // Fetch comments if not already loaded
//                     if (!logCommentsMap[log.id]) {
//                       try {
//                         console.log(log.id);

//                         const result = await dispatch(fetchCommentById(log.id)).unwrap();
//                         console.log(result);

//                         setLogCommentsMap(prev => ({
//                           ...prev,
//                           [log.id]: result.data.comments // Ensure this is the correct path to comments
//                         }));
//                       } catch (err) {
//                         console.error("Failed to fetch comments", err);
//                       }
//                     }
//                   }

//                   setExpandedLogs(newSet);
//                 }}

//                 style={{ cursor: 'pointer' }}
//               >
//                 <i className={`fas ${log.showComments ? 'fa-comments' : 'fa-comment'} me-2`}></i>
//                 Comments
//                 <span className="ms-1 text-primary fw-bold">
//                   ({logCommentsMap[log.id]?.length || 0})
//                 </span>
//               </div>

//               {/* Comments section - shows when expanded */}
//               {expandedLogs.has(log.id) && (
//                 <div className="border-top pt-3">
//                   {logCommentsMap[log.id]?.length > 0 ? (
//                     <div
//                       className="mb-3"
//                       style={{
//                         maxHeight: '200px',
//                         overflowY: 'auto',
//                         scrollbarWidth: 'thin',
//                         paddingRight: '8px'
//                       }}
//                     >
//                       {logCommentsMap[log.id].map((comment, i) => (
//                         <div key={i} className="mb-3 p-2 bg-light rounded">
//                           <div className="d-flex justify-content-between">
//                             <strong>{getUserNameById(comment.user_id)}</strong> {/* Display user name instead of user_id */}
//                             <span className="text-muted small">
//                               {new Date(comment.created_at).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <div className="mt-1">{comment.comment}</div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-muted small mb-3">No comments yet</div>
//                   )}

//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     className="mt-2"
//                     onClick={() => {
//                       setBlogId(log?.id);
//                       setShowCommentModal(true);
//                     }}
//                   >
//                     <i className="fas fa-plus me-1"></i> Add Comment
//                   </Button>
//                 </div>
//               )}

//             </Card.Body>
//           </Card>
//         ))
//       )}


//       <Modal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         centered
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {currentLogIndex !== null ? 'Edit Daily Log' : 'Create Daily Log'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             {/* </Row> */}
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="notes"
//                   rows={5}
//                   value={formData.notes}
//                   onChange={handleFormChange}
//                 />
//               </Form.Group>

//               {/* Multiple Images Upload */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Upload Images (optional)</Form.Label>
//                 <Form.Control
//                   type="file"
//                   name="images"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => {
//                     handleFormChange(e);
//                     setDailyLogImage(e.target.files); // Store multiple files
//                   }}
//                 />
//                 {/* Preview of selected images */}
//                 {dailyLogImage && (
//                   <div className="mt-2">
//                     <strong>Preview:</strong><br />
//                     {Array.from(dailyLogImage).map((file, idx) => (
//                       <img
//                         key={idx}
//                         src={URL.createObjectURL(file)}
//                         alt="Preview"
//                         style={{
//                           maxWidth: '100%',
//                           maxHeight: '200px',
//                           borderRadius: '6px',
//                           marginRight: '10px',
//                         }}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </Form.Group>
//             </Col>
//             <div className="d-flex justify-content-end">
//               <Button variant="primary" onClick={handleSaveLog}>
//                 {currentLogIndex !== null ? 'Update Log' : 'Publish Log'}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>



//       {/* Comment Modal - Only opens when Comment button is clicked */}
//       <Modal
//         show={showCommentModal}
//         onHide={() => setShowCommentModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>

//         </Modal.Header>
//         <Modal.Body>

//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Add New Comment</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Enter your comment here..."
//               />
//             </Form.Group>
//             <div className="d-flex justify-content-end gap-2">
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => {
//                   setShowCommentModal(false);
//                   setNewComment('');
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 onClick={() => { handleAddComment() }}
//               >
//                 Post Comment
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>

//     </div>
//   );
// }

// export default DailyLogs;
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Modal,
  Form,
  Col
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createDailyLog, fetchAllDailyLogs, updateDailyLog, deleteDailyLog } from '../../../redux/slices/dailyLogsSlice';
import { createComment, fetchCommentById } from '../../../redux/slices/commentsSlice';
import Swal from 'sweetalert2';
import { fetchusers } from '../../../redux/slices/userSlice';

const DailyLogs = () => {
  // State management
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [logCommentsMap, setLogCommentsMap] = useState({});
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);

  const permissiondata = JSON.parse(localStorage.getItem("permissions"));
  const user_id = permissiondata?.userId;

  const [formData, setFormData] = useState({
    job_id: invoice?._id,
    date: new Date().toISOString().split('T')[0],
    title: '',
    notes: '',
    image: null,
    created_by: JSON.stringify(permissiondata?.userId)
  });

  useEffect(() => {
    if (invoice) {
      setFormData((prev) => ({
        ...prev,
        job_id: invoice?._id
      }));
    }
  }, [invoice]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDailyLogs());
    dispatch(fetchusers());
  }, [dispatch]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };
  const [blogId, setBlogId] = useState('')

  const handleSaveLog = () => {
    const data = new FormData();
    data.append("job_id", formData.job_id);
    data.append("date", formData.date);
    data.append("title", formData.title);
    data.append("notes", formData.notes);
    data.append("created_by", user_id);

    if (formData.images) {
      Array.from(formData.images).forEach((image) => {
        data.append("images", image);
      });
    }

    if (currentLogIndex !== null) {
      const logId = dailyLogs[currentLogIndex]?.id;
      dispatch(updateDailyLog({ id: logId, data }));
    } else {
      dispatch(createDailyLog(data));
    }

    setFormData({
      job_id: invoice?._id || '',
      date: new Date().toISOString().split('T')[0],
      title: '',
      notes: '',
      image: null
    });
    dispatch(fetchAllDailyLogs());
    setShowEditModal(false);
    setCurrentLogIndex(null);
  };

  const dailyLogs = useSelector((state) => state?.dailyLogs?.logs || []);
  const [dailyLogImage, setDailyLogImage] = useState(null);

  const handleDeleteLog = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the Log.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDailyLog(id))
          .unwrap()
          .then(() => {
            Swal.fire('Deleted!', 'The Log has been removed.', 'success');
            dispatch(fetchAllDailyLogs());
          })
          .catch((error) => {
            Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
          });
      }
    });
  };

  const { userAll } = useSelector((state) => state.user);
  const users = userAll?.data?.users || [];

  const getUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
  };

  const handleDownloadImages = async (images) => {
    for (let i = 0; i < images.length; i++) {
      try {
        const response = await fetch(images[i], { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily-log-image-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed", error);
      }
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const payload = {
      user_id,
      dailylog_id: blogId,
      comment: newComment,
    };
    dispatch(createComment(payload))
      .unwrap()
      .then((result) => {
        const newCommentData = {
          ...result.data,
          user_id,
        };
        setLogCommentsMap((prev) => ({
          ...prev,
          [blogId]: [...(prev[blogId] || []), newCommentData],
        }));
        setNewComment('');
        setShowCommentModal(false);
      })
      .catch((error) => {
        Swal.fire('Error!', error.message || 'Something went wrong.', 'error');
      });
  };

  const filteredLogs = [...dailyLogs].filter(item => item.job_id == invoice?._id).reverse();

  useEffect(() => {
    const fetchVisibleLogComments = async () => {
      for (let log of filteredLogs) {
        if (!logCommentsMap[log.id]) {
          try {
            const result = await dispatch(fetchCommentById(log.id)).unwrap();
            // Filter out null or empty comments
            const validComments = result.data.comments.filter(comment =>
              comment && comment.comment !== null && comment.user_id !== null
            );
            setLogCommentsMap(prev => ({
              ...prev,
              [log.id]: validComments || []
            }));
          } catch (error) {
            console.error(`Failed to fetch comments for log ${log.id}`, error);
          }
        }
      }
    };
    if (filteredLogs.length > 0) {
      fetchVisibleLogComments();
    }
  }, [filteredLogs]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Daily Logs</h4>
        <Button
          variant="primary"
          onClick={() => {
            setCurrentLogIndex(null);
            setFormData({
              job_id: invoice?._id,
              date: new Date().toISOString().split('T')[0],
              title: '',
              notes: '',
              image: null
            });
            setDailyLogImage(null);
            setShowEditModal(true);
          }}
        >
          + New Daily Log
        </Button>
      </div>

      {dailyLogs?.filter(item => item.job_id == invoice?._id).length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No daily logs found</h5>
            <p className="text-muted">Create your first daily log to get started</p>
            <Button
              variant="primary"
              onClick={() => setShowEditModal(true)}
            >
              Create Daily Log
            </Button>
          </Card.Body>
        </Card>
      ) : (
        [...dailyLogs]?.filter(item => item.job_id == invoice?._id).reverse().map((log, idx) => (
          <Card key={log.id} className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-1">
                    {log.title} <span className="text-muted small ms-2">{log.date}</span>
                  </h5>
                  <small className="text-muted">
                    Created by: {getUserNameById(log.created_by) || 'Unknown'}
                  </small>
                </div>
                <div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDeleteLog(log?.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setCurrentLogIndex(idx);
                      setFormData({
                        job_id: log.job_id || '',
                        date: log.date || '',
                        title: log.title || '',
                        notes: log.notes || '',
                        image: log.image || ''
                      });
                      setDailyLogImage(null);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setBlogId(log?.id);
                      setShowCommentModal(true);
                    }}
                  >
                    Comment
                  </Button>
                  {log.images?.length > 0 && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDownloadImages(log.images)}
                    >
                      Download
                    </Button>

                  )}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {log.images && log.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`log-image-${i}`}
                    className="rounded"
                    style={{
                      width: 90,
                      height: 70,
                      objectFit: "cover",
                      marginRight: "10px"
                    }}
                  />
                ))}
              </div>

              <div className="mb-3" style={{ whiteSpace: "pre-line" }}>
                {log.notes}
              </div>

              <div
                className="text-muted small d-flex align-items-center mb-2 cursor-pointer"
                onClick={() => {
                  const isExpanded = expandedLogs.has(log.id);
                  const newSet = new Set(expandedLogs);
                  if (isExpanded) {
                    newSet.delete(log.id);
                  } else {
                    newSet.add(log.id);
                  }
                  setExpandedLogs(newSet);
                }}
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas ${expandedLogs.has(log.id) ? 'fa-comments' : 'fa-comment'} me-2`}></i>
                Comments
                <span className="ms-1 text-primary fw-bold">
                  ({logCommentsMap[log.id]?.length || 0})
                </span>
              </div>

              {expandedLogs.has(log.id) && (
                <div className="border-top pt-3">
                  {logCommentsMap[log.id]?.length > 0 ? (
                    <div className="mb-3">
                      {logCommentsMap[log.id].map((comment, i) => (
                        <div key={i} className="mb-3 p-2 bg-light rounded">
                          <div className="d-flex justify-content-between">
                            <strong>{getUserNameById(comment.user_id)}</strong>
                            <span className="text-muted small">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-1">{comment.comment}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted small mb-3">No comments yet</div>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setBlogId(log?.id);
                      setShowCommentModal(true);
                    }}
                  >
                    <i className="fas fa-plus me-1"></i> Add Comment
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLogIndex !== null ? 'Edit Daily Log' : 'Create Daily Log'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  rows={5}
                  value={formData.notes}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Images (optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleFormChange(e);
                    setDailyLogImage(e.target.files);
                  }}
                />
              </Form.Group>
            </Col>
            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={handleSaveLog}>
                {currentLogIndex !== null ? 'Update Log' : 'Publish Log'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment here..."
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowCommentModal(false);
                  setNewComment('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddComment}
              >
                Post Comment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DailyLogs;
