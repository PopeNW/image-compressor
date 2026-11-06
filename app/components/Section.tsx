import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  background-color: var(--surface);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
`;
