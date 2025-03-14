import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const ImageUpload = ({ onImagesChange }) => {
  const [preview, setPreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    if (newFiles.length !== event.target.files.length) {
      alert("Algunas imágenes fueron rechazadas porque superan los 5MB.");
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // 📌 Notificar a `InstrumentForm` sobre las imágenes seleccionadas
    onImagesChange([...selectedFiles, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    // 📌 Notificar a `InstrumentForm` después de eliminar
    onImagesChange(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ textAlign: "center", width: "100%" }}>
      {/* 📌 Botón para subir imágenes */}
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: "none" }}
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor="image-upload">
        <Button
          component="span"
          variant="contained"
          startIcon={<PhotoCamera />}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "10px",
          }}
        >
          Subir Imágenes
        </Button>
      </label>
      <Typography variant="body2" sx={{ marginTop: 1, textAlign: "center" }}>
        Máximo 5MB por imagen - Formatos permitidos: JPG, PNG
      </Typography>

      {/* 📌 Galería de imágenes */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 1,
          marginTop: 2,
          justifyContent: "center",
        }}
      >
        {preview.map((src, index) => (
          <Box key={index} sx={{ position: "relative", width: "100px", height: "100px" }}>
            <img
              src={src}
              alt={`preview-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #ddd",
              }}
            />
            <IconButton
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.8)" },
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageUpload;

ImageUpload.propTypes = {
    onImagesChange:PropTypes.func
}