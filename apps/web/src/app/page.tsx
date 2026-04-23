"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHome } from "@/components/features/dashboard/DashboardHome";
import { VoterDatabase } from "@/components/features/voters/VoterDatabase";
import { Analytics } from "@/components/features/analytics/Analytics";
import { useAppStore } from "@/stores/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
import { VoterGuide } from "@/components/features/guide/VoterGuide";
import { ElectionSimulations } from "@/components/features/simulation/ElectionSimulations";
import ElectionQuiz from "@/components/features/quiz/ElectionQuiz";
import { CampaignSettings } from "@/components/features/settings/CampaignSettings";
import { ChatAssistant } from "@/components/features/chat/ChatAssistant";

export default function Home() {
  const { activeSection } = useAppStore();

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome />;
      case "guide":
        return <VoterGuide />;
      case "candidates":
        return <VoterDatabase />;
      case "timeline":
        return <Analytics />;
      case "settings":
        return <CampaignSettings />;
      case "simulation":
        return <ElectionSimulations />;
      case "quiz":
        return <ElectionQuiz />;
      case "chat":
        return (
          <div className="max-w-4xl mx-auto">
            <ChatAssistant inline />
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
