import React, { useState, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
    ChevronLeft, 
    ChevronRight, 
    ZoomIn, 
    ZoomOut, 
    X,
    Maximize,
    Minimize,
    RotateCw,
    ExternalLink
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { convertToDirectPdfUrl, extractGoogleDriveFileId } from '../utils/pdfUtils';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReader = () => {
    const book = useLoaderData();
    const navigate = useNavigate();
    
    // Convert PDF URL to direct link
    const pdfUrl = useMemo(() => convertToDirectPdfUrl(book.bookPdfUrl), [book.bookPdfUrl]);
    const isGoogleDrive = useMemo(() => book.bookPdfUrl?.includes('drive.google.com'), [book.bookPdfUrl]);
    const googleDriveFileId = useMemo(() => extractGoogleDriveFileId(book.bookPdfUrl), [book.bookPdfUrl]);
    
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [useIframe, setUseIframe] = useState(false);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setLoadError(false);
    };

    const onDocumentLoadError = (error) => {
        console.error('PDF Load Error:', error);
        setLoading(false);
        setLoadError(true);
        // Auto-switch to iframe for Google Drive
        if (isGoogleDrive) {
            setUseIframe(true);
        }
    };

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    };

    const zoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3.0));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const rotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    const goToPage = (e) => {
        const page = parseInt(e.target.value);
        if (page >= 1 && page <= numPages) {
            setPageNumber(page);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 text-white px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg gap-3 flex-shrink-0">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        title="Close Reader"
                    >
                        <X size={24} />
                    </button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg md:text-xl font-bold truncate">{book.bookTitle}</h1>
                        <p className="text-xs md:text-sm text-gray-400 truncate">{book.authorName}</p>
                    </div>
                </div>
                
                {/* Controls - Only show in PDF viewer mode */}
                {!useIframe && (
                <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-end w-full md:w-auto">
                    <button
                        onClick={zoomOut}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom Out"
                        disabled={scale <= 0.5}
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs md:text-sm px-2 md:px-3 py-1 bg-gray-700 rounded">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom In"
                        disabled={scale >= 3.0}
                    >
                        <ZoomIn size={18} />
                    </button>
                    
                    <div className="w-px h-6 bg-gray-600 mx-1 hidden md:block"></div>
                    
                    <button
                        onClick={rotate}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Rotate"
                    >
                        <RotateCw size={18} />
                    </button>
                    
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors hidden md:block"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                </div>
                )}
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-800 flex flex-col items-center justify-start relative">
                {useIframe && isGoogleDrive && googleDriveFileId ? (
                    // Google Drive iframe viewer (fallback)
                    <>
                        <div className="w-full bg-yellow-100 border-b border-yellow-400 text-yellow-800 px-4 py-2 text-center flex-shrink-0">
                            <p className="text-sm">
                                📌 Using Google Drive viewer mode. Use Google Drive's built-in controls to navigate.
                            </p>
                        </div>
                        <iframe
                            src={`https://drive.google.com/file/d/${googleDriveFileId}/preview`}
                            className="w-full flex-1 bg-white border-0"
                            allow="autoplay"
                            title={book.bookTitle}
                            style={{ height: 'calc(100% - 48px)' }}
                        />
                    </>
                ) : (
                    // Regular PDF viewer
                    <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                        {loading && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                                <p className="text-white text-lg">Loading your book...</p>
                            </div>
                        )}
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={
                                <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                                    <div className="text-white text-lg">Loading PDF...</div>
                                </div>
                            }
                            error={
                                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-2xl">
                                    <div className="text-red-500 text-xl mb-4">
                                        ⚠️ Failed to load PDF
                                    </div>
                                    <p className="text-gray-400 text-sm text-center mb-4">
                                        The PDF couldn't be loaded with the standard viewer.
                                        {isGoogleDrive && googleDriveFileId && (
                                            <span className="block mt-2">Switching to Google Drive viewer...</span>
                                        )}
                                    </p>
                                    {isGoogleDrive && googleDriveFileId ? (
                                        <button
                                            onClick={() => setUseIframe(true)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                                        >
                                            Try Google Drive Viewer
                                        </button>
                                    ) : (
                                        <div className="bg-gray-100 p-4 rounded text-xs text-left w-full">
                                            <p className="font-semibold mb-2">Troubleshooting:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Check if the URL is publicly accessible</li>
                                                <li>Verify the file is a valid PDF</li>
                                                <li>Try opening the URL in a new tab</li>
                                                <li>For Google Drive, ensure sharing is set to "Anyone with link"</li>
                                            </ul>
                                            <p className="mt-3 text-gray-600">
                                                <strong>Original URL:</strong><br/>
                                                <span className="break-all">{book.bookPdfUrl}</span>
                                            </p>
                                            {pdfUrl !== book.bookPdfUrl && (
                                                <p className="mt-2 text-gray-600">
                                                    <strong>Converted URL:</strong><br/>
                                                    <span className="break-all">{pdfUrl}</span>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <a
                                        href={book.bookPdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        <ExternalLink size={20} />
                                        Open PDF in New Tab
                                    </a>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                rotate={rotation}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="mx-auto"
                            />
                        </Document>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            {useIframe && isGoogleDrive ? (
                // Footer for iframe mode
                <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-center shadow-lg">
                    <a
                        href={book.bookPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ExternalLink size={20} />
                        Open in Google Drive
                    </a>
                </div>
            ) : (
                // Footer for PDF viewer mode
            <div className="bg-gray-800 text-white px-2 md:px-4 py-3 flex items-center justify-between shadow-lg gap-2">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        pageNumber <= 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <ChevronLeft size={18} />
                    <span className="hidden md:inline">Previous</span>
                    <span className="md:hidden">Prev</span>
                </button>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <span className="text-xs md:text-sm">Page</span>
                    <input
                        type="number"
                        min="1"
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={goToPage}
                        className="w-12 md:w-16 px-1 md:px-2 py-1 bg-gray-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="text-xs md:text-sm">of {numPages || 1}</span>
                </div>

                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        pageNumber >= numPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
            )}
        </div>
    );
};

export default BookReader;
