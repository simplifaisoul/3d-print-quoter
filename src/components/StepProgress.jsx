export default function StepProgress({ currentStep, steps }) {
    return (
        <div className="step-progress">
            {steps.map((step, i) => {
                const isActive = i === currentStep
                const isCompleted = i < currentStep

                return (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {isCompleted ? '✓' : i + 1}
                            </div>
                            <span className="step-label">{step.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`step-connector ${isCompleted ? 'active' : ''}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
