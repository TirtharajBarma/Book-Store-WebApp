import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { convertToDirectPdfUrl } from '../utils/pdfUtils';

const PdfUrlHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (testUrl) {
      const converted = convertToDirectPdfUrl(testUrl);
      setConvertedUrl(converted);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Need help with PDF URLs? Click here
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">📚 PDF URL Helper</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* URL Converter */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">🔧 URL Converter Tool</h3>
                <p className="text-sm text-gray-700 mb-3">Paste your Google Drive or Dropbox URL to convert it:</p>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Paste URL here..."
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <button
                  onClick={handleConvert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                >
                  Convert URL
                </button>
                {convertedUrl && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-semibold text-green-800 mb-2">✅ Converted URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white p-2 rounded flex-1 overflow-x-auto">
                        {convertedUrl}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Google Drive Instructions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">📁</span> Google Drive Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Upload your PDF to Google Drive</li>
                  <li>Right-click the file → <strong>Share</strong></li>
                  <li>Change to <strong>"Anyone with the link"</strong> can view</li>
                  <li>Click <strong>Copy link</strong></li>
                  <li>Paste it in the form - it will auto-convert! ✨</li>
                </ol>
                <div className="mt-3 p-2 bg-gray-50 rounded">
                  <p className="text-xs font-mono">
                    Your link: https://drive.google.com/file/d/FILE_ID/view
                  </p>
                  <p className="text-xs font-mono text-green-600 mt-1">
                    Converts to: https://drive.google.com/uc?export=view&id=FILE_ID
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Falls back to iframe viewer if direct loading fails
                  </p>
                </div>
              </div>

              {/* Dropbox Instructions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">📦</span> Dropbox Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Upload your PDF to Dropbox</li>
                  <li>Right-click → <strong>Share</strong></li>
                  <li>Click <strong>Create link</strong></li>
                  <li>Copy the link</li>
                  <li>Paste it in the form - it will auto-convert! ✨</li>
                </ol>
              </div>

              {/* GitHub Instructions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🐙</span> GitHub Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Upload PDF to a GitHub repository</li>
                  <li>Click on the PDF file</li>
                  <li>Click the <strong>Raw</strong> button</li>
                  <li>Copy the URL from address bar</li>
                  <li>Paste directly - already a direct link! ✅</li>
                </ol>
              </div>

              {/* Quick Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">💡 Quick Tips</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Make sure your file is set to <strong>public/anyone can view</strong></li>
                  <li>Test the link in an incognito window</li>
                  <li>Direct PDF links usually end in <code>.pdf</code></li>
                  <li>Our system auto-converts Google Drive & Dropbox links</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfUrlHelper;
