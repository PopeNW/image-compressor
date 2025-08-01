import styled, { css } from "styled-components";

export const interactiveStyles = css`
  display: inline-block;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  opacity: 1;
  text-decoration: none;
  text-align: center;
`;

export const Button = styled.button`
  ${interactiveStyles}

  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
