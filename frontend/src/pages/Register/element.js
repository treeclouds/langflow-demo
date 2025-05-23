import styled from "styled-components";

export const mandiriBlue = "#003b5c";
export const mandiriLightBlue = "#006f87";
export const mandiriLighterBlue = "#e6f2f5";

export const RegisterWrapper = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${mandiriLighterBlue};
  padding: 2rem;
`;

export const RegisterCard = styled.div`
  width: 100%;
  max-width: 460px;
  padding: 2.5rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 59, 92, 0.1);
  text-align: center;
`;

export const RegisterTitle = styled.h1`
  color: ${mandiriBlue};
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
`;

export const FormLabel = styled.label`
  font-size: 0.9rem;
  color: ${mandiriBlue};
  font-weight: 500;
`;

export const RegisterInput = styled.input`
  width: 90%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: ${mandiriBlue};
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: ${mandiriBlue};
    box-shadow: 0 0 0 3px rgba(0, 59, 92, 0.1);
    outline: none;
  }
`;

export const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${mandiriBlue};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: ${mandiriLightBlue};
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const ToggleIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 1rem;
`;
