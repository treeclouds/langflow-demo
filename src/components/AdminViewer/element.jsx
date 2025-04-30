import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  max-width: 700px;
  border-radius: 8px;
`;

export const ChatBox = styled.div`
  height: 500px;
  overflow-y: auto;
  margin-bottom: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Bubble = styled.div`
  align-self: ${({ from }) => (from === "user" ? "flex-start" : "flex-end")};
  background: ${({ from }) => (from === "user" ? "#F1F1F1" : "#D6EAF8")};
  text-align: left;

  padding: 0.6rem 1rem;
  border-radius: 18px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const Form = styled.form`
  display: flex;
  gap: 0.5rem;
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #00796B;
  color: white;
  border: none;
`;


export const Layout = styled.div`
  display: flex;
  height: 100vh;
`;

export const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f7f7f7;
`;

export const RoomItem = styled.div`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  background-color: ${({ active }) => (active ? "#e0f7fa" : "transparent")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};

  &:hover {
    background-color: #e0f7fa;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;
