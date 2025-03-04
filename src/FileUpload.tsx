import React, { useState, ChangeEvent } from 'react';
import { uploadFile } from './services/fileService';
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Alert as MuiAlert,
  Snackbar,
} from '@mui/material';


const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      await uploadFile(file);
      setSnackbarOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Analyze PDF ( This might take longer than usual. Thank you for your patience)
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" component="label">
          Choose File
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </Button>
        <Typography variant="body1" sx={{ ml: 2, display: 'inline-block' }}>
          {file ? file.name : 'No file chosen'}
        </Typography>
      </Box>

      {uploading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </MuiAlert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        Upload
      </Button>

      {/* Snackbar for success notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          File Uploaded Successfully!
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default FileUpload;