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

const Settings = ({
  maxSizeMB,
  setMaxSizeMB,
  maxWidthOrHeight,
  setMaxWidthOrHeight,
}: CompressionOptionsProps) => {
  return (
    <Section>
      <SectionTitle>Settings</SectionTitle>
      <InputWrapper>
        <label>Max Size (MB):</label>
        <input
          type="number"
          value={maxSizeMB}
          onChange={(e) => setMaxSizeMB(Number(e.target.value))}
          min="0.1"
          step="0.1"
        />
      </InputWrapper>
      <InputWrapper>
        <label>Max Width/Height (px):</label>
        <input
          type="number"
          value={maxWidthOrHeight}
          onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
          min="1"
        />
      </InputWrapper>
    </Section>
  );
};

export { Settings };
