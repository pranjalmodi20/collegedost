
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  artsRankings, 
  artsExams, 
  featuredArtsColleges, 
  artsCounsellingData, 
  artsCoursesData,
  artsCities
} from '../data/artsData';

const ArtsPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Arts & Humanities" 
        description="Top Arts colleges (BA, MA), Humanities courses, and career options."
        keywords="Arts, Humanities, BA, MA, Psychology, Sociology, History"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Understanding Humanity.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 whitespace-nowrap">Shaping Culture.</span></>}
        subtitle="Your gateway to top Arts & Humanities Colleges, Literature, and creative careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1460518451285-97b6aa326961?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "DU Admission 2026", link: "#" },
          { text: "Psychology", link: "#" },
          { text: "English Honors", link: "#" },
          { text: "History", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Arts Rankings" items={artsRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Arts Colleges" 
          items={featuredArtsColleges} 
          type="card" 
        />

        <Counselling items={artsCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Arts Hubs" items={artsCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Arts Entrance Exams" items={artsExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Arts Courses" 
              mainTitle="Humanities & Social Sciences"
              subText="Explore degrees in History, Economics, Psychology, and more."
              data={artsCoursesData}
              illustration="https://img.freepik.com/free-vector/literature-illustration-concept_114360-1286.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default ArtsPage;
