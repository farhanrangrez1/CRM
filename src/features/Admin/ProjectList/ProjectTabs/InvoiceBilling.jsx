
import React, { useEffect, useState } from 'react';
import { Form, Table, Badge, InputGroup, Button,Dropdown  } from 'react-bootstrap';
import { FaSearch, FaSort, FaEdit, FaTrash, FaDownload, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; // Only this import should remain
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../../redux/utils/axiosInstance';
import stamp from "../../../assets/stamp.png"
import { deleteInvoicingBilling, fetchInvoicingBilling } from '../../../../redux/slices/InvoicingBillingSlice';

function InvoiceBilling() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialInvoices = [
    {
      invoiceNumber: 'INV-12345',
      client: 'Acme Corp',
      project: 'Holiday Package Design',
      amount: 2500.00,
      status: 'Paid',
      dueDate: '2024-01-15'
    },
    {
      invoiceNumber: 'INV-12345',
      client: 'Tech Solutions',
      project: 'Product Catalog',
      amount: 3750.00,
      status: 'Pending',
      dueDate: '2024-01-30'
    },
    {
      invoiceNumber: 'INV-12345',
      client: 'Global Inc',
      project: 'Brand Guidelines',
      amount: 5000.00,
      status: 'Overdue',
      dueDate: '2024-01-10'
    }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      case 'Inactive':
        return 'secondary';
      case 'completed':
        return 'primary';
      case 'active':
        return 'success';
      default:
        return 'secondary';
    }
  };


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = initialInvoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(query) ||
      invoice.client.toLowerCase().includes(query) ||
      invoice.project.toLowerCase().includes(query)
    );
    setInvoices(filtered);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);

    const sorted = [...invoices].sort((a, b) => {
      if (field === 'amount') {
        return isAsc ? b[field] - a[field] : a[field] - b[field];
      }
      return isAsc
        ? b[field].localeCompare(a[field])
        : a[field].localeCompare(b[field]);
    });
    setInvoices(sorted);
  };

  const handleDownloadPDF = async (invoiceDataFromState) => {
    if (!invoiceDataFromState) {
      console.error("No data provided to handleDownloadPDF");
      Swal.fire("Error", "No data available to generate PDF.", "error");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/pdf/invoice?InvoiceBillingId=${invoiceDataFromState._id}`,
        {
          responseType: "blob",
        }
      );
      // Try to detect if the response is JSON (not a PDF)
      const isJson = response.data.type === "application/json";
      if (isJson) {
        const reader = new FileReader();
        reader.onload = async function () {
          let json;
          try {
            json = JSON.parse(reader.result);
            console.log('PDF API response as JSON:', json);
          } catch (e) {
            console.log('PDF API response as text:', reader.result);
            Swal.fire("Error", "Invalid JSON data received.", "error");
            return;
          }
          // Use the JSON data to generate the PDF
          const data = json.data && Array.isArray(json.data) ? json.data[0] : json;
          await generatePDFfromData(data);
        };
        reader.readAsText(response.data);
        return; // Stop further PDF logic if not a PDF
      }
      // If it's a PDF blob, download as before
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceDataFromState.invoiceNumber || "invoice"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error downloading invoice PDF:", error);
      alert("Failed to download invoice PDF.");
    }
  };

  // Helper to convert image URL to base64
  function getImageBase64FromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = function (err) {
        reject(err);
      };
      img.src = url;
    });
  }

  // Helper function to generate PDF from API JSON data
  const generatePDFfromData = async (invoiceData) => {
    const companyDetails = {
      logoText: 'COMPANY LOGO',
      addressDetails: 'COMPANY ADDRESS DETAILS',
      name: 'Company name',
      trn: invoiceData.clientId?.TaxID_VATNumber || 'N/A',
    };
    const invoiceMeta = {
      date: invoiceData.date ? new Date(invoiceData.date).toLocaleDateString("en-GB") : 'N/A',
      invoiceNo: invoiceData._id || 'N/A',
    };
    // Try to get client details from the API JSON structure
    const client = invoiceData.clientId && typeof invoiceData.clientId === 'object' && !Array.isArray(invoiceData.clientId)
      ? invoiceData.clientId
      : (invoiceData.clients && typeof invoiceData.clients === 'object' ? invoiceData.clients : {});
    const clientDetails = {
      name: client?.clientName || 'N/A',
      address1: client?.clientAddress || 'N/A',
      address2: client?.shippingInformation?.[0]?.shippingAddress || 'N/A',
      tel: client?.contactPersons?.[0]?.phone || 'N/A',
      contactPerson: client?.contactPersons?.[0]?.contactName || 'N/A',
      email: client?.contactPersons?.[0]?.email || 'N/A',
      trn: invoiceData.clientId?.TaxID_VATNumber || 'N/A',
    };
    const project = invoiceData.projectId && Array.isArray(invoiceData.projectId) && invoiceData.projectId[0]
      ? invoiceData.projectId[0]
      : {};
    const projectInfo = {
      costEstNo: invoiceData.CostEstimatesId?.estimateRef || 'N/A',
      poNo: invoiceData?.ReceivablePurchaseId?.PONumber || 'N/A',
      projectNo: project?.projectNo || 'N/A',
      projectName: project?.projectName || 'N/A',
    };
    
    const bankDetails = {
      accountName: client?.financialInformation?.[0]?.bankName || 'Company Name',
      bankName: client?.financialInformation?.[0]?.bankName || 'Company Bank Name',
      iban: client?.financialInformation?.[0]?.accountNumber || 'XX000000000000000000001',
      swiftCode: 'XXXAAACC',
      terms: client?.additionalInformation?.paymentTerms || 'Net 30',
    };
    const items = invoiceData.lineItems && invoiceData.lineItems.length > 0
      ? invoiceData.lineItems.map((item, index) => [
        (index + 1).toString() + '.',
        item.description,
        item.quantity,
        item.rate,
        parseFloat(item.amount).toFixed(2)
      ])
      : [
        ['1.', 'No items', 0, 0, '0.00'],
      ];
    const subTotal = items.reduce((sum, item) => sum + parseFloat(item[4]), 0);
    // Use VAT from API if available, else default to 10%
    const vatRate = (typeof invoiceData.VATRate === 'number' ? invoiceData.VATRate : 10) / 100;
    const vatAmount = subTotal * vatRate;
    const grandTotal = subTotal + vatAmount;
    const amountInWords = `US Dollars ${numberToWords(grandTotal)} Only`;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    let finalY = margin;
    doc.setFillColor(192, 0, 0);
    doc.rect(margin, finalY, 220, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(companyDetails.logoText, margin + 10, finalY + 25);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(companyDetails.addressDetails, margin + 10, finalY + 45);
    const companyNameBlockY = finalY;
    doc.setFillColor(192, 0, 0);
    doc.rect(pageWidth - margin - 150, companyNameBlockY, 150, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(companyDetails.name, pageWidth - margin - 140, companyNameBlockY + 20, { align: 'left' });
    let titleY = companyNameBlockY + 30 + 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Invoice', pageWidth - margin, titleY, { align: 'right' });
    let tableDetailsY = titleY + 10;
    autoTable(doc, {
      startY: tableDetailsY,
      head: [['TRN:', 'Date', 'Invoice No.']],
      body: [[companyDetails.trn, invoiceMeta.date, invoiceMeta.invoiceNo]],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 5, lineWidth: 0.5, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 150, halign: 'left' },
        1: { cellWidth: 80, halign: 'left' },
        2: { cellWidth: 80, halign: 'left' },
      },
      margin: { right: margin, left: pageWidth - margin - (150 + 80 + 80) - 10 },
      tableWidth: 'wrap',
    });
    finalY = doc.lastAutoTable.finalY + 20;
    const invoiceToBoxWidth = 250;
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, finalY, invoiceToBoxWidth, 100, 'S');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice To', margin + 5, finalY + 15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let textYInvoiceTo = finalY + 30;
    [
      `Client Company: ${clientDetails?.name}`,
      `Client Address: ${clientDetails?.address1}`,
      `Client Address2: ${clientDetails?.address2}`,
      `Tel: ${clientDetails?.tel}`,
      `Contact: ${clientDetails.contactPerson}`,
      `Email: ${clientDetails.email}`
    ].forEach(line => {
      doc.text(line, margin + 5, textYInvoiceTo);
      textYInvoiceTo += 12;
    });
    finalY += 100 + 10;
    autoTable(doc, {
      startY: finalY,
      head: [['TRN', 'Cost Est. No.', 'P.O. No.', 'Project No.']],
      body: [[clientDetails.trn, projectInfo.costEstNo, projectInfo.poNo, projectInfo.projectNo]],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 5, lineWidth: 0.5, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: margin, right: margin },
    });
    finalY = doc.lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY: finalY,
      head: [['Bank Account Name', 'Bank Name', 'IBAN', 'Swift Code', 'Terms']],
      body: [[bankDetails.accountName, bankDetails.bankName, bankDetails.iban, bankDetails.swiftCode, bankDetails.terms]],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 5, lineWidth: 0.5, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: margin, right: margin },
    });
    finalY = doc.lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY: finalY,
      head: [['Sr. #', 'Description', 'Qty', 'Rate', 'Amount (USD)']],
      body: items,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 5, lineWidth: 0.5, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 40, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 50, halign: 'right' },
        4: { cellWidth: 70, halign: 'right' },
      },
      margin: { left: margin, right: margin },
      didDrawPage: function (data) {
        finalY = data.cursor.y;
      }
    });
    const amountInWordsY = finalY + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(amountInWords, margin, amountInWordsY, { maxWidth: pageWidth - margin - 220 });
    const totalsTableWidth = 200;
    const totalsTableX = pageWidth - margin - totalsTableWidth;
    let totalsTableY = finalY + 10;
    autoTable(doc, {
      startY: totalsTableY,
      body: [
        ['Subtotal', `USD ${subTotal.toFixed(2)}`],
        [`VAT (${(vatRate * 100).toFixed(0)}%)`, `USD ${vatAmount.toFixed(2)}`],
        ['Total', `USD ${grandTotal.toFixed(2)}`]
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: totalsTableWidth * 0.6 },
        1: { halign: 'right', cellWidth: totalsTableWidth * 0.4 }
      },
      margin: { left: totalsTableX },
      tableWidth: totalsTableWidth,
      didDrawPage: function (data) {
        totalsTableY = data.cursor.y;
      }
    });
    finalY = Math.max(amountInWordsY + 10, totalsTableY + 10);
    const footerStartY = finalY + 30;
    const stampWidth = 50;
    const stampHeight = 70;
    const stampX = margin + 150;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('For Company Name', margin, footerStartY);
    doc.text('Accounts Department', margin, footerStartY + stampHeight - 10);
    doc.setFillColor(200, 200, 200);
    doc.rect(stampX, footerStartY - 15, stampWidth, stampHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    // Insert the stamp image instead of text
    try {
      const imgData = await getImageBase64FromUrl(stamp);
      // Center the image in the stamp box and make it smaller for a better fit
      const stampImgWidth = 80; // Adjust width as needed
      const stampImgHeight = 80; // Adjust height as needed
      const stampImgX = stampX + (stampWidth - stampImgWidth) / 2;
      const stampImgY = footerStartY - 15 + (stampHeight - stampImgHeight) / 2;
      doc.addImage(imgData, 'PNG', stampImgX, stampImgY, stampImgWidth, stampImgHeight);
    } catch (e) {
      doc.text('Stamp Image Not Found', stampX + stampWidth / 2, footerStartY - 15 + stampHeight / 2, { align: 'center' });
    }
    doc.save(`Tax_Invoice_${invoiceMeta.invoiceNo}.pdf`);
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    let words = '';
    if (num >= 1000000000) { words += numberToWords(Math.floor(num / 1000000000)) + ' Billion '; num %= 1000000000; }
    if (num >= 1000000) { words += numberToWords(Math.floor(num / 1000000)) + ' Million '; num %= 1000000; }
    if (num >= 1000) { words += numberToWords(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
    if (num >= 100) { words += ones[Math.floor(num / 100)] + ' Hundred '; num %= 100; }
    if (num >= 20) { words += tens[Math.floor(num / 10)] + ' '; num %= 10; }
    if (num > 0) { words += ones[num] + ' '; }

    const numStr = parseFloat(num).toFixed(2);
    const parts = numStr.split('.');
    let dollars = parseInt(parts[0]);
    let cents = parseInt(parts[1]);

    words = '';
    if (dollars === 0) words = 'Zero';
    else {
      if (dollars >= 1000000000) { words += numberToWords(Math.floor(dollars / 1000000000)) + ' Billion '; dollars %= 1000000000; }
      if (dollars >= 1000000) { words += numberToWords(Math.floor(dollars / 1000000)) + ' Million '; dollars %= 1000000; }
      if (dollars >= 1000) { words += numberToWords(Math.floor(dollars / 1000)) + ' Thousand '; dollars %= 1000; }
      if (dollars >= 100) { words += ones[Math.floor(dollars / 100)] + ' Hundred '; dollars %= 100; }
      if (dollars >= 20) { words += tens[Math.floor(dollars / 10)] + (dollars % 10 !== 0 ? ' ' : ''); dollars %= 10; }
      if (dollars > 0) { words += ones[dollars] + ' '; }
    }
    words = words.trim();

    if (cents > 0) {
      words += ` and ${cents.toString()}/100`;
    }
    return words.trim();
  };

  //   const handleDownloadPDF = async (invoice) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/pdf/invoice?InvoiceBillingId=${invoice._id}`,
  //       {
  //         responseType: "blob",
  //       }
  //     );
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `${invoice.invoiceNumber || "invoice"}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("❌ Error downloading invoice PDF:", error);
  //     alert("Failed to download invoice PDF.");
  //   } 
  // };

  const { invocing, loading, error } = useSelector((state) => state.InvoicingBilling);
  console.log(invocing?.InvoicingBilling);

  useEffect(() => {
    dispatch(fetchInvoicingBilling());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;


  const filteredEstimates = invocing?.InvoicingBilling
    ?.slice()
    .reverse()
    .filter((invoice) => {

      const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const invoiceNumber = (invoice.invoiceNumber || '').toLowerCase();
      const clientName = (invoice.clients?.[0]?.clientName || '').toLowerCase();
      const projectName = (invoice.projectId?.[0]?.projectName || '').toLowerCase();
      const status = (invoice.status || '').toLowerCase();
      const amount = (invoice.lineItems?.[0]?.amount || '').toString().toLowerCase();
      const fields = [
        invoiceNumber,
        clientName,
        projectName,
        status,
        amount
      ];

      const matchesSearch = terms.length === 0 || terms.every(term =>
        fields.some(field => field.includes(term))
      );
      const matchesProject = selectedProject === 'All Projects' ||
        invoice.projectId?.[0]?.projectName === selectedProject;
      const matchesDate = !selectedDate ||
        new Date(invoice.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();
      return matchesSearch && matchesProject && matchesDate;
    });

  const totalItems = filteredEstimates?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedEstimates = filteredEstimates
    ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to mark this job as Cancelled?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as Cancelled!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInvoicingBilling(_id))
          .unwrap()
          .then(() => {
            Swal.fire("Updated!", "The job has been marked as Cancelled.", "success");
            dispatch(fetchInvoicingBilling());
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong while updating.", "error");
          });
      }
    });
  };

  const UpdateInvocing = (invoice) => {
    navigate(`/admin/AddInvoice`, {
      state: { invoice }
    });
  };

  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="p-4 m-3" style={{ backgroundColor: "white", borderRadius: "10px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>Invoicing & Billing</h2>
        {/* Desktop generate button only */}
        {/* <div className="d-none d-md-block">
          <Link to={"/admin/AddInvoice"}>
            <button id="All_btn" className="btn btn-dark">
              Generate New Invoice
            </button>
          </Link>
        </div> */}
      </div>

      <div
        className={`row g-3 mb-4 
          ${showFilters ? 'd-block' : 'd-none d-md-flex'}
        `}
      >
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              {/* <FaCalendarAlt className="text-muted" /> */}
            </span>
            <input
              type="date"
              className="form-control border-start-0"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="project-dropdown" className="w-100">
              {selectedProject}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedProject("All Projects")}>
                All Projects
              </Dropdown.Item>
              {[...new Set((invocing?.InvoicingBilling || []).map((invoice) =>
                invoice.projectId?.[0]?.projectName || "N/A"
              ))].filter(name => name !== "N/A").map((projectName, index) => (
                <Dropdown.Item key={index} onClick={() => setSelectedProject(projectName)}>
                  {projectName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Mobile filter dropdown panel */}
      {showFilters && (
        <div id="mobile-filters"
          className="d-md-none mb-3 p-3 border rounded"
          style={{ backgroundColor: '#f8f9fa' }}>
          {/* Search inside mobile filters */}
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search invoices..." value={searchQuery} onChange={handleSearch} />
          </InputGroup>

          {/* <Form.Select className="mb-2">
            <option>All Clients</option>
          </Form.Select> */}
          <Form.Select className="mb-2">
            <option>All Status</option>
          </Form.Select>
          <Button className="w-100 mb-3" variant="outline-secondary">
            <FaSort /> Sort
          </Button>

          {/* Generate New Invoice inside filter panel on mobile */}
          <Link to={"/admin/AddInvoice"}>
            <Button variant="dark" className="w-100">
              Generate New Invoice
            </Button>
          </Link>
        </div>
      )}

      {/* Table */}
      <Table hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('invoiceNumber')} style={{ whiteSpace: "nowrap",whiteSpace: 'nowrap' }}>Invoice #</th>
            <th onClick={() => handleSort('project')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Project</th>
            <th onClick={() => handleSort('client')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Client Name</th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Client Email</th>
            <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Amount</th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Status</th>
            <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer',whiteSpace: 'nowrap' }}>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEstimates?.map((invoice, index) => (
            <tr key={invoice.invoiceNumber || index}>
              <td style={{ whiteSpace: "nowrap" }} /* onClick={() => JobDetails(invoice._id)} */>
                INV-{String((currentPage - 1) * itemsPerPage + index + 1).padStart(4, '0')}
              </td>

              <td style={{ whiteSpace: "nowrap" }}>{invoice.projectId?.[0]?.projectName || "N/A"}</td>
              <td style={{ whiteSpace: "nowrap" }}>{invoice.clients?.[0]?.clientName || "N/A"}</td>
              <td style={{ whiteSpace: "nowrap" }}>{invoice.clientId?.contactPersons[0].email || "N/A"}</td>
              <td style={{ whiteSpace: "nowrap" }}>${invoice.lineItems?.[0]?.amount || "N/A"}</td>
              <td>
                <Badge bg={getStatusBadgeVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </td>
              <td>{invoice.date ? new Date(invoice.date).toLocaleDateString("en-GB") : 'N/A'}</td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => UpdateInvocing(invoice)}>
                    <FaEdit />
                  </button>
                  {/* <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(invoice._id)}>
                      <FaTrash />
                    </button> */}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleDownloadPDF(invoice)} // Pass current invoice
                  >
                    <FaDownload />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {!loading && !error && (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <div className="text-muted small mb-2 mb-md-0">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default InvoiceBilling;

