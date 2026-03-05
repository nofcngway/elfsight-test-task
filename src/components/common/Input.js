import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  background: #2b3e5a;
  border: 1px solid #4d5e76;
  border-radius: 8px;
  padding: 10px 15px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &::placeholder {
    color: #8c9baf;
  }

  &:hover,
  &:focus {
    background: #364a68;
    border-color: #83bf46;
  }
`;
