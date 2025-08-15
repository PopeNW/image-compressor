import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

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
