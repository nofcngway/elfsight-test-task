import styled from 'styled-components';

export const Button = styled.button`
  background: transparent;
  color: ${({ color }) => color || '#83bf46'};
  border: 1px solid ${({ color }) => color || '#83bf46'};
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ color }) => color || '#83bf46'};
    color: #fff;
  }
`;
