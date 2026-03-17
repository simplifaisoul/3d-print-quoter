import { useState, useRef, useCallback } from 'react'
import { parseSTL } from '../utils/stlParser'

const ACCEPTED_EXTENSIONS = ['.stl', '.obj', '.3mf']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

export default function FileUploader({ onFileLoaded, onModelData }) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [file, setFile] = useState(null)
    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const inputRef = useRef(null)

    const validateFile = useCallback((file) => {
        const ext = '.' + file.name.split('.').pop().toLowerCase()
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            return `Unsupported file format. Please upload ${ACCEPTED_EXTENSIONS.join(', ')} files.`
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File is too large. Maximum size is 100 MB.'
        }
        return null
    }, [])

    const processFile = useCallback(async (selectedFile) => {
        const validationError = validateFile(selectedFile)
        if (validationError) {
            setError(validationError)
            return
        }

        setError(null)
        setFile(selectedFile)
        setIsProcessing(true)
        onFileLoaded(selectedFile)

        try {
            const ext = selectedFile.name.split('.').pop().toLowerCase()

            if (ext === 'stl') {
                const buffer = await selectedFile.arrayBuffer()
                const modelData = parseSTL(buffer)
                onModelData(modelData)
            } else {
                // For OBJ and 3MF, we'll pass the file to the viewer
                // and use estimated values or request manual review
                onModelData({
                    volumeCm3: null, // Will need manual input or server processing
                    dimensions: null,
                    triangleCount: null,
                    surfaceAreaCm2: null,
                    fileType: ext,
                    needsManualEstimate: true,
                })
            }
        } catch (err) {
            setError('Error processing file. Please ensure it\'s a valid 3D model.')
            console.error('File processing error:', err)
        } finally {
            setIsProcessing(false)
        }
    }, [validateFile, onFileLoaded, onModelData])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) processFile(droppedFile)
    }, [processFile])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false)
    }, [])

    const handleClick = useCallback(() => {
        inputRef.current?.click()
    }, [])

    const handleChange = useCallback((e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) processFile(selectedFile)
    }, [processFile])

    const removeFile = useCallback(() => {
        setFile(null)
        setError(null)
        onFileLoaded(null)
        onModelData(null)
        if (inputRef.current) inputRef.current.value = ''
    }, [onFileLoaded, onModelData])

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="fade-in">
            <input
                ref={inputRef}
                type="file"
                accept=".stl,.obj,.3mf"
                onChange={handleChange}
                style={{ display: 'none' }}
                id="file-upload-input"
            />

            <div
                className={`upload-zone ${isDragOver ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {isProcessing ? (
                    <>
                        <div className="upload-icon">⚙️</div>
                        <div className="upload-title">Analyzing your model...</div>
                        <div className="upload-subtitle">Calculating volume, dimensions, and complexity</div>
                    </>
                ) : file ? (
                    <>
                        <div className="upload-icon">✅</div>
                        <div className="upload-title">Model uploaded successfully!</div>
                        <div className="upload-subtitle">Click to upload a different file</div>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">📦</div>
                        <div className="upload-title">Drop your 3D model here</div>
                        <div className="upload-subtitle">or click to browse files</div>
                        <div className="upload-formats">
                            {ACCEPTED_EXTENSIONS.map(ext => (
                                <span key={ext} className="format-badge">{ext}</span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="file-info" style={{ borderColor: 'var(--error)', marginTop: 'var(--space-md)' }}>
                    <div className="file-info-icon">⚠️</div>
                    <div className="file-info-details">
                        <div className="file-info-name" style={{ color: 'var(--error)' }}>{error}</div>
                    </div>
                </div>
            )}

            {file && !error && (
                <div className="file-info">
                    <div className="file-info-icon">🧊</div>
                    <div className="file-info-details">
                        <div className="file-info-name">{file.name}</div>
                        <div className="file-info-size">{formatSize(file.size)}</div>
                    </div>
                    <button className="file-info-remove" onClick={(e) => { e.stopPropagation(); removeFile(); }} title="Remove file">
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}
