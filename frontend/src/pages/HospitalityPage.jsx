
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  hospitalityRankings, 
  hospitalityExams, 
  featuredHospitalityColleges, 
  hospitalityCounsellingData, 
  hospitalityCoursesData,
  hospitalityCities
} from '../data/hospitalityData';

const HospitalityPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Hospitality & Tourism" 
        description="Find top Hotel Management colleges, NCHMCT JEE info, and hospitality career paths."
        keywords="Hotel Management, Hospitality, Tourism, NCHMCT JEE, IHM"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Service with a Smile.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 whitespace-nowrap">Leading in Hospitality.</span></>}
        subtitle="Your gateway to top Hotel Management Colleges, NCHMCT prep, and hospitality careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "NCHMCT JEE 2026", link: "#" },
          { text: "IHM Delhi", link: "#" },
          { text: "Hotel Management", link: "#" },
          { text: "Culinary Arts", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Hospitality Rankings" items={hospitalityRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Hotel Management Colleges" 
          items={featuredHospitalityColleges} 
          type="card" 
        />

        <Counselling items={hospitalityCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Hospitality Hubs" items={hospitalityCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Hospitality Entrance Exams" items={hospitalityExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Hospitality Courses" 
              mainTitle="Hotel & Travel Management"
              subText="Pursue degrees in Hotel Management, Culinary Arts, and Travel & Tourism."
              data={hospitalityCoursesData}
              illustration="https://img.freepik.com/free-vector/hotel-staff-concept-illustration_114360-12966.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default HospitalityPage;
