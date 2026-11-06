import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  label {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }

  input {
    min-width: 0;
    padding: 0.7rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    background-color: var(--surface);
    color: var(--text-primary);
    width: 100%;

    &:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
  }
`;
