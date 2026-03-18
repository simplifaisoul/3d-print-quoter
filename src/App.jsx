import { useState, useCallback, useMemo, useEffect } from 'react'
import FileUploader from './components/FileUploader'
import ModelViewer from './components/ModelViewer'
import QuoteCalculator from './components/QuoteCalculator'
import QuoteResult from './components/QuoteResult'
import ManualReviewForm from './components/ManualReviewForm'
import CheckoutForm from './components/CheckoutForm'
import OrderConfirmation from './components/OrderConfirmation'
import StepProgress from './components/StepProgress'
import { calculateQuote } from './utils/pricingEngine'

const STEPS = [
    { id: 'upload', label: 'Upload Model' },
    { id: 'configure', label: 'Configure' },
    { id: 'quote', label: 'Review Quote' },
    { id: 'checkout', label: 'Checkout' },
]

export default function App() {
    const [currentStep, setCurrentStep] = useState(0)
    const [file, setFile] = useState(null)
    const [modelData, setModelData] = useState(null)
    const [config, setConfig] = useState({
        tech: 'FDM',
        materialId: 'fdm-pla',
        quantity: 1,
        infillPercent: 20,
        isRush: false,
        shippingMethod: 'standard',
    })
    const [quote, setQuote] = useState(null)
    const [showManualReview, setShowManualReview] = useState(false)
    const [orderNumber, setOrderNumber] = useState(null)
    const [isEmbedMode, setIsEmbedMode] = useState(false)

    // Check for iframe embed mode
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('embed') === 'true' || window.self !== window.top) {
            setIsEmbedMode(true)
            document.body.classList.add('iframe-mode')
        }
    }, [])

    const handleFileLoaded = useCallback((f) => {
        setFile(f)
        if (!f) {
            setModelData(null)
            setQuote(null)
            setCurrentStep(0)
        }
    }, [])

    const handleModelData = useCallback((data) => {
        setModelData(data)
        if (data && data.volumeCm3) {
            setCurrentStep(1) // Auto-advance to configure
        }
    }, [])

    const handleConfigChange = useCallback((newConfig) => {
        setConfig(newConfig)
    }, [])

    // Calculate quote whenever config or modelData changes
    const currentQuote = useMemo(() => {
        if (!modelData || !modelData.volumeCm3) return null
        try {
            return calculateQuote({
                materialId: config.materialId,
                modelData,
                quantity: config.quantity,
                isRush: config.isRush,
                shippingMethod: config.shippingMethod,
                infillPercent: config.infillPercent,
            })
        } catch (err) {
            console.error('Quote calculation error:', err)
            return null
        }
    }, [config, modelData])

    const handleGetQuote = () => {
        setQuote(currentQuote)
        setCurrentStep(2)
    }

    const handleProceedToCheckout = () => {
        setCurrentStep(3)
    }

    const handleCheckoutComplete = (orderNum) => {
        setOrderNumber(orderNum)
        setCurrentStep(4)
    }

    const handleNewQuote = () => {
        setFile(null)
        setModelData(null)
        setConfig({
            tech: 'FDM',
            materialId: 'fdm-pla',
            quantity: 1,
            infillPercent: 20,
            layerHeight: 0.2,
            isRush: false,
            shippingMethod: 'standard',
        })
        setQuote(null)
        setShowManualReview(false)
        setOrderNumber(null)
        setCurrentStep(0)
    }

    // Handle manual review view
    if (showManualReview) {
        return (
            <div className="app">
                {!isEmbedMode && <Header />}
                <div className="main-content">
                    <ManualReviewForm
                        file={file}
                        modelData={modelData}
                        onBack={() => setShowManualReview(false)}
                        onSubmit={() => { }}
                    />
                </div>
            </div>
        )
    }

    // Order confirmed view
    if (currentStep === 4 && orderNumber) {
        return (
            <div className="app">
                {!isEmbedMode && <Header />}
                <div className="main-content">
                    <OrderConfirmation
                        orderNumber={orderNumber}
                        quote={quote}
                        onNewQuote={handleNewQuote}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            {!isEmbedMode && <Header />}

            <div className="main-content">
                <StepProgress currentStep={currentStep} steps={STEPS} />

                {/* Step 0: Upload */}
                {currentStep === 0 && (
                    <div className="fade-in">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: 800,
                                background: 'var(--gradient-accent)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: 'var(--space-sm)',
                                letterSpacing: '-0.02em',
                            }}>
                                Get an Instant 3D Print Quote
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '0.95rem' }}>
                                Upload your 3D model and get a price in seconds. We offer FDM, SLA, SLS, MJF, and Metal printing.
                            </p>
                        </div>

                        <FileUploader
                            onFileLoaded={handleFileLoaded}
                            onModelData={handleModelData}
                        />

                        {file && modelData && modelData.volumeCm3 && (
                            <div className="fade-in" style={{ marginTop: 'var(--space-xl)' }}>
                                <ModelViewer file={file} />

                                <div className="model-stats">
                                    <div className="stat-card">
                                        <div className="stat-value">{modelData.volumeCm3.toFixed(1)}</div>
                                        <div className="stat-label">Volume (cm³)</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">
                                            {modelData.dimensions.x.toFixed(0)}×{modelData.dimensions.y.toFixed(0)}×{modelData.dimensions.z.toFixed(0)}
                                        </div>
                                        <div className="stat-label">Dimensions (mm)</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">{modelData.surfaceAreaCm2.toFixed(1)}</div>
                                        <div className="stat-label">Surface (cm²)</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">{(modelData.triangleCount / 1000).toFixed(1)}k</div>
                                        <div className="stat-label">Triangles</div>
                                    </div>
                                </div>

                                <div className="actions-row">
                                    <button className="btn btn-primary btn-lg" onClick={() => setCurrentStep(1)} id="configure-btn">
                                        Configure Print Options →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Manual review option even without file */}
                        <div className="escape-hatch-banner" onClick={() => setShowManualReview(true)} style={{ marginTop: 'var(--space-xl)' }}>
                            <div className="escape-hatch-icon">🤝</div>
                            <div className="escape-hatch-text">
                                <div className="escape-hatch-title">Prefer a manual quote?</div>
                                <div className="escape-hatch-desc">
                                    Don't have a file ready, or need help with your project? Our team is here to help.
                                </div>
                            </div>
                            <div className="escape-hatch-arrow">→</div>
                        </div>
                    </div>
                )}

                {/* Step 1: Configure */}
                {currentStep === 1 && modelData && (
                    <div className="fade-in">
                        <div className="split-layout">
                            <div>
                                <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                    <div className="card-title">⚙️ Configure Your Print</div>
                                    <div className="card-subtitle">Select technology, material, and options</div>
                                    <QuoteCalculator
                                        modelData={modelData}
                                        config={config}
                                        onConfigChange={handleConfigChange}
                                    />
                                </div>
                            </div>

                            <div style={{ position: 'sticky', top: '80px' }}>
                                {/* Live preview */}
                                <ModelViewer file={file} />

                                {/* Live price preview */}
                                {currentQuote && (
                                    <div className="card" style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Live Estimate
                                        </div>
                                        <div style={{
                                            fontSize: '2.2rem',
                                            fontWeight: 900,
                                            background: 'var(--gradient-accent)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            lineHeight: 1.2,
                                            margin: 'var(--space-xs) 0',
                                        }}>
                                            ${currentQuote.pricing.total.toFixed(2)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {currentQuote.material.fullName} · {currentQuote.pricing.quantity} unit{currentQuote.pricing.quantity > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                )}

                                <div className="actions-row" style={{ marginTop: 'var(--space-md)' }}>
                                    <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>
                                        ← Back
                                    </button>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleGetQuote}
                                        disabled={!currentQuote}
                                        id="get-quote-btn"
                                    >
                                        Get Detailed Quote →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Quote Result */}
                {currentStep === 2 && quote && (
                    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <button className="btn btn-secondary" onClick={() => setCurrentStep(1)} style={{ marginBottom: 'var(--space-lg)' }}>
                            ← Back to Configuration
                        </button>
                        <QuoteResult
                            quote={quote}
                            onProceedToCheckout={handleProceedToCheckout}
                            onRequestManualReview={() => setShowManualReview(true)}
                        />
                    </div>
                )}

                {/* Step 3: Checkout */}
                {currentStep === 3 && quote && (
                    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <CheckoutForm
                            quote={quote}
                            file={file}
                            onBack={() => setCurrentStep(2)}
                            onComplete={handleCheckoutComplete}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

function Header() {
    return (
        <header className="header">
            <div className="header-brand">
                <div>
                    <div className="header-logo">3D Print Everything</div>
                    <div className="header-tagline">Frisco, TX</div>
                </div>
            </div>
            <div className="header-badge">
                Instant Quoting
            </div>
        </header>
    )
}
