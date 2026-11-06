import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  border-radius: 0.5em;
  padding: 1em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #f3f4f6;
  margin: 1rem 0;
  border: 1px solid #ccc;
`;

const Track = styled.div`
  background-color: #e5e7eb;
  height: 1em;
  border-radius: 0.5em;
  overflow: hidden;
  width: 100%;
`;

const Fill = styled.div<{ $progress: number }>`
  background-color: #06b6d4;
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  text-align: center;
  font-size: 0.875rem;
  margin-top: 0.5em;
`;

interface ProgressBarProps {
  progress: number;
  phase: string;
}

export const ProgressBar = ({ progress, phase }: ProgressBarProps) => {
  const value = Math.min(100, Math.max(0, progress));

  return (
    <Wrapper>
      <Track
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`${phase}: ${value}%`}
      >
        <Fill $progress={value} />
      </Track>
      <ProgressLabel>{phase}</ProgressLabel>
      <ProgressLabel>{value}%</ProgressLabel>
    </Wrapper>
  );
};
