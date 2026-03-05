import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export function Select({ options, value, onChange, placeholder = 'Select' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleOptionClick = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      onChange('');
    },
    [onChange]
  );

  return (
    <Container ref={selectRef}>
      <Header onClick={handleToggle} isOpen={isOpen}>
        <ValueText hasValue={!!value}>{value || placeholder}</ValueText>
        <IconContainer>
          {value ? (
            <CrossIcon onClick={handleClear} />
          ) : (
            <ChevronIcon isOpen={isOpen} />
          )}
        </IconContainer>
      </Header>

      {isOpen && (
        <Dropdown>
          {options.length > 0 ? (
            options.map((option) => (
              <OptionItem
                key={option}
                option={option}
                isSelected={option === value}
                onClick={handleOptionClick}
              />
            ))
          ) : (
            <NoOptions>No options</NoOptions>
          )}
        </Dropdown>
      )}
    </Container>
  );
}

function OptionItem({ option, isSelected, onClick }) {
  const handleClick = useCallback(() => onClick(option), [option, onClick]);

  return (
    <Option isSelected={isSelected} onClick={handleClick}>
      {option}
    </Option>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ isOpen }) => (isOpen ? '#364a68' : '#2b3e5a')};
  border: 1px solid ${({ isOpen }) => (isOpen ? '#83bf46' : '#4d5e76')};
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #364a68;
    border-color: #83bf46;
  }
`;

const ValueText = styled.div`
  color: ${({ hasValue }) => (hasValue ? '#fff' : '#8c9baf')};
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 195px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 20;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c4c4c4;
    border-radius: 10px;
  }
`;

const Option = styled.div`
  padding: 10px 15px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? '#e2f0d9' : '#fff')};
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  transition: background 0.2s;

  &:hover {
    background: #e2f0d9;
  }
`;

const NoOptions = styled.div`
  padding: 10px 15px;
  color: #999;
  font-size: 16px;
`;

const StyledChevronIcon = styled.svg`
  stroke: #8c9baf;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s, stroke 0.2s;
`;

const ChevronIcon = ({ isOpen }) => (
  <StyledChevronIcon
    isOpen={isOpen}
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L6 6L11 1" />
  </StyledChevronIcon>
);

const StyledCrossIcon = styled.svg`
  stroke: #8c9baf;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  cursor: pointer;
  transition: stroke 0.2s;

  &:hover {
    stroke: #83bf46;
  }
`;

const CrossIcon = ({ onClick }) => (
  <StyledCrossIcon
    onClick={onClick}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 13L13 1M1 1L13 13" />
  </StyledCrossIcon>
);
