// 'use client'

// import Cropper from "react-easy-crop"
// import { useState } from "react"

// interface Props {
//   image: string
//   onCropComplete: (croppedAreaPixels: any) => void
// }

// export default function ImageCropper({ image, onCropComplete }: Props) {
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)

//   return (
//     <div className="relative w-full h-96 bg-black">
//       <Cropper
//         image={image}
//         crop={crop}
//         zoom={zoom}
//         aspect={1}
//         onCropChange={setCrop}
//         onZoomChange={setZoom}
//         onCropComplete={(area, areaPixels) => onCropComplete(areaPixels)}
//       />
//     </div>
//   )
// }

'use client'

import Cropper from "react-easy-crop"
import { useState } from "react"

interface Props {
  image: string
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  onCancel: () => void
  onSave: () => void
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  onSave
}: Props) {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  return (
    <div className="space-y-4">

      <div className="relative w-full h-96 bg-black">
        {/* <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        /> */}
        <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex gap-3">

        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ยืนยัน Crop
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          ยกเลิก
        </button>

      </div>

    </div>
  )
}