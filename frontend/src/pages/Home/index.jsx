import React from "react";
import {
  PageWrapper,
  ShortcutWrapper,
  ShortcutCard,
  CardContainer,

  Section,
  SectionTitle,
} from "./element";

const HomePage = () => {
  const userInfo = localStorage.getItem("personal_data");
  const goToUserPage = () => {
    if (!userInfo.trim()) return;
    window.open(`/user/${encodeURIComponent(userInfo.trim())}`, "_blank");
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
          <SectionTitle>Document Summary Tools</SectionTitle>
          <ShortcutCard onClick={openSummaryPage}>Summarize PDF</ShortcutCard>
        </Section>

        <Section>
          <SectionTitle>Admin Page</SectionTitle>
          <ShortcutCard onClick={openAdminPage}>Go to Admin Page</ShortcutCard>
        </Section>

        <Section>
          <SectionTitle>User Chat</SectionTitle>
          <CardContainer>
        
          
              <ShortcutCard onClick={goToUserPage}>Go to User Page</ShortcutCard>
          </CardContainer>
        </Section>
      </ShortcutWrapper>
    </PageWrapper>
  );
};

export default HomePage;
