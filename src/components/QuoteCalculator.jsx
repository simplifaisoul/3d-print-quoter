import { useState, useMemo, useCallback } from 'react'
import { TECHNOLOGIES, MATERIALS, getMaterialsByTech, SHIPPING_RATES } from '../config/materials'

export default function QuoteCalculator({
    modelData,
    onConfigChange,
    config,
}) {
    const [selectedTech, setSelectedTech] = useState(config?.tech || 'FDM')
    const [selectedMaterial, setSelectedMaterial] = useState(config?.materialId || 'fdm-pla')
    const [quantity, setQuantity] = useState(config?.quantity || 1)
    const [infill, setInfill] = useState(config?.infillPercent || 20)
    const [layerHeight, setLayerHeight] = useState(config?.layerHeight || 0.2)
    const [isRush, setIsRush] = useState(config?.isRush || false)
    const [shippingMethod, setShippingMethod] = useState(config?.shippingMethod || 'standard')

    const materials = useMemo(() => getMaterialsByTech(selectedTech), [selectedTech])

    const emitChange = useCallback((updates = {}) => {
        const newConfig = {
            tech: selectedTech,
            materialId: selectedMaterial,
            quantity,
            infillPercent: infill,
            layerHeight,
            isRush,
            shippingMethod,
            ...updates,
        }
        onConfigChange(newConfig)
    }, [selectedTech, selectedMaterial, quantity, infill, layerHeight, isRush, shippingMethod, onConfigChange])

    const handleTechChange = (techId) => {
        const techMaterials = getMaterialsByTech(techId)
        const firstMaterial = techMaterials[0]?.id || ''
        setSelectedTech(techId)
        setSelectedMaterial(firstMaterial)
        emitChange({ tech: techId, materialId: firstMaterial })
    }

    const handleMaterialChange = (matId) => {
        setSelectedMaterial(matId)
        emitChange({ materialId: matId })
    }

    const handleQuantityChange = (delta) => {
        const newQty = Math.max(1, quantity + delta)
        setQuantity(newQty)
        emitChange({ quantity: newQty })
    }

    const handleQuantityInput = (e) => {
        const val = parseInt(e.target.value) || 1
        const newQty = Math.max(1, Math.min(10000, val))
        setQuantity(newQty)
        emitChange({ quantity: newQty })
    }

    const handleInfillChange = (e) => {
        const val = parseInt(e.target.value)
        setInfill(val)
        emitChange({ infillPercent: val })
    }

    const handleLayerHeightChange = (e) => {
        const val = parseFloat(e.target.value)
        setLayerHeight(val)
        emitChange({ layerHeight: val })
    }

    const handleRushToggle = () => {
        setIsRush(!isRush)
        emitChange({ isRush: !isRush })
    }

    const handleShippingChange = (method) => {
        setShippingMethod(method)
        emitChange({ shippingMethod: method })
    }

    const isFDM = selectedTech === 'FDM'

    return (
        <div className="fade-in">
            {/* Technology Selection */}
            <div className="config-section">
                <div className="config-label">Choose Technology</div>
                <div className="tech-grid">
                    {Object.values(TECHNOLOGIES).map(tech => (
                        <div
                            key={tech.id}
                            className={`tech-card ${selectedTech === tech.id.toUpperCase() ? 'selected' : ''}`}
                            onClick={() => handleTechChange(tech.id.toUpperCase())}
                        >
                            <div className="tech-card-icon">{tech.icon}</div>
                            <div className="tech-card-name">{tech.shortName}</div>
                            <div className="tech-card-desc">{tech.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-divider" />

            {/* Material Selection */}
            <div className="config-section">
                <div className="config-label">Choose Material</div>
                <div className="material-grid">
                    {materials.map(mat => (
                        <div
                            key={mat.id}
                            className={`material-card ${selectedMaterial === mat.id ? 'selected' : ''}`}
                            onClick={() => handleMaterialChange(mat.id)}
                        >
                            <div className="material-swatch" style={{ backgroundColor: mat.color }} />
                            <div className="material-card-info">
                                <div className="material-card-name">{mat.name}</div>
                                <div className="material-card-desc">{mat.description}</div>
                                <div className="material-card-price">
                                    {mat.pricePerHour
                                        ? `$${mat.pricePerHour}/hr + $${mat.pricePerGram}/g`
                                        : `$${mat.pricePerCm3}/cm³`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-divider" />

            {/* Print Options */}
            <div className="config-section">
                <div className="config-label">Print Options</div>
                <div className="options-row">
                    {/* Quantity */}
                    <div className="option-group">
                        <div className="option-label">Quantity</div>
                        <div className="quantity-input">
                            <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>−</button>
                            <input
                                className="quantity-value"
                                type="number"
                                value={quantity}
                                onChange={handleQuantityInput}
                                min="1"
                                max="10000"
                                id="quantity-input"
                            />
                            <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                    </div>

                    {/* FDM-specific options */}
                    {isFDM && (
                        <>
                            <div className="option-group">
                                <div className="slider-container">
                                    <div className="slider-header">
                                        <span className="option-label">Infill Density</span>
                                        <span className="slider-value">{infill}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        step="5"
                                        value={infill}
                                        onChange={handleInfillChange}
                                        id="infill-slider"
                                    />
                                </div>
                            </div>

                            <div className="option-group">
                                <div className="option-label">Layer Height</div>
                                <select
                                    className="option-input"
                                    value={layerHeight}
                                    onChange={handleLayerHeightChange}
                                    id="layer-height-select"
                                >
                                    <option value={0.1}>0.10mm — Ultra Fine</option>
                                    <option value={0.15}>0.15mm — Fine</option>
                                    <option value={0.2}>0.20mm — Standard</option>
                                    <option value={0.3}>0.30mm — Draft</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="section-divider" />

            {/* Rush Order Toggle */}
            <div className="config-section">
                <div
                    className={`toggle-container ${isRush ? 'active' : ''}`}
                    onClick={handleRushToggle}
                >
                    <div className="toggle-switch" />
                    <div>
                        <div className="toggle-label">⚡ Rush Order</div>
                        <div className="toggle-sublabel">50% surcharge for priority production</div>
                    </div>
                </div>
            </div>

            <div className="section-divider" />

            {/* Shipping */}
            {!TECHNOLOGIES[selectedTech]?.inHouse && (
                <div className="config-section">
                    <div className="config-label">Shipping</div>
                    <div className="shipping-options">
                        {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                            <div
                                key={key}
                                className={`shipping-option ${shippingMethod === key ? 'selected' : ''}`}
                                onClick={() => handleShippingChange(key)}
                            >
                                <div className="shipping-radio" />
                                <div className="shipping-info">
                                    <div className="shipping-label">{rate.label}</div>
                                    <div className="shipping-days">{rate.days} business days</div>
                                </div>
                                <div className="shipping-price">${rate.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
