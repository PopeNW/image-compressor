import styled, { css } from "styled-components";

export const interactiveStyles = css`
  display: inline-block;
  color: #fff;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease,
    box-shadow 160ms ease;
  opacity: 1;
  text-decoration: none;
  text-align: center;
  font-weight: 650;

  &:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 3px;
  }
`;

export const Button = styled.button`
  ${interactiveStyles}

  background-color: var(--accent);

  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;
