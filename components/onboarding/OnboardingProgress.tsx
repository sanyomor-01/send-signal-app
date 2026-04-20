'use client'

interface Props {
  stepIndex: number // 0 to 5
}

export function OnboardingProgress({ stepIndex }: Props) {
  const steps = [1, 2, 3, 4, 5];
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0',
      width: '100%',
    }}>
      {steps.map((stepNumber, index) => {
        // Concept: We have 5 steps in the indicator.
        // index 0 is Account Created
        // index 1 is Welcome
        // index 2 is WhatsApp
        // index 3 is Import
        // index 4 is Template/Campaign
        
        const isCompleted = index < stepIndex;
        const isCurrent = index === stepIndex;
        const isUpcoming = index > stepIndex;

        let bgColor = 'var(--color-surface-container-highest)';
        let textColor = 'var(--color-on-surface-variant)';
        const borderColor = 'var(--color-outline-variant)';

        if (isCompleted) {
          bgColor = 'var(--color-success)';
          textColor = 'var(--color-on-success)';
        } else if (isCurrent) {
          bgColor = 'var(--color-primary)';
          textColor = 'var(--color-on-primary)';
        }

        return (
          <div key={stepNumber} style={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: index < steps.length - 1 ? 1 : 'none' 
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              color: textColor,
              border: isUpcoming ? `1px solid ${borderColor}` : 'none',
              flexShrink: 0,
            }}>
              {isCompleted ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-outline-variant)',
                margin: '0 0.5rem',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
