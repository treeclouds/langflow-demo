import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  max-width: 600px;
  border-radius: 8px;
`;

export const ChatBox = styled.div`
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 1rem;
  background: #f0f0f0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Bubble = styled.div`
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  background: ${({ isUser }) => (isUser ? "#DCF8C6" : "#fff")};
  text-align: ${({ isUser }) => (isUser ? "right" : "left")};
  padding: 0.6rem 1rem;
  border-radius: 18px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
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
  background: #128C7E;
  color: #fff;
  border: none;
`;
