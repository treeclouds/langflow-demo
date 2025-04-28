import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Mandiri Bank's color base (blue)
const mandiriBlue = "#003b5c";

const IconWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  padding: 5%;
`;

const Icon = styled.div`
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

export default function Home() {
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    navigate(page);
  };

  return (
    <main>
      <IconWrapper>
        <Icon onClick={() => navigateToPage("/summarize-pdf")}>
          <p>Summarize PDF</p>
        </Icon>
        <Icon onClick={() => navigateToPage("/user")}>
          <p>User Page</p>
        </Icon>
        <Icon onClick={() => navigateToPage("/admin")}>
          <p>Admin Page</p>
        </Icon>
      </IconWrapper>
    </main>
  );
}
