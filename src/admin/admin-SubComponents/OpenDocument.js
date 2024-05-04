import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Document, Page, pdfjs } from 'react-pdf';
import { ServerURL } from "../../services/ServerServices";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function OpenDocument(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setPageNumber(1); // Reset page number when closing the dialog
    setError(null); // Clear any previous error
    props.handleCloseView();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleOpenDocument = () => {
    const documentURL = `${ServerURL}/images/${encodeURIComponent(props.person.paper_uploaded)}`;
    window.open(documentURL, "_blank");
  };

  return (
    <Dialog open={props.openView} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View File</DialogTitle>
      <DialogContent>
        {error && <p>Error: {error}</p>}
        {!error && (
          <div>
            <Document
              file={`${ServerURL}/images/${encodeURIComponent(props.person.paper_uploaded)}`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => setError(error.message)}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpenDocument}>Open File</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
