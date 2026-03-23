"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import ImageCropper from "./ImageCropper";
import { getCroppedImg } from "../utils/cropImage";

interface Detection {
  class: string;
  conf: number | null;
  poison: string
}

interface PredictionResult {
  detections: Detection[];
  imagedetect: string;
}

interface Props {
  onPrediction: (result: PredictionResult) => void;
  onError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://darlena-interganglionic-hoyt.ngrok-free.dev/";

export default function ImageUploader({
  onPrediction,
  onError,
  onLoadingChange,
}: Props) {

  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showCrop, setShowCrop] = useState(false);
  const [cropArea, setCropArea] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------
  // Drag
  // -------------------------

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // -------------------------
  // File Select
  // -------------------------

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      onError("กรุณาอัปโหลด PNG, JPG หรือ JPEG เท่านั้น");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError("ไฟล์ใหญ่เกิน 10MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
      setSelectedFile(file);
      setShowCrop(false); // ไม่เปิด crop ทันที
    };

    reader.readAsDataURL(file);
  };

  // -------------------------
  // Crop
  // -------------------------

  const handleCropComplete = (crop: any) => {
    setCropArea(crop);
  };

  const handleCropSave = async () => {

    if (!preview || !cropArea) return;

    const croppedImage = await getCroppedImg(preview, cropArea);

    const file = new File([croppedImage], "cropped.jpg", {
      type: "image/jpeg",
    });

    setSelectedFile(file);
    setPreview(URL.createObjectURL(croppedImage));
    setShowCrop(false);
  };

  // -------------------------
  // Upload
  // -------------------------

  const handleUpload = async () => {

    if (!selectedFile) {
      onError("กรุณาเลือกรูปก่อน");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    onLoadingChange(true);
    onError("");

    try {

      const response = await axios.post<PredictionResult>(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      onPrediction(response.data);

    } catch (error: any) {

      if (error.code === "ERR_NETWORK") {
        onError("ไม่สามารถเชื่อมต่อ Flask API ได้");
      } else if (error.response) {
        onError(`Server error ${error.response.status}`);
      } else {
        onError(error.message);
      }

      console.error(error);

    } finally {
      onLoadingChange(false);
    }
  };

  // -------------------------
  // Reset
  // -------------------------

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setShowCrop(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -------------------------
  // UI
  // -------------------------

  return (
    <div className="space-y-6">

      {/* Upload Zone */}

      <div
        className={`upload-zone ${dragActive ? "upload-zone-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleChange}
        />

        {!preview && (

          <div className="space-y-3 text-center">

            <p className="text-lg font-semibold">
              คลิกเพื่อเลือกรูปภาพ
            </p>

            <p className="text-sm">
              หรือลากไฟล์มาวาง
            </p>

            <p className="text-xs text-gray-500">
              PNG JPG JPEG (สูงสุด 100MB)
            </p>

          </div>

        )}

        {preview && !showCrop && (

          <div className="space-y-4">

            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />

            <p className="text-sm text-gray-600">
              {selectedFile?.name}
            </p>

          </div>

        )}

      </div>

      {/* Crop UI */}

      {showCrop && preview && (

        <ImageCropper
          image={preview}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCrop(false)}
          onSave={handleCropSave}
        />

      )}

      {/* Buttons */}

      <div className="flex gap-3">

        {preview && !showCrop && (

          <button
            onClick={() => setShowCrop(true)}
            className="btn-secondary"
          >
            ครอบตัด
          </button>

        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || showCrop}
          className="btn-primary flex-1"
        >
          จำแนกสายพันธุ์งู
        </button>

        {preview && (

          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            ล้าง
          </button>

        )}

      </div>

    </div>
  );
}