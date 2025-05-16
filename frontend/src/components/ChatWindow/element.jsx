import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 720px;
  height: 90vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const ChatBox = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Bubble = styled.div`
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  background: ${({ isUser }) => (isUser ? "#DCF8C6" : "#ffffff")};
  text-align: left;
  color: #222;
  padding: 0.5rem 0.8rem; /* reduced padding */
  border-radius: 16px;
  max-width: 75%;
  position: relative;
  font-size: 0.9rem;
  line-height: 1.3; /* slightly tighter */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Optional: fine-tune spacing for markdown */
  p {
    margin: 0;
  }

  pre {
    margin: 0.5rem 0 0 0;
  }
`;

export const Form = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #fff;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 24px;
  font-size: 1rem;
  outline: none;
  transition: 0.2s all;

  &:focus {
    border-color: #128c7e;
    box-shadow: 0 0 0 2px rgba(18, 140, 126, 0.2);
  }
`;

export const Button = styled.button`
  margin-left: 0.5rem;
  padding: 0.75rem 1.2rem;
  border-radius: 24px;
  background: #128c7e;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background: #0d6f63;
  }
`;
