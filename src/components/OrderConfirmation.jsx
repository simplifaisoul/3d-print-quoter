export default function OrderConfirmation({ orderNumber, quote, onNewQuote }) {
    return (
        <div className="card card-glow fade-in">
            <div className="confirmation">
                <div className="success-checkmark">
                    <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" />
                        <path d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>

                <div className="confirmation-title">Order Confirmed! 🎉</div>
                <div className="confirmation-subtitle">
                    Your 3D print order has been received and is being processed.
                </div>

                <div style={{
                    display: 'inline-block',
                    padding: 'var(--space-md) var(--space-xl)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-xl)',
                }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Order Number
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                        {orderNumber}
                    </div>
                </div>

                {quote && (
                    <div style={{
                        maxWidth: '400px',
                        margin: '0 auto var(--space-xl)',
                        padding: 'var(--space-lg)',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'left',
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
                            What's Next
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>📧</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Confirmation Email</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        You'll receive an order confirmation shortly
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>🔍</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>File Review</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Our team will verify your model for printability
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>🖨️</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Production</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Your part will be printed and quality-checked
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>📦</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Shipping</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Estimated delivery: {quote.leadTime}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="actions-row">
                    <button className="btn btn-primary" onClick={onNewQuote} id="new-quote-btn">
                        🔄 Get Another Quote
                    </button>
                    <a
                        href="mailto:3DPrintsEverything@gmail.com"
                        className="btn btn-secondary"
                    >
                        📧 Contact Support
                    </a>
                </div>
            </div>
        </div>
    )
}
