import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import OtherProducts from './components/OtherProducts';
import Section from './components/Section';
import Footer from './components/Footer';
import { featuredColleges, examCategories } from './data';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <Hero />
      <NewsSection />
      
      <div className="container mx-auto px-4 py-12 flex-grow space-y-16">
        <Section 
          title="Explore by Category" 
          items={examCategories} 
          type="category" 
        />
        
        <Section 
          title="Featured Colleges" 
          items={featuredColleges} 
          type="card" 
        />
      </div>
      
      <OtherProducts />
      
      <Footer />
    </div>
  )
}

export default App
