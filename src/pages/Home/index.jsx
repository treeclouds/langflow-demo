import React, { useState } from "react";
import {
  ShortcutButtons,
  ShortcutCard,
  SectionWrapper,
  CardContainer,
  StyledInput,
  StyledButton,
} from "./element"; // adjust path as needed

const HomePage = () => {
  const [userIdentifier, setUserIdentifier] = useState("");

  const goToUserPage = () => {
    // Open the user page in a new tab
    window.open(`/user/${encodeURIComponent(userIdentifier.trim())}`, "_blank");
  };

  const openAdminPage = () => {
    // Open the admin page in a new tab
    window.open("/admin", "_blank");
  };

  return (
    <>
      <ShortcutButtons>
        <ShortcutCard onClick={() => window.open("/summarize-pdf", "_blank")}>
          <p>Summarize PDF</p>
        </ShortcutCard>

        <ShortcutCard onClick={openAdminPage}>
          <p>Admin Page</p>
        </ShortcutCard>
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
      </ShortcutButtons>

      <SectionWrapper></SectionWrapper>
    </>
  );
};

export default HomePage;
