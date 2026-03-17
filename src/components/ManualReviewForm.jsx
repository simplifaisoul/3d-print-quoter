import { useState } from 'react'

export default function ManualReviewForm({ file, modelData, onBack, onSubmit }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        description: '',
        timeline: 'standard',
    })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        // Simulate submission (replace with actual API call / EmailJS)
        await new Promise(resolve => setTimeout(resolve, 1500))

        setSubmitting(false)
        setSubmitted(true)

        if (onSubmit) {
            onSubmit({
                ...form,
                fileName: file?.name,
                modelData,
            })
        }
    }

    if (submitted) {
        return (
            <div className="card manual-review-card fade-in">
                <div className="confirmation">
                    <div className="confirmation-icon">📬</div>
                    <div className="confirmation-title">Request Received!</div>
                    <div className="confirmation-subtitle">
                        We'll review your project and get back to you within 24 hours with a custom quote.
                    </div>
                    <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: 'var(--space-lg)' }}>
                        ← Start New Quote
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="card manual-review-card fade-in">
            <div className="card-title">🤝 Request Custom Quote</div>
            <div className="card-subtitle">
                Tell us about your project and we'll prepare a detailed quote tailored to your needs.
            </div>

            {file && (
                <div className="file-info" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="file-info-icon">🧊</div>
                    <div className="file-info-details">
                        <div className="file-info-name">{file.name}</div>
                        <div className="file-info-size">
                            {modelData?.volumeCm3
                                ? `${modelData.volumeCm3.toFixed(1)} cm³ · ${modelData.dimensions?.x?.toFixed(0)}×${modelData.dimensions?.y?.toFixed(0)}×${modelData.dimensions?.z?.toFixed(0)} mm`
                                : 'Model attached'}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="two-column" style={{ gap: 'var(--space-md)' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="mr-name">Full Name *</label>
                        <input
                            className="form-input"
                            id="mr-name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="mr-email">Email Address *</label>
                        <input
                            className="form-input"
                            id="mr-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="two-column" style={{ gap: 'var(--space-md)' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="mr-phone">Phone Number</label>
                        <input
                            className="form-input"
                            id="mr-phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="(123) 456-7890"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="mr-company">Company (Optional)</label>
                        <input
                            className="form-input"
                            id="mr-company"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Company name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="mr-timeline">Timeline</label>
                    <select
                        className="form-input"
                        id="mr-timeline"
                        name="timeline"
                        value={form.timeline}
                        onChange={handleChange}
                    >
                        <option value="flexible">Flexible / No rush</option>
                        <option value="standard">Standard (1-2 weeks)</option>
                        <option value="rush">Rush (ASAP)</option>
                        <option value="ongoing">Ongoing / Recurring order</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="mr-description">Project Description *</label>
                    <textarea
                        className="form-input"
                        id="mr-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project: intended use, material preferences, quantity, special requirements, tolerances, finish quality, etc."
                        rows={5}
                    />
                </div>

                <div className="actions-row" style={{ justifyContent: 'space-between' }}>
                    <button type="button" className="btn btn-secondary" onClick={onBack}>
                        ← Back to Auto-Quote
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={submitting || !form.name || !form.email || !form.description}
                        id="submit-review-btn"
                    >
                        {submitting ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Sending...
                            </>
                        ) : (
                            '📤 Submit Request'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
