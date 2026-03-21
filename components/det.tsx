'use client'

interface Detection {
  class: string
  conf: number | null
  poison: string
}

interface PredictionResult {
  detections: Detection[]
  imagedetect: string
}

interface Props {
  result: PredictionResult | null
  loading: boolean
  onReset: () => void
}
export default function DetectionResults({ result, loading, onReset }: Props) {
<img
          src={`data:image/jpeg;base64,${result.imagedetect}`}
          alt="Detection Result"
          // className="w-full h-auto"
          className="max-h-64 mx-auto rounded-lg"
        />

{result.detections.map((detection, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-kku-gold rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-semibold text-gray-800 capitalize">
                  {detection.class}
                </span>
                {detection.poison && (
              <span className="text-sm text-red-600 font-medium">
                {detection.poison}
              </span>
            )}
              </div>
              
              {detection.conf !== null && (
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${detection.conf * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-green-600 min-w-[60px]">
                    {(detection.conf * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        }