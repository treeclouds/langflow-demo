import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 720px;
  margin: auto;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const ChatBox = styled.div`
  flex-grow: 1;
  height: 500px;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 12px;
`;

export const Bubble = styled.div`
  align-self: ${({ from }) => (from === "user" ? "flex-start" : "flex-end")};
  background: ${({ from }) => (from === "user" ? "#ffffff" : "#DCF8C6")};
  text-align: left;
  padding: 0.4rem 0.8rem; /* Reduced padding top/bottom */
  border-radius: 16px;
  max-width: 75%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;
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
`;
export const Form = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #fff;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0; /* ✨ This allows shrinking inside flex containers */
  width: 100%;
  box-sizing: border-box; /* ensures padding/border don't cause overflow */
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

// You can use a new wrapper for the Switch
export const SwitchWrapper = styled.div`
  flex-shrink: 0;

  @media (max-width: 480px) {
    order: -1;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

export const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #e0e0e0;
  padding: 1rem;
  background-color: #fdfdfd;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.02);
`;

export const RoomItem = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 12px;
  background-color: ${({ active }) => (active ? "#e0f7fa" : "transparent")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  transition: 0.2s background;

  &:hover {
    background-color: #e0f7fa;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  order: 1; // Comes first on mobile

  @media (min-width: 769px) {
    order: 0; // Default for desktop
  }
`;

export const RoomSummaryContainer = styled.div`
  padding: 1rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
`;

export const MarkdownContainer = styled.div`
  margin-top: 20px;
  text-align: left;
  height: 20rem;
  overflow-y: auto;
  background-color: #f7f7f7;
  padding: 5%;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const RightPanel = styled.div`
  padding: 1rem;
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    order: 2;
  }

  @media (min-width: 769px) {
    order: 0; // Normal position on desktop
  }
`;

export const EmotionStatus = styled.div`
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  font-size: 0.95rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
