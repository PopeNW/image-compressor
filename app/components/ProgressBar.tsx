import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: var(--surface-muted);
  margin: 1rem 0;
  border: 1px solid var(--border);
`;

const Track = styled.div`
  background-color: var(--track);
  height: 0.65rem;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
`;

const Fill = styled.div<{ $progress: number }>`
  background-color: var(--accent);
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  border-radius: inherit;
  transition: width 250ms ease;
`;

const ProgressLabel = styled.div`
  display: inline-block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5em;

  & + & {
    float: right;
  }
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
