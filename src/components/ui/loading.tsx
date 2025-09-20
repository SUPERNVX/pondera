import React from 'react';

const HourglassLoader = () => {
  return (
    <div className="relative mx-auto my-8 h-[130px] w-[130px] rounded-full bg-secondary-light dark:bg-secondary-dark">
      <div 
        className="absolute left-[40px] top-[30px] h-[70px] w-[50px]"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          animation: 'hourglassRotate 2s ease-in 0s infinite'
        }}
      >
        {/* hourglassCurves */}
        <div 
          className="absolute top-[32px]"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="absolute left-[15px] h-[6px] w-[6px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
            style={{ animation: 'hideCurves 2s ease-in 0s infinite' }}
          />
          <div 
            className="absolute left-[29px] h-[6px] w-[6px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
            style={{ animation: 'hideCurves 2s ease-in 0s infinite' }}
          />
        </div>
        
        {/* hourglassCapTop */}
        <div 
          className="absolute top-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="absolute top-[-25px] h-[6px] w-[6px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
          />
          <div 
            className="absolute top-[-20px] h-[6px] w-[36px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
          />
        </div>
        
        {/* hourglassGlassTop */}
        <div 
          className="absolute left-[3px] top-[-16px] h-[44px] w-[44px] rounded-full bg-primary dark:bg-primary-light"
          style={{ 
            transform: 'rotateX(90deg)',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* hourglassSand */}
        <div 
          className="absolute left-[6px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="absolute left-0 top-[8px] h-0 w-[39px] rounded-b-[30px] rounded-t-[3px] bg-text dark:bg-text-dark"
            style={{ 
              animation: 'sandFillup 2s ease-in 0s infinite',
              perspective: '500px'
            }}
          />
          <div 
            className="absolute left-0 h-[17px] w-[38px] rounded-b-[3px] rounded-t-[30px] bg-text dark:bg-text-dark"
            style={{ 
              animation: 'sandDeplete 2s ease-in 0s infinite',
              perspective: '500px'
            }}
          />
        </div>
        
        {/* hourglassSandStream */}
        <div 
          className="absolute"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="absolute left-[24px] h-0 w-[3px] bg-text dark:bg-text-dark"
            style={{ 
              animation: 'sandStream1 2s ease-in 0s infinite'
            }}
          />
          <div 
            className="absolute left-[19px] top-[36px] border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-text dark:border-b-text-dark"
            style={{ 
              animation: 'sandStream2 2s ease-in 0s infinite'
            }}
          />
        </div>
        
        {/* hourglassCapBottom */}
        <div 
          className="absolute bottom-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="absolute bottom-[-25px] h-[6px] w-[6px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
          />
          <div 
            className="absolute bottom-[-20px] h-[6px] w-[36px] rounded-full bg-secondary-foreground-dark dark:bg-secondary-foreground-light"
          />
        </div>
        
        {/* hourglassGlass */}
        <div 
          className="absolute left-[20px] top-[32px] h-[6px] w-[10px] bg-primary/50 dark:bg-primary-light/50"
          style={{ 
            perspective: '100px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="absolute left-[-17px] top-[-27px] h-[28px] w-[44px] rounded-b-[25px] rounded-t-[0] bg-primary dark:bg-primary-light"
            style={{ transformStyle: 'preserve-3d' }}
          />
          <div 
            className="absolute bottom-[-27px] left-[-17px] h-[28px] w-[44px] rounded-b-[0] rounded-t-[25px] bg-primary dark:bg-primary-light"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>
      </div>
    </div>
  );
};

// Componente de loading simplificado apenas com hourglass
interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <HourglassLoader />
      {message && (
        <p className="mt-3 text-sm text-text/70 dark:text-text-dark/70 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Wrapper para loading com estados
interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  children,
  message,
  className = ''
}) => {
  if (isLoading) {
    return <Loading message={message} className={className} />;
  }

  return <>{children}</>;
};

export default HourglassLoader;