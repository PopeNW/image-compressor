import styled from "styled-components";

import { InputWrapper } from "./InputWrapper";

interface CompressionOptionsProps {
  maxSizeMB: number;
  setMaxSizeMB: (value: number) => void;
  maxWidthOrHeight: number;
  setMaxWidthOrHeight: (value: number) => void;
}

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.875rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  padding: 1rem;
  background-color: var(--surface-muted);

  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

const Settings = ({
  maxSizeMB,
  setMaxSizeMB,
  maxWidthOrHeight,
  setMaxWidthOrHeight,
}: CompressionOptionsProps) => {
  return (
    <OptionsWrapper>
      <InputWrapper>
        <label htmlFor="maxSizeMB">Max Size (MB)</label>
        <input
          id="maxSizeMB"
          type="number"
          value={maxSizeMB}
          onChange={(event) => setMaxSizeMB(Number(event.target.value))}
          min="0.1"
          step="0.1"
        />
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="maxWidthOrHeight">Max Width/Height (px)</label>
        <input
          id="maxWidthOrHeight"
          type="number"
          value={maxWidthOrHeight}
          onChange={(event) => setMaxWidthOrHeight(Number(event.target.value))}
          min="1"
          step="1"
        />
      </InputWrapper>
    </OptionsWrapper>
  );
};

export { Settings };
