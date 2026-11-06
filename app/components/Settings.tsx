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
  gap: 1rem;
  width: 100%;
  border-radius: 0.5em;
  border: 1px solid #ccc;
  padding: 1em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #f3f4f6;
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
