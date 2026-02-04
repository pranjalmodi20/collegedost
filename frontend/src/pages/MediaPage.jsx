
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  mediaRankings, 
  mediaExams, 
  featuredMediaColleges, 
  mediaCounsellingData, 
  mediaCoursesData,
  mediaCities
} from '../data/mediaData';

const MediaPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Media & Journalism" 
        description="Top Mass Communication colleges, Journalism courses, and Media exams in India."
        keywords="Mass Communication, Journalism, Media, IIMC, BJMC"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Voice of the World.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 whitespace-nowrap">Mastering Media.</span></>}
        subtitle="Your gateway to top Mass Communication Colleges, Journalism, and Media careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "IIMC 2026", link: "#" },
          { text: "BJMC Admission", link: "#" },
          { text: "Journalism", link: "#" },
          { text: "Film Studies", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Media Rankings" items={mediaRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Media Colleges" 
          items={featuredMediaColleges} 
          type="card" 
        />

        <Counselling items={mediaCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Media Hubs" items={mediaCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Media Entrance Exams" items={mediaExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Media Courses" 
              mainTitle="Journalism & Mass Communication"
              subText="From Reporting to Digital Media, find the right course for you."
              data={mediaCoursesData}
              illustration="https://img.freepik.com/free-vector/press-conference-concept-illustration_114360-1033.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default MediaPage;
