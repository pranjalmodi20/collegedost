
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { 
  educationRankings, 
  educationExams, 
  featuredEducationColleges, 
  educationCounsellingData, 
  educationCoursesData,
  educationCities
} from '../data/educationData';

const EducationPage = ({ onOpenAskModal }) => {
  return (
    <>
      <SEO 
        title="Education & Teaching" 
        description="Top B.Ed colleges, Teaching exams (CTET, NET), and career in Education."
        keywords="Education, Teaching, B.Ed, M.Ed, CTET, NET"
      />
      <Hero 
        title={<><span className="block whitespace-nowrap">Empowering Minds.</span> <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 whitespace-nowrap">Building the Future.</span></>}
        subtitle="Your gateway to top Education Colleges, B.Ed exams, and teaching careers."
        showBadge={true}
        bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "CTET 2026", link: "#" },
          { text: "B.Ed Admission", link: "#" },
          { text: "UGC NET", link: "#" },
          { text: "Teaching Jobs", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Education Rankings" items={educationRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Education Colleges" 
          items={featuredEducationColleges} 
          type="card" 
        />

        <Counselling items={educationCounsellingData} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Top Education Hubs" items={educationCities} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Teaching Exams" items={educationExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Education Courses" 
              mainTitle="Teaching & Education"
              subText="Become a certified teacher with B.Ed, M.Ed, and other courses."
              data={educationCoursesData}
              illustration="https://img.freepik.com/free-vector/teacher-standing-near-blackboard-holding-stick-isolated-flat-vector-illustration-cartoon-woman-character-near-chalkboard-school-learning-concept_74855-1324.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default EducationPage;
