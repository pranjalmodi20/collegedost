
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  scienceRankings, 
  scienceExams, 
  featuredScienceColleges, 
  scienceCounsellingData, 
  scienceCoursesData,
  scienceCities
} from '../data/scienceData';

const SciencePage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Science" 
        description="Top Science colleges (B.Sc, M.Sc), Research Institutes, and career in Science."
        keywords="Science, B.Sc, M.Sc, Research, IISc, IISER"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Exploring the Unknown.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 whitespace-nowrap">Discovering Truth.</span></>}
        subtitle="Your gateway to top Science Colleges, Research Institutes, and scientific careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "IISc Bangalore", link: "#" },
          { text: "IISER", link: "#" },
          { text: "B.Sc Programs", link: "#" },
          { text: "JAM 2026", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Science Rankings" items={scienceRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Science Colleges" 
          items={featuredScienceColleges} 
          type="card" 
        />

        <Counselling items={scienceCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Science Hubs" items={scienceCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Science Entrance Exams" items={scienceExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Science Courses" 
              mainTitle="Pure & Applied Sciences"
              subText="Explore B.Sc, M.Sc, and PhD programs in various disciplines."
              data={scienceCoursesData}
              illustration="https://img.freepik.com/free-vector/science-lab-concept-illustration_114360-1289.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default SciencePage;
