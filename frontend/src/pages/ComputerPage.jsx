
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  computerRankings, 
  computerExams, 
  featuredComputerColleges, 
  computerCounsellingData, 
  computerCoursesData,
  computerCities
} from '../data/computerData';

const ComputerPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Computer Applications & IT" 
        description="Top MCA/BCA colleges, NIMCET exam, and IT career paths in India."
        keywords="MCA, BCA, Computer Applications, IT, NIMCET"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Coding the Future.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 whitespace-nowrap">Innovating with Tech.</span></>}
        subtitle="Your gateway to top MCA/BCA Colleges, NIMCET prep, and IT careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "NIMCET 2026", link: "#" },
          { text: "BCA Admission", link: "#" },
          { text: "MCA Colleges", link: "#" },
          { text: "Data Science", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top IT Rankings" items={computerRankings} color="border-gray-200" />
        
        <Section 
          title="Featured IT Colleges" 
          items={featuredComputerColleges} 
          type="card" 
        />

        <Counselling items={computerCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top IT Hubs" items={computerCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="IT Entrance Exams" items={computerExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Computer Applications" 
              mainTitle="Software & Development"
              subText="Launch your career in Software Engineering, Data Science, and AI."
              data={computerCoursesData}
              illustration="https://img.freepik.com/free-vector/programmer-working-web-development-code-engineer-programming-python-php-java-script-computer_90220-251.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default ComputerPage;
