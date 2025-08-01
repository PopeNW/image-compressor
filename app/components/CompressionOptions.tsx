import styled from "styled-components";

const Section = styled.section`
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #555;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  label {
    margin-bottom: 0.5rem;
    color: #333;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
`;

interface CompressionOptionsProps {
  maxSizeMB: number;
  setMaxSizeMB: (value: number) => void;
  maxWidthOrHeight: number;
  setMaxWidthOrHeight: (value: number) => void;
}

const CompressionOptions = ({
  maxSizeMB,
  setMaxSizeMB,
  maxWidthOrHeight,
  setMaxWidthOrHeight,
}: CompressionOptionsProps) => {
  return (
    <Section>
      <SectionTitle>Compression Options</SectionTitle>
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

export { CompressionOptions };
