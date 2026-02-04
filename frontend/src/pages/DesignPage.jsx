import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Counselling from '../components/Counselling';
import PillSection from '../components/PillSection';
import PredictorsSection from '../components/PredictorsSection';
import SEO from '../components/SEO';
import { browseByStreamData } from '../data';
import { featuredDesignColleges } from '../data/designData';

const DesignPage = ({ onOpenAskModal }) => {
  const data = browseByStreamData.find(d => d.id === 'animation');

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <SEO 
        title="Design & Animation" 
        description="Explore top Design colleges, NIFT/NID exams, and creative careers in India."
        keywords="Design colleges, NIFT, NID, Fashion Design, Graphic Design, Animation"
      />
      <Hero 
        title={<>Creative Design. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Shape the Future.</span></>}
        subtitle="Discover India's top Design Schools, NIFT/NID Exams, and Creative Portfolios."
        trending={[
          { text: 'NIFT 2026', link: '#' },
          { text: 'NID DAT', link: '#' },
          { text: 'Fashion Design', link: '#' },
          { text: 'UCEED', link: '#' }
        ]}
        showBadge={true}
      />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col gap-16">
        
        <PillSection title="Design Entrance Exams" items={data.content.exams} color="border-gray-200" />
        
        <Section 
          title="Featured Design Colleges" 
          items={featuredDesignColleges} 
          type="card" 
        />

        <Counselling items={[]} onOpenAskModal={onOpenAskModal} />
        
        <PillSection title="Predictors & Resources" items={data.content.predictors} color="border-gray-200" />

      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 flex-grow flex flex-col gap-16">
             <PredictorsSection 
              title="Design Courses" 
              mainTitle="Fashion & Industrial Design"
              subText="Explore specializations like Fashion, Interior, Product, and Graphic Design."
              data={[
                {
                  title: "Popular Design Degrees",
                  items: [
                    { name: "Bachelor of Design (B.Des)", link: "#" },
                    { name: "Master of Design (M.Des)", link: "#" },
                    { name: "B.Sc in Fashion Design", link: "#" },
                    { name: "B.F.Tech (Apparel Production)", link: "#" },
                    { name: "Ph.D in Design", link: "#" },
                    { name: "Diploma in Design", link: "#" },
                    { name: "Certificate Courses", link: "#" },
                    { name: "M.Arch (Related)", link: "#" }
                  ]
                },
                {
                  title: "Specializations",
                  items: [
                    { name: "Fashion Design", link: "#" },
                    { name: "Interior Design", link: "#" },
                    { name: "Graphic Design", link: "#" },
                    { name: "Product Design", link: "#" },
                    { name: "UX/UI Design", link: "#" },
                    { name: "Textile Design", link: "#" },
                    { name: "Animation Film Design", link: "#" },
                    { name: "Game Design", link: "#" },
                    { name: "Automobile Design", link: "#" },
                    { name: "Jewellery Design", link: "#" }
                  ]
                }
              ]} 
              illustration="https://img.freepik.com/free-vector/creative-team-working-project_74855-4813.jpg"
            />
        </div>
      </div>
    </>
  );
};

export default DesignPage;
