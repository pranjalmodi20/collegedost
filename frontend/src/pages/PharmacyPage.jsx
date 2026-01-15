
import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import { 
  pharmacyRankings, 
  pharmacyExams, 
  featuredPharmacyColleges, 
  pharmacyCounsellingData, 
  pharmacyCoursesData 
} from '../data/pharmacyData';

const PharmacyPage = ({ onOpenAskModal }) => {
  return (
    <>
      <Hero 
        title={
          <>
            Pharmacy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Education & Careers.</span>
          </>
        }
        subtitle="Explore top Pharmacy colleges, exams, and courses to kickstart your career in healthcare."
        bgImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=85"
        trending={[
          { text: "GPAT 2025", link: "#" },
          { text: "NIPER JEE", link: "#" },
          { text: "B.Pharma Admissions", link: "#" },
          { text: "Top Colleges", link: "#" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Top Pharmacy Rankings" items={pharmacyRankings} color="border-gray-200" />
        
        <Section 
          title="Featured Pharmacy Colleges" 
          items={featuredPharmacyColleges} 
          type="card" 
        />

        <Counselling items={pharmacyCounsellingData} onOpenAskModal={onOpenAskModal} />
        
      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
            <PillSection title="Pharmacy Entrance Exams" items={pharmacyExams} color="border-gray-200" />
            
            <PredictorsSection 
              title="Pharmacy Courses" 
              mainTitle="Specialized Courses"
              subText="Explore diplomas, degrees, and master programs in Pharmacy."
              data={pharmacyCoursesData}
              illustration="https://img.freepik.com/free-vector/scientists-working-lab_23-2148499713.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default PharmacyPage;
