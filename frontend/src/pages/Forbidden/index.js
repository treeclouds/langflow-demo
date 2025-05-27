import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Mandiri primary blue
const mandiriBlue = "#003b5c";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 2rem;
`;

const MessageBox = styled.div`
  text-align: center;
  background: #ffffff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: ${mandiriBlue};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ReturnButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${mandiriBlue};
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #005173;
  }
`;

const ForbiddenPage = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <PageWrapper>
      <MessageBox>
        <Title>You are not authorized, please return</Title>
        <ReturnButton onClick={handleReturn}>Go to Login</ReturnButton>
      </MessageBox>
    </PageWrapper>
  );
};

export default ForbiddenPage;
