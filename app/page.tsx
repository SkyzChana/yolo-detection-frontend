'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ImageUploader from '@/components/ImageUploader'
import DetectionResults from '@/components/DetectionResults'

interface Detection {
  class: string
  conf: number | null
  poison: string
}

interface PredictionResult {
  detections: Detection[]
  imagedetect: string
}

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePrediction = (data: PredictionResult) => {
    setResult(data)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setResult(null)
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Banner */}
        <div className="mb-8 text-center">
  <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
    เว็บแอปพลิเคชันสำหรับการจำแนกสายพันธุ์งูในประเทศไทยด้วยการจำแนกภาพ
  </h2>

  <p className="text-lg font-semibold mb-2">ขอบเขตรายชื่องูที่ระบบสามารถจำแนกได้</p>

  <div className="flex flex-wrap justify-center gap-2 text-sm">
  {[
    "งูงอด","งูจงอาง","งูทางมะพร้าว","งูปี่แก้ว","งูสิง",
    "งูแสงอาทิตย์","งูหัวกะโหลก","งูเห่า","งูก้นขบ","งูกะปะ",
    "งูเขียวพระอินทร์","งูเขียวหางไหม้","งูทับสมิงคลา",
    "งูปล้องฉนวนตับจาก","งูแมวเซา","งูลายสอ","งูสามเหลี่ยม"
  ].map((snake, index) => (
    <span
      key={index}
      className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
    >
      {snake}
    </span>
  ))}
</div>
</div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-kku-maroon text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                1
              </span>
              อัปโหลดรูปภาพ
            </h2>
            <ImageUploader
              onPrediction={handlePrediction}
              onError={handleError}
              onLoadingChange={setLoading}
            />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  <strong>Error :</strong> {error}
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-kku-gold text-gray-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                2
              </span>
              ผลการจำแนก
            </h2>
            <DetectionResults result={result} loading={loading} onReset={handleReset} />
          </div>
        </div>
      </main>
    </div>
  )
}