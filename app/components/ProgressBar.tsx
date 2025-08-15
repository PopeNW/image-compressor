import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  border-radius: 0.5em;
  padding: 0.5em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #f3f4f6;
`;

const Bar = styled.div`
  background-color: #e5e7eb;
  height: 1em;
  border-radius: 0.5em;
  overflow: hidden;
  margin-bottom: 0.5em;
  position: relative;
  width: 100%;
`;

const BarFill = styled(Bar)<{ progress: number }>`
  background-color: #06b6d4;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  text-align: center;
  font-size: 0.875rem;
`;

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <Wrapper>
      <Bar>
        <BarFill progress={progress} />
      </Bar>
      <ProgressLabel>{progress}%</ProgressLabel>
    </Wrapper>
  );
};
