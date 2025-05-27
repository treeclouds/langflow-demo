import React from "react";
import {
  PageWrapper,
  ShortcutWrapper,
  ShortcutCard,
  CardContainer,
  Section,
  SectionTitle,
  LogoutWrapper,
} from "./element";
import axios from "axios";

const HomePage = () => {
  const logout = async () => {
    try {
      await axios.post(
        "/logout",
        {},
        {
          withCredentials: true, // ensures cookies are sent
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("personal_data");
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login page
    }
  };

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
      <LogoutWrapper>
        <ShortcutCard onClick={logout}>Logout</ShortcutCard>
      </LogoutWrapper>

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
