'use client'

import Cropper from "react-easy-crop"
import { useState } from "react"

interface Props {
  image: string
  onCropComplete: (croppedAreaPixels: any) => void
}

export default function ImageCropper({ image, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  return (
    <div className="relative w-full h-96 bg-black">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(area, areaPixels) => onCropComplete(areaPixels)}
      />
    </div>
  )
}