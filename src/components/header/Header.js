import styled from 'styled-components';
import { Logo } from './Logo';
import { Filters } from './Filters';

export function Header() {
  return (
    <HeaderContainer>
      <Logo />
      <Filters />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 950px) {
    justify-content: center;
    flex-direction: column;
  }
`;
