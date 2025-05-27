import styled from "styled-components";

export const mandiriBlue = "#003b5c";

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 2rem;
`;

export const ShortcutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
`;

export const ShortcutButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

export const ShortcutCard = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: ${mandiriBlue};
  color: white;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #006f87;
    transform: translateY(-2px);
  }

  p {
    margin: 0;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
  color: ${mandiriBlue};

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: ${mandiriBlue};
    box-shadow: 0 0 0 2px rgba(0, 59, 92, 0.1);
    outline: none;
  }
`;

export const StyledButton = styled.button`
  padding: 0.75rem 1.2rem;
  background-color: ${mandiriBlue};
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #005173;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${mandiriBlue};
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: left;
`;
export const LogoutWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
`;