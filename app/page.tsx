'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { DigitalTwin2D } from '@/components/DigitalTwin2D';
import { ModuleUploadManager } from '@/components/ModuleUploadManager';
import { PanduWiChat } from '@/components/PanduWiChat';
import { CurriculumDesigner } from '@/components/CurriculumDesigner';
import { ProjectsExplorer } from '@/components/ProjectsExplorer';
import { ArchitectureWorkbench } from '@/components/ArchitectureWorkbench';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [activeChatPrompt, setActiveChatPrompt] = useState<string>('');

  const handleOpenChatWithPrompt = (promptText: string) => {
    setActiveChatPrompt(promptText);
    const element = document.getElementById('konsultasi');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToDigitalTwin = () => {
    const element = document.getElementById('digital-twin');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToModules = () => {
    const element = document.getElementById('modul-ajar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToChat = () => {
    const element = document.getElementById('konsultasi');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar onOpenChat={handleScrollToChat} />

      <main className="flex-1">
        <Hero
          onExploreDigitalTwin={handleScrollToDigitalTwin}
          onExploreModules={handleScrollToModules}
          onOpenChatWithPrompt={handleOpenChatWithPrompt}
        />

        <DigitalTwin2D />

        <ModuleUploadManager onConsultPanduWi={handleOpenChatWithPrompt} />

        <PanduWiChat
          initialPrompt={activeChatPrompt}
          onClearInitialPrompt={() => setActiveChatPrompt('')}
        />

        <CurriculumDesigner onConsultPanduWi={handleOpenChatWithPrompt} />

        <ProjectsExplorer onConsultPanduWi={handleOpenChatWithPrompt} />

        <ArchitectureWorkbench />
      </main>

      <Footer />
    </div>
  );
}
