import { formatCurrency } from '../utils/pricingEngine'

export default function QuoteResult({ quote, onProceedToCheckout, onRequestManualReview }) {
    if (!quote) return null

    const { pricing, material, model, printTimeHours, materialWeight, leadTime } = quote
    const isFDM = material.tech === 'FDM'

    return (
        <div className="card card-glow quote-result slide-up">
            {/* Total Price */}
            <div className="quote-total-section">
                <div className="quote-total-label">Your Instant Quote</div>
                <div className="quote-total-price">{formatCurrency(pricing.total)}</div>
                {pricing.quantity > 1 && (
                    <div className="quote-per-unit">
                        {formatCurrency(pricing.unitPrice)} per unit × {pricing.quantity} units
                    </div>
                )}
                <div className="lead-time-badge">
                    🕐 Estimated Lead Time: {leadTime}
                </div>
            </div>

            {/* Breakdown */}
            <div style={{ padding: '0' }}>
                <div className="config-label" style={{ marginBottom: 'var(--space-md)' }}>Price Breakdown</div>

                {/* Setup Fee */}
                <div className="breakdown-row">
                    <div className="breakdown-label">
                        ⚙️ Setup Fee
                    </div>
                    <div className="breakdown-value">{formatCurrency(pricing.breakdown.setupFee)}</div>
                </div>

                {/* FDM: Time + Material cost */}
                {isFDM && pricing.breakdown.timeCost && (
                    <>
                        <div className="breakdown-row">
                            <div className="breakdown-label">
                                <div>
                                    🕐 Print Time
                                    <div className="breakdown-detail">
                                        {printTimeHours.toFixed(1)} hrs × {formatCurrency(pricing.breakdown.timeCost.rate)}/hr
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-value">{formatCurrency(pricing.breakdown.timeCost.total)}</div>
                        </div>
                        <div className="breakdown-row">
                            <div className="breakdown-label">
                                <div>
                                    🧱 Material
                                    <div className="breakdown-detail">
                                        {materialWeight.toFixed(1)}g × {formatCurrency(pricing.breakdown.materialCost.rate)}/g
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-value">{formatCurrency(pricing.breakdown.materialCost.total)}</div>
                        </div>
                    </>
                )}

                {/* Volume-based cost */}
                {!isFDM && pricing.breakdown.volumeCost && (
                    <div className="breakdown-row">
                        <div className="breakdown-label">
                            <div>
                                📐 {material.name}
                                <div className="breakdown-detail">
                                    {model.volumeCm3.toFixed(2)} cm³ × {formatCurrency(pricing.breakdown.volumeCost.rate)}/cm³
                                </div>
                            </div>
                        </div>
                        <div className="breakdown-value">{formatCurrency(pricing.breakdown.volumeCost.total)}</div>
                    </div>
                )}

                {/* Unit price × quantity */}
                {pricing.quantity > 1 && (
                    <div className="breakdown-row">
                        <div className="breakdown-label">
                            📦 Quantity ({pricing.quantity} units)
                        </div>
                        <div className="breakdown-value">{formatCurrency(pricing.subtotal)}</div>
                    </div>
                )}

                {/* Quantity discount */}
                {pricing.discount.discount > 0 && (
                    <div className="breakdown-row">
                        <div className="breakdown-label">
                            🏷️ Volume Discount ({(pricing.discount.discount * 100).toFixed(0)}%)
                        </div>
                        <div className="breakdown-value discount">-{formatCurrency(pricing.discount.amount)}</div>
                    </div>
                )}

                {/* Rush surcharge */}
                {pricing.isRush && pricing.rushSurcharge > 0 && (
                    <div className="breakdown-row">
                        <div className="breakdown-label">
                            ⚡ Rush Order (+50%)
                        </div>
                        <div className="breakdown-value surcharge">+{formatCurrency(pricing.rushSurcharge)}</div>
                    </div>
                )}

                {/* Shipping */}
                <div className="breakdown-row">
                    <div className="breakdown-label">
                        🚚 {pricing.shipping.label}
                    </div>
                    <div className="breakdown-value">
                        {pricing.shipping.price > 0 ? formatCurrency(pricing.shipping.price) : 'FREE'}
                    </div>
                </div>

                {/* Total */}
                <div className="breakdown-row total-row">
                    <div className="breakdown-label">Total</div>
                    <div className="breakdown-value">{formatCurrency(pricing.total)}</div>
                </div>
            </div>

            {/* Model Info */}
            <div className="model-stats" style={{ marginTop: 'var(--space-lg)' }}>
                <div className="stat-card">
                    <div className="stat-value">{model.volumeCm3.toFixed(1)}</div>
                    <div className="stat-label">Volume (cm³)</div>
                </div>
                {model.dimensions && (
                    <div className="stat-card">
                        <div className="stat-value">
                            {model.dimensions.x.toFixed(0)}×{model.dimensions.y.toFixed(0)}×{model.dimensions.z.toFixed(0)}
                        </div>
                        <div className="stat-label">Dimensions (mm)</div>
                    </div>
                )}
                <div className="stat-card">
                    <div className="stat-value">{materialWeight.toFixed(0)}g</div>
                    <div className="stat-label">Est. Weight</div>
                </div>
                {isFDM && (
                    <div className="stat-card">
                        <div className="stat-value">{printTimeHours.toFixed(1)}h</div>
                        <div className="stat-label">Print Time</div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="actions-row" style={{ marginTop: 'var(--space-xl)' }}>
                <button className="btn btn-primary btn-lg" onClick={onProceedToCheckout} id="proceed-checkout-btn">
                    💳 Proceed to Checkout
                </button>
            </div>

            {/* Escape Hatch */}
            <div className="escape-hatch-banner" onClick={onRequestManualReview}>
                <div className="escape-hatch-icon">🤝</div>
                <div className="escape-hatch-text">
                    <div className="escape-hatch-title">Need a custom quote?</div>
                    <div className="escape-hatch-desc">
                        Complex project, special requirements, or prefer to talk to our team first?
                    </div>
                </div>
                <div className="escape-hatch-arrow">→</div>
            </div>

            <div className="pricing-note">
                💡 Prices are estimates based on model analysis. Final pricing may vary for complex geometries.
                All outsourced prints include quality inspection and secure packaging.
            </div>
        </div>
    )
}
