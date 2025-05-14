import React, { useState } from "react";
import {
  PageWrapper,
  ShortcutWrapper,
  ShortcutCard,
  CardContainer,
  StyledInput,
  StyledButton,
  Section,
  SectionTitle,
} from "./element";

const HomePage = () => {
  const [userIdentifier, setUserIdentifier] = useState("");

  const goToUserPage = () => {
    if (!userIdentifier.trim()) return;
    window.open(`/user/${encodeURIComponent(userIdentifier.trim())}`, "_blank");
  };

  const openAdminPage = () => {
    window.open("/admin", "_blank");
  };

  const openSummaryPage = () => {
    window.open("/summarize-pdf", "_blank");
  };

  return (
    <PageWrapper>
      <ShortcutWrapper>
        <Section>
          <SectionTitle>📄 Document Tools</SectionTitle>
          <ShortcutCard onClick={openSummaryPage}>Summarize PDF</ShortcutCard>
        </Section>

        <Section>
          <SectionTitle>🛠️ Admin Tools</SectionTitle>
          <ShortcutCard onClick={openAdminPage}>Go to Admin Page</ShortcutCard>
        </Section>

        <Section>
          <SectionTitle>🔍 User Page Lookup</SectionTitle>
          <CardContainer>
            <StyledInput
              type="text"
              placeholder="Enter name or email"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToUserPage();
              }}
            />
            <StyledButton
              onClick={goToUserPage}
              disabled={!userIdentifier.trim()}
            >
              Go
            </StyledButton>
          </CardContainer>
        </Section>
      </ShortcutWrapper>
    </PageWrapper>
  );
};

export default HomePage;
