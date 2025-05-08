import React, { useState } from "react";
import {
  PageWrapper,
  ShortcutWrapper,
  ShortcutButtons,
  ShortcutCard,
  CardContainer,
  StyledInput,
  StyledButton,
} from "./element"; // adjust path if needed

const HomePage = () => {
  const [userIdentifier, setUserIdentifier] = useState("");

  const goToUserPage = () => {
    window.open(`/user/${encodeURIComponent(userIdentifier.trim())}`, "_blank");
  };

  const openAdminPage = () => {
    window.open("/admin", "_blank");
  };

  return (
    <PageWrapper>
      <ShortcutWrapper>
        <ShortcutButtons>
          <ShortcutCard onClick={() => window.open("/summarize-pdf", "_blank")}>
            <p>Summarize PDF</p>
          </ShortcutCard>

          <ShortcutCard onClick={openAdminPage}>
            <p>Admin Page</p>
          </ShortcutCard>
        </ShortcutButtons>

        <CardContainer>
          <StyledInput
            type="text"
            placeholder="Enter name or email"
            value={userIdentifier}
            onChange={(e) => setUserIdentifier(e.target.value)}
          />
          <StyledButton
            onClick={goToUserPage}
            disabled={!userIdentifier.trim()}
          >
            User Page
          </StyledButton>
        </CardContainer>
      </ShortcutWrapper>
    </PageWrapper>
  );
};

export default HomePage;
