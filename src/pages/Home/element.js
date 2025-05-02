// MandiriUI.js
import styled from "styled-components";

export const mandiriBlue = "#003b5c";

export const SectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5%;
`;

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 20px 30px;
  background-color: ${mandiriBlue};
  border-radius: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: white;
  color: ${mandiriBlue};

  &::placeholder {
    color: #888;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  }
`;

export const StyledButton = styled.button`
  padding: 12px 20px;
  background-color: white;
  color: ${mandiriBlue};
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f2f2f2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    color: #666;
  }
`;

export const ShortcutButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  padding: 5%;
`;

export const ShortcutCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: ${mandiriBlue};
  border-radius: 20px;
  width: 150px;
  height: 100px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
  font-size: 16px;

  &:hover {
    background-color: #006f87;
    transform: scale(1.05);
  }

  p {
    margin: 0;
    font-size: 16px;
    color: white;
  }
`;
