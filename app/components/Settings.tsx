import styled from "styled-components";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
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
  padding: 0.5em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #f3f4f6;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  width: 100%;
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
        <label>Max Size (MB)</label>
        <Input
          type="number"
          value={maxSizeMB}
          onChange={(e) => setMaxSizeMB(Number(e.target.value))}
          min="0.1"
          step="0.1"
        />
      </InputWrapper>
      <InputWrapper>
        <label>Max Width/Height (px)</label>
        <Input
          type="number"
          value={maxWidthOrHeight}
          onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
          min="1"
        />
      </InputWrapper>
    </OptionsWrapper>
  );
};

export { Settings };
