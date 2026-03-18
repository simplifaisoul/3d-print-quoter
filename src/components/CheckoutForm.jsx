import { formatCurrency } from '../utils/pricingEngine'
import ModelViewer from './ModelViewer'

export default function CheckoutForm({ quote, file, onBack, onComplete }) {

    const handleCheckout = () => {
        // In production, this would create a Stripe Checkout session
        // For now, simulate a successful order

        // Stripe integration would look like:
        // const response = await fetch('/api/create-checkout-session', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     amount: Math.round(quote.pricing.total * 100),
        //     material: quote.material.fullName,
        //     quantity: quote.pricing.quantity,
        //   }),
        // })
        // const { url } = await response.json()
        // window.location.href = url

        // For demo, go straight to confirmation
        const orderNumber = 'PE-' + Date.now().toString(36).toUpperCase()
        onComplete(orderNumber)
    }

    if (!quote) return null

    return (
        <div className="card card-glow fade-in">
            <div className="card-title">💳 Order Summary</div>
            <div className="card-subtitle">Review your order before proceeding to payment</div>

            {/* Model Preview */}
            {file && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{ height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
                        <ModelViewer file={file} />
                    </div>
                </div>
            )}

            {/* Order Details */}
            <div style={{
                padding: 'var(--space-md)',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: 'var(--space-lg)'
            }}>
                <div className="breakdown-row">
                    <div className="breakdown-label">Technology</div>
                    <div className="breakdown-value">{quote.material.tech}</div>
                </div>
                <div className="breakdown-row">
                    <div className="breakdown-label">Material</div>
                    <div className="breakdown-value">{quote.material.fullName}</div>
                </div>
                <div className="breakdown-row">
                    <div className="breakdown-label">Quantity</div>
                    <div className="breakdown-value">{quote.pricing.quantity} unit{quote.pricing.quantity > 1 ? 's' : ''}</div>
                </div>
                {quote.printTimeHours && (
                    <div className="breakdown-row">
                        <div className="breakdown-label">Est. Print Time</div>
                        <div className="breakdown-value">{quote.printTimeHours.toFixed(1)} hours</div>
                    </div>
                )}
                <div className="breakdown-row">
                    <div className="breakdown-label">Lead Time</div>
                    <div className="breakdown-value">{quote.leadTime}</div>
                </div>
                <div className="breakdown-row">
                    <div className="breakdown-label">Shipping</div>
                    <div className="breakdown-value">{quote.pricing.shipping.label}</div>
                </div>
            </div>

            {/* Price Summary */}
            <div style={{
                padding: 'var(--space-lg)',
                background: 'var(--accent-glow)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
                textAlign: 'center',
                marginBottom: 'var(--space-lg)'
            }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Total Amount
                </div>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.2,
                }}>
                    {formatCurrency(quote.pricing.total)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    USD • Includes shipping
                </div>
            </div>

            {/* Payment notice */}
            <div style={{
                padding: 'var(--space-md)',
                background: 'var(--success-bg)',
                border: '1px solid rgba(0, 230, 118, 0.15)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
                fontSize: '0.8rem',
                color: 'var(--success)',
            }}>
                🔒 Secure payment processed by Stripe. Your payment info is never stored on our servers.
            </div>

            {/* Actions */}
            <div className="actions-row" style={{ justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleCheckout} id="pay-now-btn">
                    🔐 Pay {formatCurrency(quote.pricing.total)}
                </button>
            </div>
        </div>
    )
}
