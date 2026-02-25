// ──────────────────────────────────────────────────────────
// Mega Menu Data — extracted from reference navigation HTML
// ──────────────────────────────────────────────────────────

export interface MegaMenuLink {
  label: string;
  href: string;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isViewAll?: boolean;
  comingSoon?: boolean;
}

export interface MegaMenuColumn {
  links: MegaMenuLink[];
}

export interface MegaMenuSubCategory {
  title: string;
  directLink?: string;
  columns: MegaMenuColumn[];
}

export interface MegaMenuItem {
  title: string;
  subcategories: MegaMenuSubCategory[];
}

// Helper: marks a link as coming soon (page doesn't exist yet)
const cs = (label: string, href: string = '/coming-soon'): MegaMenuLink => ({
  label,
  href,
  comingSoon: true,
});

const hdr = (label: string): MegaMenuLink => ({
  label,
  href: '#',
  isHeader: true,
});

const subHdr = (label: string): MegaMenuLink => ({
  label,
  href: '#',
  isSubHeader: true,
});

const viewAll = (label: string, href: string, comingSoon = true): MegaMenuLink => ({
  label,
  href: comingSoon ? '/coming-soon' : href,
  isViewAll: true,
  comingSoon,
});

// ════════════════════════════════════════════════════════════
//  1. MBA
// ════════════════════════════════════════════════════════════
const mbaMenu: MegaMenuItem = {
  title: 'MBA',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top MBA Colleges in India', href: '/streams/management' },
            { label: 'Top Private MBA Colleges in India', href: '/tools/colleges?stream=Management&ownership=Private' },
            { label: 'Top MBA Colleges in Bangalore', href: '/tools/colleges?search=MBA&city=Bangalore' },
            { label: 'Top MBA Colleges in Mumbai', href: '/tools/colleges?search=MBA&city=Mumbai' },
            { label: 'Top MBA Colleges in Pune', href: '/tools/colleges?search=MBA&city=Pune' },
            { label: 'Top MBA Colleges in Hyderabad', href: '/tools/colleges?search=MBA&city=Hyderabad' },
            { label: 'Top MBA Colleges in Delhi', href: '/tools/colleges?search=MBA&city=Delhi' },
            { label: 'Top MBA Colleges in Chennai', href: '/tools/colleges?search=MBA&city=Chennai' },
            { label: 'Top MBA Colleges in Maharashtra', href: '/tools/colleges?search=MBA&state=Maharashtra' },
            { label: 'Top MBA Colleges in Kolkata', href: '/tools/colleges?search=MBA&city=Kolkata' },
            { label: 'Top MBA Colleges in Kerala', href: '/tools/colleges?search=MBA&state=Kerala' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('MBA/PGDM'),
            cs('Executive MBA'),
            cs('Distance MBA'),
            cs('Online MBA'),
            cs('Part-Time MBA'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('MBA in Finance'),
            cs('MBA in Healthcare Management'),
            cs('MBA in HR'),
            cs('MBA in IT'),
            cs('MBA in Operations Management'),
            cs('MBA in Marketing'),
            cs('MBA in International Business'),
            cs('MBA in Pharmaceutical Management'),
            cs('MBA in Digital Marketing'),
            cs('MBA in Data Analytics'),
          ],
        },
        {
          links: [
            cs('MBA in Entrepreneurship'),
            cs('MBA in Family Managed Business'),
            cs('MBA in Agriculture'),
            cs('MBA in Product Management'),
            cs('MBA in General Management'),
            cs('MBA in Data Science'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('CAT'),
            cs('CMAT'),
            cs('SNAP'),
            cs('XAT'),
            cs('MAT'),
            cs('ATMA'),
            cs('NMAT by GMAC'),
            cs('IBSAT'),
            cs('KIITEE Management'),
            cs('UPCET'),
            viewAll('All MBA Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'MBA Colleges in India', href: '/tools/colleges?stream=Management' },
            { label: 'MBA Colleges in Bangalore', href: '/tools/colleges?stream=Management&city=Bangalore' },
            { label: 'MBA Colleges in Chennai', href: '/tools/colleges?stream=Management&city=Chennai' },
            { label: 'MBA Colleges in Delhi-NCR', href: '/tools/colleges?stream=Management&city=Delhi' },
            { label: 'MBA Colleges in Hyderabad', href: '/tools/colleges?stream=Management&city=Hyderabad' },
            { label: 'MBA Colleges in Kolkata', href: '/tools/colleges?stream=Management&city=Kolkata' },
            { label: 'MBA Colleges in Mumbai', href: '/tools/colleges?stream=Management&city=Mumbai' },
            { label: 'MBA Colleges in Pune', href: '/tools/colleges?stream=Management&city=Pune' },
            { label: 'All Locations →', href: '/tools/colleges?stream=Management', isViewAll: true },
          ],
        },
      ],
    },
    {
      title: 'Compare Colleges',
      columns: [
        {
          links: [
            hdr('Popular Comparisons'),
            cs('IIM Ahmedabad Vs IIM Bangalore'),
            cs('IIM Ahmedabad Vs IIM Calcutta'),
            cs('SIBM Pune Vs SCMHRD Pune'),
            cs('SP Jain (SPJIMR) Vs MDI Gurgaon'),
            cs('NMIMS SBM Mumbai Vs SP Jain (SPJIMR)'),
            viewAll('Compare other MBA colleges →', '/tools/compare-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'College Reviews',
      columns: [
        {
          links: [
            cs('IIM Ahmedabad Reviews'),
            cs('IIM Bangalore Reviews'),
            cs('IIM Calcutta Reviews'),
            cs('IIM Lucknow Reviews'),
            cs('IIM Kozhikode Reviews'),
            cs('IIM Indore Reviews'),
            cs('FMS Delhi Reviews'),
            cs('SP Jain Reviews'),
            cs('MDI Gurgaon Reviews'),
          ],
        },
      ],
    },
    {
      title: 'CAT Percentile Predictor',
      directLink: '/coming-soon',
      columns: [],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('IIM & Non IIM Call Predictor'),
            { label: 'CAT College Predictor', href: '/predictors/cat-predictor', comingSoon: false },
            cs('MAH CET College Predictor'),
            cs('XAT College/ Call Predictor'),
            cs('IIFT College Predictor'),
            cs('NMAT College Predictor'),
            cs('SNAP College and Call Predictor'),
            cs('CMAT College Predictor'),
            viewAll('MBA College Predictor →', '/predictors', false),
          ],
        },
        {
          links: [
            cs('MAT College Predictor'),
            cs('KMAT College Predictor'),
            cs('TANCET MBA College Predictor'),
            cs('TSICET College Predictor'),
            cs('IBSAT College Predictor'),
            cs('UPCET College Predictor'),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('MBA Alumni Salary Data'),
            cs('Ask a Question'),
            cs('Discussions'),
            cs('MBA News'),
            cs('MBA Articles'),
            cs('Apply to colleges'),
            cs('Trends in MBA'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  2. ENGINEERING
// ════════════════════════════════════════════════════════════
const engineeringMenu: MegaMenuItem = {
  title: 'Engineering',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Engineering Colleges in India', href: '/streams/engineering' },
            { label: 'Top Private Engineering Colleges in India', href: '/tools/colleges?stream=Engineering&ownership=Private' },
            { label: 'Top IITs in India', href: '/tools/colleges?search=Indian+Institute+of+Technology' },
            { label: 'Top NITs in India', href: '/tools/colleges?search=National+Institute+of+Technology' },
            { label: 'Top Engineering Colleges in Bangalore', href: '/tools/colleges?search=Engineering&city=Bangalore' },
            { label: 'Top Engineering Colleges in Karnataka', href: '/tools/colleges?search=Engineering&state=Karnataka' },
            { label: 'Top Engineering Colleges in Hyderabad', href: '/tools/colleges?search=Engineering&city=Hyderabad' },
            { label: 'Top Engineering Colleges in Pune', href: '/tools/colleges?search=Engineering&city=Pune' },
            { label: 'Top Engineering Colleges in Mumbai', href: '/tools/colleges?search=Engineering&city=Mumbai' },
            { label: 'Top Engineering Colleges in Maharashtra', href: '/tools/colleges?search=Engineering&state=Maharashtra' },
            { label: 'Top Engineering Colleges in Chennai', href: '/tools/colleges?search=Engineering&city=Chennai' },
            { label: 'Top Engineering Colleges in Kerala', href: '/tools/colleges?search=Engineering&state=Kerala' },
            { label: 'Top Engineering Colleges in Delhi', href: '/tools/colleges?search=Engineering&city=Delhi' },
            { label: 'Top Engineering Colleges in Telangana', href: '/tools/colleges?search=Engineering&state=Telangana' },
            { label: 'Top Engineering Colleges in Gujarat', href: '/tools/colleges?search=Engineering&state=Gujarat' },
            { label: 'Top Engineering Colleges in West Bengal', href: '/tools/colleges?search=Engineering&state=West+Bengal' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('B.E/B.Tech'),
            cs('M.E/M.Tech'),
            cs('Ph.D.'),
            cs('Diploma Courses'),
            cs('Distance Diploma Courses'),
            cs('Distance B.Tech'),
            viewAll('All Engineering Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Computer Science Engineering'),
            cs('Mechanical Engineering'),
            cs('Civil Engineering'),
            cs('Electronics & Communication Engineering'),
            cs('Aeronautical Engineering'),
            cs('Aerospace Engineering'),
            cs('Information Technology'),
            cs('Electrical Engineering'),
            cs('Electronics Engineering'),
            cs('Nanotechnology'),
            cs('Chemical Engineering'),
            cs('Automobile Engineering'),
            cs('Biomedical Engineering'),
            cs('Construction Engineering'),
            cs('Pulp & Paper Technology'),
          ],
        },
        {
          links: [
            cs('Marine Engineering'),
            cs('Genetic Engineering'),
            cs('Food Technology'),
            cs('Petroleum Engineering'),
            cs('Control Systems'),
            cs('Industrial Engineering'),
            cs('Production Engineering'),
            cs('Environmental Engineering'),
            cs('Robotics Engineering'),
            cs('Telecommunication Engineering'),
            cs('Materials Science'),
            cs('Structural Engineering'),
            cs('Aircraft Maintenance'),
            cs('RF & Microwave Engineering'),
          ],
        },
        {
          links: [
            cs('VLSI Design'),
            cs('Mechatronics Engineering'),
            cs('Mining Engineering'),
            cs('Biotechnology Engineering'),
            cs('Transportation Engineering'),
            cs('Metallurgical Engineering'),
            cs('Textile Engineering'),
            cs('Naval Architecture'),
            cs('Power Engineering'),
            cs('Dairy Technology'),
            cs('Microelectronics'),
            cs('Communications Engineering'),
            cs('Tool Engineering'),
            cs('Ceramic Engineering'),
            cs('Jute & Fiber Technology'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('JEE Main'),
            cs('COMEDK'),
            cs('BITSAT'),
            cs('WBJEE'),
            cs('JEE Advanced'),
            cs('GATE'),
            cs('LPU-NEST'),
            cs('JET'),
            cs('CUCET Chandigarh University'),
            cs('CGCUET'),
            viewAll('All Engineering Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Engineering Colleges in India', href: '/tools/colleges?stream=Engineering' },
            { label: 'Engineering Colleges in Bangalore', href: '/tools/colleges?stream=Engineering&city=Bangalore' },
            { label: 'Engineering Colleges in Chennai', href: '/tools/colleges?stream=Engineering&city=Chennai' },
            { label: 'Engineering Colleges in Delhi-NCR', href: '/tools/colleges?stream=Engineering&city=Delhi' },
            { label: 'Engineering Colleges in Kolkata', href: '/tools/colleges?stream=Engineering&city=Kolkata' },
            { label: 'Engineering Colleges in Mumbai', href: '/tools/colleges?stream=Engineering&city=Mumbai' },
            { label: 'Engineering Colleges in Pune', href: '/tools/colleges?stream=Engineering&city=Pune' },
            { label: 'Engineering Colleges in Hyderabad', href: '/tools/colleges?stream=Engineering&city=Hyderabad' },
            { label: 'All Locations →', href: '/tools/colleges?stream=Engineering', isViewAll: true },
          ],
        },
      ],
    },
    {
      title: 'Compare Colleges',
      columns: [
        {
          links: [
            hdr('Popular Comparisons'),
            cs('IIT Madras Vs IIT Kanpur'),
            cs('VNIT Nagpur Vs NIT Rourkela'),
            cs('Alliance University Vs Christ University'),
            cs('IIT Bombay Vs IIT Delhi'),
            cs('BITS Pilani Vs DTU Delhi'),
            viewAll('Compare other colleges →', '/tools/compare-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'Rank Predictors',
      columns: [
        {
          links: [
            { label: 'COMEDK UGET Rank Predictor', href: '/coming-soon', comingSoon: true },
            { label: 'JEE Advanced Rank Predictor', href: '/predictors/rank-predictor', comingSoon: false },
            { label: 'JEE MAIN Rank Predictor', href: '/predictors/rank-predictor', comingSoon: false },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('CG PET College Predictor'),
            cs('COMEDK UGET College Predictor'),
            { label: 'JEE MAIN College Predictor', href: '/predictors/jee-main-predictor', comingSoon: false },
            { label: 'JEE Advanced College Predictor', href: '/predictors/predict-colleges', comingSoon: false },
            cs('KCET College Predictor'),
            cs('KEAM College Predictor'),
            cs('MHT CET College Predictor'),
            cs('MP BE College Predictor'),
            cs('PTU BTech College Predictor'),
            cs('JAC Chandigarh College Predictor'),
            { label: 'GATE College Predictor', href: '/predictors/gate-predictor', comingSoon: false },
            viewAll('Engineering College Predictor →', '/predictors', false),
          ],
        },
        {
          links: [
            cs('TNEA College Predictor'),
            cs('WBJEE College Predictor'),
            cs('AP EAMCET College Predictor'),
            cs('TS EAMCET College Predictor'),
            { label: 'BITSAT College Predictor', href: '/predictors/bitsat-predictor', comingSoon: false },
            cs('IPU CET College Predictor'),
            cs('OJEE College Predictor'),
            cs('GUJCET College Predictor'),
            { label: 'VITEEE College Predictor', href: '/predictors/viteee-predictor', comingSoon: false },
            cs('SRMJEEE College Predictor'),
            cs('JAC Delhi College Predictor'),
          ],
        },
      ],
    },
    {
      title: 'College Reviews',
      columns: [
        {
          links: [
            cs('IIT Bombay Reviews'),
            cs('IIT Delhi Reviews'),
            cs('IIT Kanpur Reviews'),
            cs('IIIT Hyderabad Reviews'),
            cs('IIT Kharagpur Reviews'),
            cs('NIT Trichy Reviews'),
            cs('NIT Warangal Reviews'),
            cs('IIT Madras Reviews'),
            cs('BITS Pilani Reviews'),
            cs('IIT Hyderabad Reviews'),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Engineering News'),
            cs('Engineering Articles'),
            cs('Apply to colleges'),
            cs('Trends in BTech'),
            cs('Trends in Engineering'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  3. MEDICAL
// ════════════════════════════════════════════════════════════
const medicalMenu: MegaMenuItem = {
  title: 'Medical',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Medical Colleges in India', href: '/streams/medicine' },
            { label: 'Top Medical Colleges in Karnataka', href: '/tools/colleges?search=Medical&state=Karnataka' },
            { label: 'Top Pharmacy Colleges in India', href: '/streams/pharmacy' },
            { label: 'Top Medical Colleges in Bangalore', href: '/tools/colleges?search=Medical&city=Bangalore' },
            { label: 'Top Dental Colleges in India', href: '/tools/colleges?search=Dental' },
            { label: 'Top Medical Colleges in Maharashtra', href: '/tools/colleges?search=Medical&state=Maharashtra' },
            { label: 'Top Medical Colleges in Mumbai', href: '/tools/colleges?search=Medical&city=Mumbai' },
            { label: 'Top Medical Colleges in Delhi', href: '/tools/colleges?search=Medical&city=Delhi' },
            { label: 'Top Pharmacy Colleges in Maharashtra', href: '/tools/colleges?search=Pharmacy&state=Maharashtra' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('MBBS'),
            cs('MD'),
            cs('BMLT'),
            cs('MPT'),
            cs('MPH'),
            viewAll('All Medical Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Alternative Medicine'),
            cs('Dental'),
            cs('Dietetics & Nutrition'),
            cs('Medicine'),
            cs('Paramedical'),
            cs('Pharmacy'),
            cs('Physiotherapy'),
            cs('Public Health & Management'),
            viewAll('All Medical Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            cs('Clinical Psychology'),
            cs('Clinical Research'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            cs('NEET UG'),
            cs('NEET PG'),
            cs('NEET SS'),
            cs('NEET MDS'),
            cs('INI CET'),
            cs('FMGE'),
            cs('AIAPGET'),
            viewAll('All Medicine Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Medical Colleges in India', href: '/tools/colleges?stream=Medicine' },
            { label: 'Medical Colleges in Delhi', href: '/tools/colleges?stream=Medicine&city=Delhi' },
            { label: 'Medical Colleges in Bangalore', href: '/tools/colleges?stream=Medicine&city=Bangalore' },
            { label: 'Medical Colleges in Chennai', href: '/tools/colleges?stream=Medicine&city=Chennai' },
            { label: 'Medical Colleges in Hyderabad', href: '/tools/colleges?stream=Medicine&city=Hyderabad' },
            { label: 'Medical Colleges in Mumbai', href: '/tools/colleges?stream=Medicine&city=Mumbai' },
            { label: 'Medical Colleges in Kolkata', href: '/tools/colleges?stream=Medicine&city=Kolkata' },
            { label: 'Medical Colleges in Pune', href: '/tools/colleges?stream=Medicine&city=Pune' },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            { label: 'NEET College Predictor', href: '/predictors/neet-predictor', comingSoon: false },
            { label: 'AIIMS INI-CET Predictor', href: '/predictors/aiims-predictor', comingSoon: false },
            cs('NEET PG College Predictor'),
            viewAll('Medicine College Predictor →', '/predictors', false),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Medical News'),
            cs('Medical Articles'),
            cs('Trends in Medicine & Health Sciences'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  4. DESIGN
// ════════════════════════════════════════════════════════════
const designMenu: MegaMenuItem = {
  title: 'Design',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Fashion Designing Colleges in India', href: '/streams/design' },
            { label: 'Top Fashion Designing Colleges in Bangalore', href: '/tools/colleges?search=Design&city=Bangalore' },
            { label: 'Top Fashion Designing Colleges in Delhi/NCR', href: '/tools/colleges?search=Design&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Fashion Designing'),
            cs('Interior Design'),
            cs('Graphic Design'),
            cs('Jewellery Design'),
            cs('Web Design'),
            cs('Furniture Design'),
            cs('Game Design'),
            cs('Product Design'),
            cs('Textile Design'),
            cs('Visual Merchandising'),
            cs('Ceramic & Glass Design'),
            cs('Film & Video Design'),
          ],
        },
        {
          links: [
            cs('UI / UX'),
            cs('Footwear Design'),
            cs('Automotive Design'),
            cs('Communication Design'),
            cs('Apparel Design'),
            cs('Exhibition Design'),
            cs('Information Design'),
            cs('Knitwear Design'),
            cs('Leather Design'),
            cs('Toy Design'),
            cs('Lifestyle Accessory Design'),
            viewAll('All Design Specializations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('B.Des'),
            cs('M.Des'),
            cs('B.Des in Fashion Design'),
            cs('B.Des in Interior Design'),
            cs('B.Sc in Fashion Design'),
            cs('B.Sc in Interior Design'),
            viewAll('All Design Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('WUD Aptitude Test'),
            cs('Pearl Academy Entrance Exam'),
            cs('CEED'),
            cs('NID Entrance Exam'),
            cs('NIFT Entrance Exam'),
            cs('UCEED'),
            viewAll('All Design Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('NID College Predictor'),
            cs('NIFT College Predictor'),
            viewAll('Design College Predictor →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Design Colleges in India', href: '/tools/colleges?stream=Design' },
            { label: 'Design Colleges in Maharashtra', href: '/tools/colleges?stream=Design&state=Maharashtra' },
            { label: 'Design Colleges in Delhi', href: '/tools/colleges?stream=Design&city=Delhi' },
            { label: 'Design Colleges in Karnataka', href: '/tools/colleges?stream=Design&state=Karnataka' },
            { label: 'Design Colleges in Punjab', href: '/tools/colleges?stream=Design&state=Punjab' },
            { label: 'Design Colleges in Telangana', href: '/tools/colleges?stream=Design&state=Telangana' },
            { label: 'Design Colleges in Gujarat', href: '/tools/colleges?stream=Design&state=Gujarat' },
            { label: 'Design Colleges in Chandigarh', href: '/tools/colleges?stream=Design&state=Chandigarh' },
            { label: 'Design Colleges in Rajasthan', href: '/tools/colleges?stream=Design&state=Rajasthan' },
            { label: 'Design Colleges in Madhya Pradesh', href: '/tools/colleges?stream=Design&state=Madhya+Pradesh' },
            { label: 'Design Colleges in Uttar Pradesh', href: '/tools/colleges?stream=Design&state=Uttar+Pradesh' },
            { label: 'Design Colleges in Tamil Nadu', href: '/tools/colleges?stream=Design&state=Tamil+Nadu' },
          ],
        },
        {
          links: [
            { label: 'Design Colleges in Pune', href: '/tools/colleges?stream=Design&city=Pune' },
            { label: 'Design Colleges in Mumbai', href: '/tools/colleges?stream=Design&city=Mumbai' },
            { label: 'Design Colleges in Bangalore', href: '/tools/colleges?stream=Design&city=Bangalore' },
            { label: 'Design Colleges in Hyderabad', href: '/tools/colleges?stream=Design&city=Hyderabad' },
            { label: 'Design Colleges in Ahmedabad', href: '/tools/colleges?stream=Design&city=Ahmedabad' },
            { label: 'Design Colleges in Ludhiana', href: '/tools/colleges?stream=Design&city=Ludhiana' },
            { label: 'Design Colleges in Jalandhar', href: '/tools/colleges?stream=Design&city=Jalandhar' },
            { label: 'Design Colleges in Jaipur', href: '/tools/colleges?stream=Design&city=Jaipur' },
            { label: 'Design Colleges in Indore', href: '/tools/colleges?stream=Design&city=Indore' },
            { label: 'Design Colleges in Gurgaon', href: '/tools/colleges?stream=Design&city=Gurgaon' },
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Design News'),
            cs('Design Articles'),
            cs('Trends in Design'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  5. MORE
// ════════════════════════════════════════════════════════════
const moreMenu: MegaMenuItem = {
  title: 'More',
  subcategories: [
    {
      title: 'Sarkari Exams',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Banking'),
            cs('IBPS Clerk'),
            cs('IBPS PO'),
            cs('SBI Clerk'),
            cs('SBI PO'),
            cs('IBPS RRB'),
            viewAll('All Banking Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Teaching'),
            cs('CTET'),
            cs('UPTET'),
            cs('UGC NET'),
            cs('CSIR NET'),
            cs('APSET'),
            viewAll('All Teaching Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('SSC'),
            cs('SSC CGL'),
            cs('SSC JE'),
            cs('SSC CHSL'),
            cs('SSC GD'),
            cs('SSC JHT'),
            viewAll('All SSC Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Defence'),
            cs('NDA'),
            cs('AFCAT'),
            cs('CDS'),
            cs('DRDO CEPTAM'),
            cs('RPF SI'),
            viewAll('All Defence Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Railway'),
            cs('RRB Group D'),
            cs('RRB NTPC'),
            cs('RRB JE'),
            cs('RPF Constable'),
            viewAll('All Railway Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('All Exams'),
            cs('All UPSC Exams'),
            cs('All State PSC Exams'),
            cs('All Scholarship Exams'),
            cs('All PSU Exams'),
            cs('All State Exams'),
            cs('All Insurance Exams'),
            cs('All Police Exams'),
            cs('All Sarkari Exams'),
          ],
        },
      ],
    },
    {
      title: 'Law',
      directLink: '/streams/law',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Law Colleges in India', href: '/tools/colleges?stream=Law' },
            { label: 'Top Law Colleges in Bangalore', href: '/tools/colleges?stream=Law&city=Bangalore' },
            { label: 'Top Law Colleges in Delhi', href: '/tools/colleges?stream=Law&city=Delhi' },
            { label: 'Top Law Colleges in Pune', href: '/tools/colleges?stream=Law&city=Pune' },
            { label: 'Top Law Colleges in Hyderabad', href: '/tools/colleges?stream=Law&city=Hyderabad' },
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.A. LL.B.'),
            cs('BBA LL.B.'),
            cs('LL.B.'),
            cs('LL.M.'),
            cs('B.Sc. LL.B'),
            cs('B.Com LL.B'),
            cs('B.L.S. LL.B.'),
            viewAll('All Law Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Company Law'),
            cs('Business Law'),
            cs('Cyber Law'),
            cs('Corporate Law'),
            cs('Criminal Law'),
            cs('Administrative Law'),
            cs('Family Law'),
            cs('Constitutional Law'),
            cs('Environmental Law'),
            cs('Intellectual Property Law'),
            cs('Banking Law'),
            cs('Competition Law'),
            cs('Commercial Law'),
            cs('Immigration Law'),
            cs('Tax Law'),
            cs('Insurance Law'),
            cs('Energy Law'),
            cs('International Trade Law'),
            cs('Consumer Law'),
            cs('Arbitration Law'),
            cs('Real Estate / Infrastructure Law'),
            cs('Information Technology Law'),
            cs('Healthcare Law'),
            cs('Labor & Employment Law'),
            cs('Air & Space Law'),
            cs('Nuclear Law'),
            cs('Human Rights & International Humanitarian Law'),
            cs('Security & Investment Law'),
            cs('Entertainment & Media Law'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CLAT'),
            cs('LSAT India'),
            cs('AILET'),
            cs('AIBE'),
            cs('DU LLB Exam'),
            cs('AMU Law Entrance Exam'),
            cs('ACLAT'),
            viewAll('All Law Exams →', '/coming-soon'),
            subHdr('College Predictors'),
            { label: 'CLAT College Predictor', href: '/predictors/clat-predictor', comingSoon: false },
            { label: 'CLAT Rank Predictor', href: '/predictors/rank-predictor?exam=CLAT', comingSoon: false },
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            { label: 'Law Colleges in India', href: '/tools/colleges?stream=Law' },
            { label: 'Law Colleges in Punjab', href: '/tools/colleges?stream=Law&state=Punjab' },
            { label: 'Law Colleges in Delhi', href: '/tools/colleges?stream=Law&city=Delhi' },
            { label: 'Law Colleges in Chandigarh', href: '/tools/colleges?stream=Law&state=Chandigarh' },
            { label: 'Law Colleges in Maharashtra', href: '/tools/colleges?stream=Law&state=Maharashtra' },
            { label: 'Law Colleges in Orissa', href: '/tools/colleges?stream=Law&state=Odisha' },
            { label: 'Law Colleges in Uttarakhand', href: '/tools/colleges?stream=Law&state=Uttarakhand' },
            { label: 'Law Colleges in West Bengal', href: '/tools/colleges?stream=Law&state=West+Bengal' },
            { label: 'Law Colleges in Karnataka', href: '/tools/colleges?stream=Law&state=Karnataka' },
            { label: 'Law Colleges in Ludhiana', href: '/tools/colleges?stream=Law&city=Ludhiana' },
            { label: 'Law Colleges in Pune', href: '/tools/colleges?stream=Law&city=Pune' },
            { label: 'Law Colleges in Jalandhar', href: '/tools/colleges?stream=Law&city=Jalandhar' },
            { label: 'Law Colleges in Bhubaneswar', href: '/tools/colleges?stream=Law&city=Bhubaneswar' },
            { label: 'Law Colleges in Roorkee', href: '/tools/colleges?stream=Law&city=Roorkee' },
            { label: 'Law Colleges in Kolkata', href: '/tools/colleges?stream=Law&city=Kolkata' },
            { label: 'Law Colleges in Udupi', href: '/tools/colleges?stream=Law&city=Udupi' },
          ],
        },
      ],
    },
    {
      title: 'Hospitality & Travel',
      directLink: '/streams/hospitality',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BHM'),
            cs('Diploma in Hotel Management'),
            cs('B.Sc. In Hotel Management'),
            viewAll('All Hospitality Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Hotel Management Colleges in India', href: '/tools/colleges?stream=Hospitality' },
            { label: 'Top Hotel Management Colleges in Hyderabad', href: '/tools/colleges?stream=Hospitality&city=Hyderabad' },
            { label: 'Top Hotel Management Colleges in Delhi', href: '/tools/colleges?stream=Hospitality&city=Delhi' },
            { label: 'Top Hotel Management Colleges in Mumbai', href: '/tools/colleges?stream=Hospitality&city=Mumbai' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Catering'),
            cs('Culinary Arts'),
            cs('Event Management'),
            cs('Fares & Ticketing'),
            cs('Hotel / Hospitality Management'),
            cs('CBS'),
            cs('Travel & Tourism'),
            cs('Corporate Banking'),
            cs('Health Insurance'),
            cs('Investment Banking'),
            cs('Capital Markets'),
            viewAll('All Hospitality Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIHM eCHAT'),
            cs('NCHMCT JEE'),
            viewAll('All Hospitality Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            { label: 'Culinary Arts colleges in India', href: '/tools/colleges?stream=Hospitality' },
            { label: 'Travel & Tourism colleges in India', href: '/tools/colleges?stream=Hospitality' },
            { label: 'Event Management colleges in India', href: '/tools/colleges?stream=Hospitality' },
          ],
        },
      ],
    },
    {
      title: 'Animation',
      directLink: '/tools/colleges?search=Animation',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc. in Animation'),
            cs('M.Sc. in Animation'),
            cs('Diploma in Web/Graphic Design'),
            cs('Diploma in VFX'),
            cs('Diploma in Animation'),
            cs('B.Des Animation'),
            viewAll('All Animation Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Animation Colleges in India', href: '/tools/colleges?search=Animation' },
            { label: 'Top Animation Colleges in Bangalore', href: '/tools/colleges?search=Animation&city=Bangalore' },
            { label: 'Top Animation Colleges in Delhi', href: '/tools/colleges?search=Animation&city=Delhi' },
            { label: 'Top Animation Colleges in Kolkata', href: '/tools/colleges?search=Animation&city=Kolkata' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('2D Animation'),
            cs('3D Animation'),
            cs('Animation Film Making'),
            cs('Animation Film Design'),
            cs('Digital Film Making'),
            cs('Game Design'),
            cs('Game Development'),
            cs('Graphic Designing'),
            cs('Graphic / Web Design'),
            cs('Motion Graphics'),
            cs('Sound & Video Editing'),
            cs('Stop Motion Animation'),
            cs('Visual Effects'),
            cs('VFX'),
            viewAll('All Animation Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('UCEED'),
            cs('NID DAT'),
            cs('NIFT Entrance Exam'),
            viewAll('All Animation Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Mass Communication & Media',
      directLink: '/streams/media',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.J.'),
            cs('B.J.M.C.'),
            cs('B.M.M.'),
            cs('M.A.'),
            cs('Diploma in Journalism'),
            cs('B.A. in Mass Communication'),
            viewAll('All Mass Communication Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Mass Communication Colleges in India', href: '/tools/colleges?stream=Media' },
            { label: 'Top Mass Communication Colleges in Delhi', href: '/tools/colleges?stream=Media&city=Delhi' },
            { label: 'Top Mass Communication Colleges in Mumbai', href: '/tools/colleges?stream=Media&city=Mumbai' },
            { label: 'Top Mass Communication Colleges in Kolkata', href: '/tools/colleges?stream=Media&city=Kolkata' },
            { label: 'Top Mass Communication Colleges in Bangalore', href: '/tools/colleges?stream=Media&city=Bangalore' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Advertising'),
            cs('Animation'),
            cs('Broadcasting'),
            cs('Communication'),
            cs('Corporate Communication'),
            cs('Digital Marketing'),
            cs('Event Management'),
            cs('Film & TV'),
            cs('Graphics & Multimedia'),
            cs('Journalism'),
            cs('Mass Communication'),
            cs('News Anchoring'),
            cs('Print & Electronic Media'),
            cs('Public Relations'),
            cs('Radio'),
            cs('Sports Journalism'),
            cs('Video Production'),
            viewAll('All Mass Communication Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIMC Entrance Exam'),
            cs('IPU CET'),
            cs('JNUEE'),
            cs('DUET'),
            viewAll('All Mass Communication Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Business & Management Studies',
      directLink: '/streams/management',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BBA'),
            cs('Management Certifications'),
            cs('MBA/PGDM'),
            cs('Executive MBA/PGDM'),
            cs('Distance MBA'),
            cs('Online MBA'),
            cs('Part-Time MBA'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top BBA Colleges in India', href: '/tools/colleges?stream=Management&search=BBA' },
            { label: 'Top BBA Colleges in Delhi', href: '/tools/colleges?stream=Management&search=BBA&city=Delhi' },
            { label: 'Top BBA Colleges in Bangalore', href: '/tools/colleges?stream=Management&search=BBA&city=Bangalore' },
            { label: 'Top BBA Colleges in Hyderabad', href: '/tools/colleges?stream=Management&search=BBA&city=Hyderabad' },
            { label: 'Top BBA Colleges in Pune', href: '/tools/colleges?stream=Management&search=BBA&city=Pune' },
            { label: 'Top BBA Colleges in Kolkata', href: '/tools/colleges?stream=Management&search=BBA&city=Kolkata' },
            { label: 'Top BBA Colleges in Mumbai', href: '/tools/colleges?stream=Management&search=BBA&city=Mumbai' },
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('SET Exam'),
            cs('NPAT'),
            cs('SUAT BBA'),
            cs('DU JAT'),
            viewAll('All Management Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'IT & Software',
      directLink: '/tools/colleges?stream=Computer+Application',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BCA'),
            cs('B.Sc. in IT & Software'),
            cs('Distance BCA'),
            cs('MCA'),
            cs('M.Sc. in IT & Software'),
            cs('Part-Time MCA'),
            cs('Distance MCA'),
            cs('CCNA'),
            viewAll('All IT & Software Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top BCA Colleges in India', href: '/tools/colleges?stream=Computer+Application' },
            { label: 'Top BCA Colleges in Delhi', href: '/tools/colleges?stream=Computer+Application&city=Delhi' },
            { label: 'Top BCA Colleges in Bangalore', href: '/tools/colleges?stream=Computer+Application&city=Bangalore' },
            { label: 'Top BCA Colleges in Mumbai', href: '/tools/colleges?stream=Computer+Application&city=Mumbai' },
            { label: 'Top BCA Colleges in Pune', href: '/tools/colleges?stream=Computer+Application&city=Pune' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Artificial Intelligence'),
            cs('Cloud Computing'),
            cs('Cyber Security'),
            cs('Data Analytics'),
            cs('Data Science'),
            cs('Database Management'),
            cs('Information Security'),
            cs('Information Technology'),
            cs('Machine Learning'),
            cs('Mobile Application Development'),
            cs('Network & Security'),
            cs('Programming'),
            cs('Software Development'),
            cs('Software Engineering'),
            cs('Web Designing'),
            cs('Web Development'),
            viewAll('All IT Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('NIMCET'),
            cs('MAH MCA CET'),
            cs('WBJEE JECA'),
            cs('IPU CET'),
            viewAll('All IT & Software Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Humanities & Social Sciences',
      directLink: '/streams/arts',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.A.'),
            cs('B.Sc. in Humanities & Social Sciences'),
            cs('B.S.W.'),
            cs('M.A.'),
            cs('M.Phil.'),
            cs('M.Sc. in Humanities & Social Sciences'),
            cs('MSW'),
            viewAll('All Humanities Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Anthropology'),
            cs('Archaeology'),
            cs('Communication Studies'),
            cs('Economics'),
            cs('Geography'),
            cs('History'),
            cs('Languages'),
            cs('Library & Information Science'),
            cs('Linguistics'),
            cs('Literature'),
            cs('Philosophy'),
            cs('Political Science'),
            cs('Psychology'),
            cs('Religious Studies'),
            cs('Rural Studies'),
            cs('Social Work'),
            cs('Sociology'),
            viewAll('All Humanities Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('JNUEE'),
            cs('DUET (CUET)'),
            cs('PUBDET'),
          ],
        },
      ],
    },
    {
      title: 'Arts (Fine/Visual/Performing)',
      directLink: '/tools/colleges?stream=Arts',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BFA'),
            cs('MFA'),
            viewAll('All Arts Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Arts Colleges in India', href: '/tools/colleges?stream=Arts' },
            { label: 'Top Arts Colleges in Chennai', href: '/tools/colleges?stream=Arts&city=Chennai' },
            { label: 'Top Arts Colleges in Mumbai', href: '/tools/colleges?stream=Arts&city=Mumbai' },
            { label: 'Top Colleges in Delhi for Arts', href: '/tools/colleges?stream=Arts&city=Delhi' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Applied Arts'),
            cs('Art History & Aesthetics'),
            cs('Ceramics'),
            cs('Dance & Choreography'),
            cs('Decorative Arts'),
            cs('Film Making'),
            cs('Graphics Art'),
            cs('Muralist'),
            cs('Music'),
            cs('Painting & Drawing'),
            cs('Photography'),
            cs('Sculpture'),
            cs('Theatre'),
            viewAll('All Arts Specializations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Science',
      directLink: '/streams/science',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc.'),
            cs('M.Sc.'),
            cs('Distance B.Sc.'),
            cs('Distance M.Sc.'),
            viewAll('All Science Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Science Colleges in Mumbai', href: '/tools/colleges?stream=Science&city=Mumbai' },
            { label: 'Top Science Colleges in India', href: '/tools/colleges?stream=Science' },
            { label: 'Top Science Colleges in Pune', href: '/tools/colleges?stream=Science&city=Pune' },
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('MCAER CET'),
            cs('CUET UG'),
            cs('CUET PG'),
            cs('NEST'),
            cs('IIT JAM'),
            cs('JEST'),
            viewAll('All Science Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Architecture & Planning',
      directLink: '/tools/colleges?stream=Architecture',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Arch.'),
            cs('M.Arch.'),
            cs('M.Plan'),
            cs('B.Plan'),
            cs('Diploma in Architecture'),
            viewAll('All Architecture Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Architecture Colleges in India', href: '/tools/colleges?stream=Architecture' },
            { label: 'Top Architecture Colleges in Bangalore', href: '/tools/colleges?stream=Architecture&city=Bangalore' },
            { label: 'Top Architecture Colleges in Mumbai', href: '/tools/colleges?stream=Architecture&city=Mumbai' },
            { label: 'Top Architecture Colleges in Delhi', href: '/tools/colleges?stream=Architecture&city=Delhi' },
            { label: 'Top Architecture Colleges in Chennai', href: '/tools/colleges?stream=Architecture&city=Chennai' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Architectural Engineering'),
            cs('Building Construction & Materials'),
            cs('Building Economics and Estimation'),
            cs('Computer Aided Design'),
            cs('Construction Project Management'),
            cs('Environmental Planning'),
            cs('Habitat Planning'),
            cs('Housing Planning'),
            cs('Industrial Design'),
            cs('Landscape Architecture'),
            cs('Infrastructure Planning'),
            cs('Interior Architecture'),
            cs('Regional Planning'),
            cs('Sustainable Architecture'),
            cs('Transportation Planning'),
            cs('Urban Architecture'),
            cs('Urban Planning'),
            viewAll('All Architecture Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('AAT'),
            cs('NATA'),
            cs('UPAT'),
            cs('JEE Main Paper 2'),
            viewAll('All Architecture Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Accounting & Commerce',
      directLink: '/streams/commerce',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Com.'),
            cs('M.Com.'),
            cs('CA'),
            cs('CS'),
            cs('CMA'),
            cs('ACCA'),
            cs('Diploma in Accounting'),
            cs('Diploma in Taxation'),
            viewAll('All Commerce Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            { label: 'Top Commerce Colleges in India', href: '/tools/colleges?stream=Commerce' },
            { label: 'Top Commerce Colleges in Mumbai', href: '/tools/colleges?stream=Commerce&city=Mumbai' },
            { label: 'Top Commerce Colleges in Delhi', href: '/tools/colleges?stream=Commerce&city=Delhi' },
            { label: 'Top Commerce Colleges in Pune', href: '/tools/colleges?stream=Commerce&city=Pune' },
            { label: 'Top Commerce Colleges in Bangalore', href: '/tools/colleges?stream=Commerce&city=Bangalore' },
            { label: 'Top Commerce Colleges in Kolkata', href: '/tools/colleges?stream=Commerce&city=Kolkata' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Accounting'),
            cs('Auditing'),
            cs('Banking & Finance'),
            cs('Business Studies'),
            cs('Commerce'),
            cs('Cost & Management Accounting'),
            cs('Economics'),
            cs('Financial Reporting'),
            cs('GST'),
            cs('International Business'),
            cs('Taxation'),
            viewAll('All Commerce Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('ICAI'),
            cs('ICSI'),
            cs('CMA Exam'),
            cs('ACCA'),
            viewAll('All Accounting & Commerce Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Banking, Finance & Insurance',
      directLink: '/tools/colleges?search=Banking',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('CFA'),
            cs('CFP'),
            cs('FRM'),
            cs('Diploma in Banking & Finance'),
            cs('B.Com. Banking & Finance'),
            cs('MBA Finance'),
            viewAll('All Banking & Finance Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            { label: 'Top Finance Colleges in India', href: '/tools/colleges?search=Finance' },
            { label: 'Top Banking Colleges in India', href: '/tools/colleges?search=Banking' },
            { label: 'Top Insurance Colleges in India', href: '/tools/colleges?search=Insurance' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Banking'),
            cs('Capital Markets'),
            cs('CBS'),
            cs('Corporate Banking'),
            cs('Finance'),
            cs('Financial Management'),
            cs('Health Insurance'),
            cs('Insurance'),
            cs('Investment Banking'),
            cs('Life Insurance'),
            cs('Mutual Funds'),
            cs('Risk Management'),
            cs('Wealth Management'),
            viewAll('All Banking Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IBPS PO'),
            cs('IBPS Clerk'),
            cs('SBI PO'),
            cs('RBI Grade B'),
            cs('IRDA'),
            viewAll('All Banking Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Aviation',
      directLink: '/tools/colleges?search=Aviation',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BBA Aviation'),
            cs('MBA Aviation'),
            cs('B.Sc. Aviation'),
            cs('Diploma in Aviation'),
            cs('Commercial Pilot License'),
            viewAll('All Aviation Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            { label: 'Top Aviation Colleges in India', href: '/tools/colleges?search=Aviation' },
            { label: 'Top Aviation Colleges in Delhi', href: '/tools/colleges?search=Aviation&city=Delhi' },
            { label: 'Top Aviation Colleges in Mumbai', href: '/tools/colleges?search=Aviation&city=Mumbai' },
            { label: 'Top Aviation Colleges in Bangalore', href: '/tools/colleges?search=Aviation&city=Bangalore' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Cabin Crew / Air Hostess'),
            cs('Aircraft Maintenance Engineering'),
            cs('Airport Management'),
            cs('Cargo Management'),
            cs('Flying / Pilot Training'),
            cs('Ground Services'),
            cs('Aviation Management'),
            cs('Airport Operations'),
            viewAll('All Aviation Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IGRUA Entrance Exam'),
            cs('AME CET'),
            viewAll('All Aviation Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Teaching & Education',
      directLink: '/streams/education',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Ed.'),
            cs('B.P.Ed.'),
            cs('B.Voc'),
            cs('M.Ed.'),
            cs('M.P.Ed.'),
            cs('D.Ed.'),
            cs('D.El.Ed.'),
            viewAll('All Education Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            { label: 'Top B.Ed. Colleges in India', href: '/tools/colleges?stream=Education' },
            { label: 'Top B.Ed. Colleges in Delhi', href: '/tools/colleges?stream=Education&city=Delhi' },
            { label: 'Top B.Ed. Colleges in Mumbai', href: '/tools/colleges?stream=Education&city=Mumbai' },
            { label: 'Top B.Ed. Colleges in Bangalore', href: '/tools/colleges?stream=Education&city=Bangalore' },
            { label: 'Top B.Ed. Colleges in Kolkata', href: '/tools/colleges?stream=Education&city=Kolkata' },
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Early Childhood Education'),
            cs('Educational Administration'),
            cs('Educational Psychology'),
            cs('Elementary Education'),
            cs('Physical Education'),
            cs('Secondary Education'),
            cs('Special Education'),
            cs('Teacher Training'),
            viewAll('All Education Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CTET'),
            cs('TSTET'),
            cs('UGC NET'),
            cs('PTET'),
            cs('UP B.Ed JEE'),
            cs('MAH B.Ed. CET'),
            viewAll('All Education Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Nursing',
      directLink: '/tools/colleges?search=Nursing',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc. Nursing'),
            cs('M.Sc. in Nursing'),
            viewAll('All Nursing Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Nursing & Midwifery'),
            viewAll('All Nursing Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            { label: 'Nursing Colleges in Uttar Pradesh', href: '/tools/colleges?search=Nursing&state=Uttar+Pradesh' },
            { label: 'Nursing Colleges in Bihar', href: '/tools/colleges?search=Nursing&state=Bihar' },
            { label: 'Nursing Colleges in Bangalore', href: '/tools/colleges?search=Nursing&city=Bangalore' },
            { label: 'Nursing Colleges in Kerala', href: '/tools/colleges?search=Nursing&state=Kerala' },
            { label: 'Nursing Colleges in Kolkata', href: '/tools/colleges?search=Nursing&city=Kolkata' },
            { label: 'Nursing Colleges in Delhi NCR', href: '/tools/colleges?search=Nursing&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Beauty & Fitness',
      directLink: '/tools/colleges',
      columns: [
        {
          links: [
            hdr('Popular Specializations'),
            cs('Beauty Culture & Cosmetology'),
            cs('Massage & Spa Therapy'),
            cs('Yoga'),
            viewAll('All Beauty & Fitness Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Universities and Colleges',
      columns: [
        {
          links: [
            hdr('Top Central Universities'),
            { label: 'University of Delhi', href: '/tools/colleges?search=University+of+Delhi' },
            { label: 'JNU Delhi', href: '/tools/colleges?search=Jawaharlal+Nehru+University' },
            { label: 'IGNOU Delhi', href: '/tools/colleges?search=IGNOU' },
            { label: 'Banaras Hindu University', href: '/tools/colleges?search=Banaras+Hindu+University' },
          ],
        },
        {
          links: [
            hdr('Top State Universities'),
            { label: 'University of Mumbai', href: '/tools/colleges?search=University+of+Mumbai' },
            { label: 'Anna University', href: '/tools/colleges?search=Anna+University' },
            { label: 'Gujarat University', href: '/tools/colleges?search=Gujarat+University' },
            { label: 'CCS University', href: '/tools/colleges?search=CCS+University' },
          ],
        },
        {
          links: [
            hdr('Top Ranked Universities'),
            { label: 'Top Universities in India', href: '/tools/colleges?institutionCategory=University' },
            { label: 'Top Colleges in India', href: '/tools/colleges' },
            { label: 'Top Universities in Bangalore', href: '/tools/colleges?institutionCategory=University&city=Bangalore' },
            { label: 'Top Universities in Delhi', href: '/tools/colleges?institutionCategory=University&city=Delhi' },
            { label: 'Top Universities in Punjab', href: '/tools/colleges?institutionCategory=University&state=Punjab' },
          ],
        },
        {
          links: [
            hdr('Colleges by State'),
            { label: 'Colleges in Maharashtra', href: '/tools/colleges?state=Maharashtra' },
            { label: 'Colleges in Karnataka', href: '/tools/colleges?state=Karnataka' },
            { label: 'Colleges in Uttar Pradesh', href: '/tools/colleges?state=Uttar+Pradesh' },
            { label: 'Colleges in Kerala', href: '/tools/colleges?state=Kerala' },
          ],
        },
        {
          links: [
            hdr('Colleges by City'),
            { label: 'Colleges in Delhi', href: '/tools/colleges?city=Delhi' },
            { label: 'Colleges in Bangalore', href: '/tools/colleges?city=Bangalore' },
            { label: 'Colleges in Mumbai', href: '/tools/colleges?city=Mumbai' },
            { label: 'Colleges in Hyderabad', href: '/tools/colleges?city=Hyderabad' },
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  6. STUDY ABROAD
// ════════════════════════════════════════════════════════════
const studyAbroadMenu: MegaMenuItem = {
  title: 'Study Abroad',
  subcategories: [
    {
      title: 'Countries',
      columns: [
        {
          links: [
            hdr('Top Countries'),
            { label: 'USA', href: '/tools/study-abroad', comingSoon: false },
            { label: 'UK', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Canada', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Australia', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Germany', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Ireland', href: '/tools/study-abroad', comingSoon: false },
            { label: 'France', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Singapore', href: '/tools/study-abroad', comingSoon: false },
            { label: 'New Zealand', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Japan', href: '/tools/study-abroad', comingSoon: false },
            viewAll('View All Countries →', '/tools/study-abroad', false),
          ],
        },
        {
          links: [
            hdr('Top Universities'),
            cs('Top Universities in USA'),
            cs('Top Universities in UK'),
            cs('Top Universities in Canada'),
            cs('Top Universities in Australia'),
            cs('Top Universities in Germany'),
            cs('Top Universities in Ireland'),
            cs('Top Universities in France'),
            cs('Top Universities in Singapore'),
            viewAll('Top Universities Abroad →', '/tools/international-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Language Exams'),
            cs('IELTS'),
            cs('TOEFL'),
            cs('PTE'),
            cs('DET'),
            hdr('Aptitude Exams'),
            cs('GRE'),
            cs('GMAT'),
            cs('SAT'),
          ],
        },
        {
          links: [
            cs('Free IELTS Masterclass'),
            cs('IELTS Preparation Resource'),
            cs('IELTS Reading Test'),
            cs('IELTS Writing Test'),
            cs('IELTS Listening Test'),
            cs('IELTS Speaking Test'),
          ],
        },
      ],
    },
    {
      title: 'Popular Programs',
      columns: [
        {
          links: [
            hdr('Top MS Colleges'),
            cs('MS in USA'),
            cs('MS in UK'),
            cs('MS in Canada'),
            cs('MS in Australia'),
            cs('MS in Germany'),
            cs('MS in Ireland'),
            viewAll('Explore MS Abroad →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top MBA Colleges'),
            cs('MBA in USA'),
            cs('MBA in UK'),
            cs('MBA in Canada'),
            cs('MBA in Australia'),
            cs('MBA in Germany'),
            cs('MBA in Ireland'),
            viewAll('Explore MBA Abroad →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top BE/BTech Colleges'),
            cs('BE/B.Tech in USA'),
            cs('BE/B.Tech in UK'),
            cs('BE/B.Tech in Canada'),
            cs('BE/B.Tech in Australia'),
            viewAll('Explore BE/B.Tech →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Student Visas',
      columns: [
        {
          links: [
            cs('Student Visa Canada'),
            cs('Student Visa USA'),
            cs('Student Visa Australia'),
            cs('Student Visa New Zealand'),
            cs('Student Visa UK'),
            cs('Student Visa Germany'),
            cs('Student Visa France'),
            cs('Student Visa Singapore'),
            cs('Student Visa Ireland'),
            cs('Student Visa Finland'),
          ],
        },
      ],
    },
    {
      title: 'SOP/LOR',
      columns: [
        {
          links: [
            hdr('SOP'),
            cs('What is SOP?'),
            cs('Common Mistakes in SOP'),
            cs('Sample SOP for MBA'),
            cs('Sample SOP for MS'),
            cs('Sample SOP for Bachelors'),
            cs('SOP for USA'),
            cs('SOP for UK'),
            cs('SOP for Canada'),
          ],
        },
        {
          links: [
            hdr('LOR'),
            cs('What is LOR?'),
            cs('Common Mistakes in LOR'),
            cs('Sample LOR for MBA'),
            cs('Sample LOR for MS'),
            cs('Sample LOR for Bachelors'),
            cs('Sample LOR for PhD'),
          ],
        },
      ],
    },
    {
      title: 'Scholarships',
      columns: [
        {
          links: [
            hdr('By Course'),
            cs('Scholarships for Bachelors'),
            cs('Scholarships for Masters'),
          ],
        },
        {
          links: [
            hdr('By Country'),
            cs('Scholarships for USA'),
            cs('Scholarships for Canada'),
            cs('Scholarships for Australia'),
            cs('Scholarships for UK'),
            cs('Scholarships for Germany'),
            cs('Scholarships for Singapore'),
          ],
        },
      ],
    },
    {
      title: 'Education Loan',
      columns: [
        {
          links: [
            hdr('Education Loan Guides'),
            cs('Step by Step Guide'),
            cs('Loan Eligibility Criteria'),
            cs('Documents Required for Loan'),
            cs('Student Loan Vs Self Finance'),
            cs('Best Education Loan Providers'),
            cs('Collateral for Education Loan'),
          ],
        },
        {
          links: [
            hdr('Guide for Countries'),
            cs('Education Loan for USA'),
            cs('Education Loan for UK'),
            cs('Education Loan for Canada'),
            cs('Education Loan for Australia'),
            cs('Education Loan for Germany'),
          ],
        },
      ],
    },
    {
      title: 'Services',
      columns: [
        {
          links: [
            hdr('Top Overseas Education Consultants'),
            cs('Consultants in Delhi'),
            cs('Consultants in Mumbai'),
            cs('Consultants in Pune'),
            cs('Consultants in Kochi'),
            cs('Consultants in Bangalore'),
            cs('Consultants in Kerala'),
            cs('Consultants in Chennai'),
            cs('Consultants in Hyderabad'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  7. COUNSELING
// ════════════════════════════════════════════════════════════
const counselingMenu: MegaMenuItem = {
  title: 'Counseling',
  subcategories: [
    {
      title: 'Get Expert Guidance',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
          ],
        },
      ],
    },
    {
      title: 'Careers after 12th',
      columns: [
        {
          links: [
            hdr('By Stream'),
            cs('Science'),
            cs('Commerce'),
            cs('Humanities'),
          ],
        },
        {
          links: [
            hdr('Popular Careers'),
            cs('Aeronautical Engineer'),
            cs('Chartered Accountant'),
            cs('Computer Engineer'),
            cs('Doctor'),
            cs('Hotel Manager'),
            cs('Pilot'),
            viewAll('All other careers →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Courses after 12th',
      columns: [
        {
          links: [
            cs('Science Stream'),
            cs('Commerce Stream'),
            cs('Arts Stream'),
            viewAll('All Class 12th Streams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Free Prep Material',
      columns: [
        {
          links: [
            hdr('NCERT Solutions'),
            cs('NCERT Solutions'),
            cs('NCERT Solutions for Class 12 Maths'),
            cs('NCERT Solutions for Class 12 Physics'),
            cs('NCERT Solutions for Class 12 Chemistry'),
            cs('NCERT Solutions for Class 11 Maths'),
            cs('NCERT Solutions for Class 11 Physics'),
            cs('NCERT Solutions for Class 11 Chemistry'),
          ],
        },
        {
          links: [
            hdr('NCERT Topics'),
            cs('NCERT Notes'),
            cs('NCERT Class 12 Notes'),
            cs('NCERT Class 11 Notes'),
            cs('NCERT Class 12 Maths'),
            cs('NCERT Class 12 Physics'),
            cs('NCERT Class 12 Chemistry'),
            cs('NCERT Class 11 Maths'),
            cs('NCERT Class 11 Physics'),
            cs('NCERT Class 11 Chemistry'),
          ],
        },
      ],
    },
    {
      title: 'National Boards',
      columns: [
        {
          links: [
            cs('CBSE'),
            cs('ICSE'),
            cs('NIOS'),
            viewAll('All Education Boards →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'State Boards',
      columns: [
        {
          links: [
            cs('UPMSP'),
            cs('BSEB'),
            cs('PSEB'),
            cs('RBSE'),
            cs('JKBOSE'),
          ],
        },
        {
          links: [
            cs('GSEB'),
            cs('HPBOSE'),
            cs('MPBSE'),
            cs('BIEAP'),
          ],
        },
        {
          links: [
            cs('BSEH'),
            cs('CGBSE'),
            cs('WBBSE'),
            cs('WBCHSE'),
            viewAll('All Education Boards →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Abroad Counseling Service',
      directLink: '/coming-soon',
      columns: [],
    },
    {
      title: 'Get Free Counselling',
      directLink: '/coming-soon',
      columns: [],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  8. ONLINE COURSES (Shiksha Online)
// ════════════════════════════════════════════════════════════
const onlineCoursesMenu: MegaMenuItem = {
  title: 'Online Courses',
  subcategories: [
    {
      title: 'Technology',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Technology'),
            cs('Big Data'),
            cs('Cloud Technologies'),
            cs('Cybersecurity'),
            cs('Databases'),
            cs('IT Services'),
            cs('Networking and Hardware'),
            cs('Operating System'),
            cs('Programming'),
            cs('QA and Testing'),
            cs('Web Development'),
            cs('Software Tools'),
          ],
        },
      ],
    },
    {
      title: 'Data Science',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Data Science'),
            cs('Data Science Basics'),
            cs('Data Science for HealthCare'),
            cs('Deep Learning'),
            cs('Machine Learning'),
          ],
        },
      ],
    },
    {
      title: 'Management',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Management'),
            cs('Business Analytics'),
            cs('Business Tools'),
            cs('Communication'),
            cs('Entrepreneurship'),
            cs('Human Resources'),
            cs('Logistics and Supply Chain'),
            cs('Marketing'),
            cs('Operations'),
            cs('Product Management'),
            cs('Strategy and Leadership'),
          ],
        },
      ],
    },
    {
      title: 'Finance',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Accounting'),
            cs('Banking'),
            cs('Investing'),
            cs('Law'),
            cs('Insurance'),
          ],
        },
      ],
    },
    {
      title: 'Creativity & Design',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Architecture'),
            cs('Fashion'),
            cs('Web Design'),
          ],
        },
      ],
    },
    {
      title: 'Emerging Technologies',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('AR VR and Gaming'),
            cs('BlockChain'),
            cs('Electric Vehicles'),
            cs('Internet of Things'),
            cs('Robotics'),
          ],
        },
      ],
    },
    {
      title: 'Healthcare',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Fitness and Nutrition'),
            cs('Healthcare Research'),
            cs('Healthcare Management'),
          ],
        },
      ],
    },
    {
      title: 'Personal Development',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Career Growth'),
            cs('Hobby And Passion'),
            cs('Languages'),
          ],
        },
      ],
    },
    {
      title: 'Degree Programs',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Bachelors Program'),
            cs('Masters Program'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  EXPORT ALL MENU DATA
// ════════════════════════════════════════════════════════════
export const megaMenuItems: MegaMenuItem[] = [
  mbaMenu,
  engineeringMenu,
  medicalMenu,
  designMenu,
  moreMenu,
  studyAbroadMenu,
  counselingMenu,
  onlineCoursesMenu,
];
