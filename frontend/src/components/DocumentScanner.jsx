import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, FileImage, ShieldAlert, Check } from 'lucide-react';
import { uploadDocument } from '../services/api';

export default function DocumentScanner({ onProductExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractionResult, setExtractionResult] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setError('');
    setIsLoading(true);
    setExtractionResult(null);

    try {
      const result = await uploadDocument(selectedFile);
      setExtractionResult(result);
      if (onProductExtracted) {
        onProductExtracted(result.product);
      }
    } catch (err) {
      setError(err.message || 'Failed to extract document. Make sure it is a PDF or TXT.');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const reset = () => {
    setFile(null);
    setExtractionResult(null);
    setError('');
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="w-12 h-12 text-gray-600 mb-4" />;
    const type = file.type || '';
    if (type.includes('image')) return <FileImage className="w-12 h-12 text-indigo-600 mb-4" />;
    return <FileText className="w-12 h-12 text-blue-700 mb-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <UploadCloud className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analyze a document</h2>
          <p className="text-sm text-gray-600">Upload a financial document such as a policy, agreement or product brochure.</p>
        </div>
      </div>

      {!file && !isLoading && (
        <div 
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-slate-500 bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            {getFileIcon()}
            <p className="text-sm font-semibold text-gray-900 mb-2">Drag & Drop your financial document here</p>
            <p className="text-sm text-gray-600 mb-4">Supports .pdf, .txt, .docx, .png, .jpg</p>
            <label className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-gray-900 px-5 py-2 rounded-lg font-semibold text-sm transition shadow-lg shadow-blue-500/20">
              Upload Document
              <input type="file" className="hidden" accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} />
            </label>
          </div>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}
        </div>
      )}

      {isLoading && (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-10 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-bold text-gray-900">Extracting Attributes...</h3>
          <p className="text-sm text-gray-600">AlignFin Intelligence is reading {file?.name}</p>
        </div>
      )}

      {file && !isLoading && extractionResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              {getFileIcon()}
              <div>
                <h3 className="font-bold text-indigo-600">{file.name}</h3>
                <p className="text-sm text-gray-600">{formatFileSize(file.size)} • ✓ Document analyzed</p>
              </div>
            </div>
            <button onClick={reset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold transition border border-gray-200">
              Upload Another File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600"/>
                What we found
              </h3>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 uppercase font-semibold">Headline Rate</span>
                  <span className="font-bold text-gray-900">{extractionResult.product.headline_label}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 uppercase font-semibold">Category</span>
                  <span className="font-bold text-blue-700 capitalize">{extractionResult.product.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 uppercase font-semibold">Lock-in Period</span>
                  <span className="font-bold text-gray-900">{extractionResult.product.lock_in_months} months</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mt-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-700"/>
                Fees & Penalties
              </h3>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 uppercase font-semibold">Processing Fee</span>
                  <span className="font-bold text-gray-900">
                    {extractionResult.product.evidence_map.processing_fee_pct?.status === 'FOUND' 
                      ? `${extractionResult.product.processing_fee_pct}%` : 'Not Found'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 uppercase font-semibold">Penalty for withdrawing early</span>
                  <span className="font-bold text-red-600">
                    {extractionResult.product.evidence_map.prepayment_penalty_pct?.status === 'FOUND' 
                      ? `${extractionResult.product.prepayment_penalty_pct}%` : 'Not Found'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col h-full">
              <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-700"/>
                Potential Concerns
              </h3>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm text-gray-700 flex-1">
                <p className="mb-4 text-sm text-blue-800 font-semibold uppercase tracking-wider">Analysis Summary</p>
                <ul className="space-y-3">
                  {extractionResult.product.evidence_map.prepayment_penalty_pct?.status === 'FOUND' && (
                    <li className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold text-red-700">AlignFin found this clause in your document:</span> A penalty of {extractionResult.product.prepayment_penalty_pct}% exists for early withdrawal. This term may be unfavorable depending on your situation.
                      </span>
                    </li>
                  )}
                  {extractionResult.product.evidence_map.processing_fee_pct?.status === 'FOUND' && (
                    <li className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold text-yellow-800">AlignFin found this clause in your document:</span> An upfront processing fee of {extractionResult.product.processing_fee_pct}% was extracted.
                      </span>
                    </li>
                  )}
                  {extractionResult.product.lock_in_months > 0 && (
                    <li className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold text-yellow-800">Potential concern:</span> Your funds will be completely locked for {extractionResult.product.lock_in_months} months. Make sure you have enough emergency reserves.
                      </span>
                    </li>
                  )}
                  {(!extractionResult.product.evidence_map.prepayment_penalty_pct || extractionResult.product.evidence_map.prepayment_penalty_pct.status === 'NOT_FOUND') && extractionResult.product.lock_in_months === 0 && (
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold text-indigo-700">No major red flags detected</span> in the explicit clauses provided regarding early exits or hidden costs. However, always confirm final rates with your provider.
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
