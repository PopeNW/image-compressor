import styled from "styled-components";

export const Button = styled.button`
  display: block;
  color: #fff;
  background-color: #007bff; /* A vibrant blue for action buttons */
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;
