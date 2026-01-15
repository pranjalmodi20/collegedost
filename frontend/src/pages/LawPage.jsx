
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import { 
  lawRankings, 
  lawExams, 
  featuredLawColleges, 
  lawCounsellingData, 
  lawCoursesData 
} from '../data/lawData';

const LawPage = ({ onOpenAskModal }) => {
  return (
    <>
      <Hero 
        title={
          <>
            Shape Justice. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pursue Law.</span>
          </>
        }
        subtitle="Discover top Law colleges, CLAT preparation, and legal careers in India."
        bgImage="https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "CLAT 2025", link: "#" },
          { text: "AILET", link: "#" },
          { text: "NLUs", link: "#" },
          { text: "LLB Admissions", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Law Rankings" items={lawRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Law Colleges" 
          items={featuredLawColleges} 
          type="card" 
        />

        <Counselling items={lawCounsellingData} onOpenAskModal={onOpenAskModal} />
        
      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Law Entrance Exams" items={lawExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Law Courses" 
              mainTitle="Legal Studies"
              subText="Explore undergraduate and postgraduate law programs."
              data={lawCoursesData}
              illustration="https://img.freepik.com/free-vector/judge-gavel-scales-justice-realistic-composition_1284-26665.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default LawPage;
