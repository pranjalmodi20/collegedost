const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Exam = require(path.resolve(__dirname, '../src/models/Exam.model'));

// Comprehensive exam data for all categories
const examsData = [
  // ========== ENGINEERING ==========
  {
    examName: 'JEE Main',
    examSlug: 'jee-main',
    conductingAuthority: 'NTA (National Testing Agency)',
    examLevel: 'National',
    category: 'Engineering',
    description: 'Joint Entrance Examination Main for undergraduate engineering admissions to NITs, IIITs, and GFTIs.',
    eligibility: 'Class 12th pass with Physics, Chemistry, and Mathematics.',
    syllabus: 'Physics, Chemistry, Mathematics as per NCERT Class 11 & 12.',
    examPattern: 'Computer Based Test (CBT). 90 questions (30 per subject). 300 marks total.',
    importantDates: [
      { title: 'Session 1 Exam', date: new Date('2026-01-24'), isTentative: true },
      { title: 'Session 2 Exam', date: new Date('2026-04-06'), isTentative: true }
    ],
    applicationProcess: {
      fee: 'INR 1000 (General Male)',
      steps: ['Register on NTA website', 'Fill application form', 'Upload documents', 'Pay fee'],
      websiteUrl: 'https://jeemain.nta.ac.in'
    }
  },
  {
    examName: 'JEE Advanced',
    examSlug: 'jee-advanced',
    conductingAuthority: 'IIT (Rotating)',
    examLevel: 'National',
    category: 'Engineering',
    description: 'Joint Entrance Examination Advanced for admission to IITs.',
    eligibility: 'Qualified JEE Main with top 2.5 lakh rank.',
    examPattern: 'Two papers of 3 hours each. MCQ, Numerical, and Match based questions.',
    applicationProcess: { websiteUrl: 'https://jeeadv.ac.in' }
  },
  {
    examName: 'BITSAT',
    examSlug: 'bitsat',
    conductingAuthority: 'BITS Pilani',
    examLevel: 'University',
    category: 'Engineering',
    description: 'BITS Admission Test for undergraduate programs at BITS Pilani, Goa, and Hyderabad.',
    eligibility: 'Class 12th with 75% aggregate in PCM.',
    examPattern: 'Online test. 150 questions. 3 hours.',
    applicationProcess: { websiteUrl: 'https://bitsadmission.com' }
  },
  {
    examName: 'VITEEE',
    examSlug: 'viteee',
    conductingAuthority: 'VIT University',
    examLevel: 'University',
    category: 'Engineering',
    description: 'VIT Engineering Entrance Examination for B.Tech admission.',
    eligibility: 'Class 12th with PCM/PCB.',
    applicationProcess: { websiteUrl: 'https://viteee.vit.ac.in' }
  },
  {
    examName: 'GATE',
    examSlug: 'gate',
    conductingAuthority: 'IIT (Rotating)',
    examLevel: 'National',
    category: 'Engineering',
    description: 'Graduate Aptitude Test in Engineering for M.Tech/PSU admissions.',
    eligibility: 'B.E/B.Tech or final year students.',
    applicationProcess: { websiteUrl: 'https://gate.iitg.ac.in' }
  },

  // ========== MEDICAL ==========
  {
    examName: 'NEET UG',
    examSlug: 'neet-ug',
    conductingAuthority: 'NTA',
    examLevel: 'National',
    category: 'Medical',
    description: 'National Eligibility cum Entrance Test for MBBS, BDS, and AYUSH courses.',
    eligibility: 'Class 12th with PCB and minimum 50% marks.',
    syllabus: 'Physics, Chemistry, Biology (Botany & Zoology).',
    examPattern: 'Pen and Paper. 200 questions. 720 marks. 3 hours 20 minutes.',
    applicationProcess: { websiteUrl: 'https://neet.nta.nic.in' }
  },
  {
    examName: 'NEET PG',
    examSlug: 'neet-pg',
    conductingAuthority: 'NBE',
    examLevel: 'National',
    category: 'Medical',
    description: 'National Eligibility cum Entrance Test PG for MD/MS admissions.',
    eligibility: 'MBBS degree holders.',
    applicationProcess: { websiteUrl: 'https://nbe.edu.in' }
  },

  // ========== LAW ==========
  {
    examName: 'CLAT',
    examSlug: 'clat',
    conductingAuthority: 'Consortium of NLUs',
    examLevel: 'National',
    category: 'Law',
    description: 'Common Law Admission Test for undergraduate and postgraduate law programs at NLUs.',
    eligibility: 'Class 12th pass with 45% marks (40% for SC/ST).',
    syllabus: 'English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques.',
    examPattern: 'Online test. 150 questions. 120 minutes.',
    applicationProcess: { websiteUrl: 'https://consortiumofnlus.ac.in' }
  },
  {
    examName: 'AILET',
    examSlug: 'ailet',
    conductingAuthority: 'National Law University Delhi',
    examLevel: 'University',
    category: 'Law',
    description: 'All India Law Entrance Test for admission to NLU Delhi.',
    eligibility: 'Class 12th pass with 50% marks.',
    syllabus: 'English, General Knowledge, Legal Aptitude, Reasoning.',
    examPattern: 'Offline test. 150 questions. 90 minutes.',
    applicationProcess: { websiteUrl: 'https://nludelhi.ac.in' }
  },
  {
    examName: 'SLAT',
    examSlug: 'slat',
    conductingAuthority: 'Symbiosis International University',
    examLevel: 'University',
    category: 'Law',
    description: 'Symbiosis Law Admission Test for law programs at Symbiosis.',
    eligibility: 'Class 12th pass.',
    applicationProcess: { websiteUrl: 'https://set-test.org' }
  },
  {
    examName: 'AP LAWCET',
    examSlug: 'ap-lawcet',
    conductingAuthority: 'APSCHE',
    examLevel: 'State',
    category: 'Law',
    description: 'Andhra Pradesh Law Common Entrance Test.',
    eligibility: 'Class 12th pass for 5-year LLB.',
    applicationProcess: { websiteUrl: 'https://cets.apsche.ap.gov.in' }
  },
  {
    examName: 'MH CET Law',
    examSlug: 'mh-cet-law',
    conductingAuthority: 'MAH CET Cell',
    examLevel: 'State',
    category: 'Law',
    description: 'Maharashtra Common Entrance Test for Law admissions.',
    eligibility: 'Class 12th pass with 45% marks.',
    applicationProcess: { websiteUrl: 'https://cetcell.mahacet.org' }
  },
  {
    examName: 'AIBE',
    examSlug: 'aibe',
    conductingAuthority: 'Bar Council of India',
    examLevel: 'National',
    category: 'Law',
    description: 'All India Bar Examination for law graduates to practice as advocates.',
    eligibility: 'LLB degree holder.',
    applicationProcess: { websiteUrl: 'https://allindiabarexamination.com' }
  },
  {
    examName: 'ULSAT-LLB',
    examSlug: 'ulsat-llb',
    conductingAuthority: 'UPES Dehradun',
    examLevel: 'University',
    category: 'Law',
    description: 'UPES Law Studies Aptitude Test for LLB admission.',
    applicationProcess: { websiteUrl: 'https://upes.ac.in' }
  },

  // ========== DESIGN ==========
  {
    examName: 'NIFT',
    examSlug: 'nift',
    conductingAuthority: 'National Institute of Fashion Technology',
    examLevel: 'National',
    category: 'Design',
    description: 'NIFT Entrance Exam for admission to fashion and design courses.',
    eligibility: 'Class 12th pass.',
    syllabus: 'Creative Ability Test, General Ability Test, Situation Test.',
    examPattern: 'Written + Situation Test.',
    applicationProcess: { websiteUrl: 'https://nift.ac.in' }
  },
  {
    examName: 'UCEED',
    examSlug: 'uceed',
    conductingAuthority: 'IIT Bombay',
    examLevel: 'National',
    category: 'Design',
    description: 'Undergraduate Common Entrance Examination for Design.',
    eligibility: 'Class 12th pass.',
    applicationProcess: { websiteUrl: 'https://uceed.iitb.ac.in' }
  },
  {
    examName: 'NID DAT',
    examSlug: 'nid-dat',
    conductingAuthority: 'National Institute of Design',
    examLevel: 'National',
    category: 'Design',
    description: 'NID Design Aptitude Test for admission to NID.',
    applicationProcess: { websiteUrl: 'https://admissions.nid.edu' }
  },
  {
    examName: 'CEED',
    examSlug: 'ceed',
    conductingAuthority: 'IIT Bombay',
    examLevel: 'National',
    category: 'Design',
    description: 'Common Entrance Exam for Design (Postgraduate).',
    eligibility: 'Bachelor degree in any discipline.',
    applicationProcess: { websiteUrl: 'https://ceed.iitb.ac.in' }
  },
  {
    examName: 'FDDI AIST',
    examSlug: 'fddi-aist',
    conductingAuthority: 'FDDI',
    examLevel: 'National',
    category: 'Design',
    description: 'Footwear Design & Development Institute Admission Test.',
    applicationProcess: { websiteUrl: 'https://fddiindia.com' }
  },
  {
    examName: 'JNAFAU FADEE',
    examSlug: 'jnafau-fadee',
    conductingAuthority: 'JNAFA University',
    examLevel: 'State',
    category: 'Design',
    description: 'Fine Arts & Design Entrance Exam by JNAFAU Hyderabad.',
    applicationProcess: { websiteUrl: 'https://jnafau.ac.in' }
  },
  {
    examName: 'MITID DAT',
    examSlug: 'mitid-dat',
    conductingAuthority: 'MIT Institute of Design',
    examLevel: 'University',
    category: 'Design',
    description: 'MIT Institute of Design Aptitude Test.',
    applicationProcess: { websiteUrl: 'https://mitid.edu.in' }
  },

  // ========== MEDIA ==========
  {
    examName: 'IIMC',
    examSlug: 'iimc',
    conductingAuthority: 'Indian Institute of Mass Communication',
    examLevel: 'National',
    category: 'Media',
    description: 'IIMC Entrance Exam for journalism and mass communication courses.',
    eligibility: 'Graduate in any discipline.',
    applicationProcess: { websiteUrl: 'https://iimc.gov.in' }
  },
  {
    examName: 'NPAT',
    examSlug: 'npat',
    conductingAuthority: 'NMIMS University',
    examLevel: 'University',
    category: 'Media',
    description: 'NMIMS Programs After Twelfth for BBA, B.Com, and other programs.',
    eligibility: 'Class 12th pass.',
    applicationProcess: { websiteUrl: 'https://www.nmims.edu' }
  },

  // ========== FINANCE ==========
  {
    examName: 'CA Foundation',
    examSlug: 'ca-foundation',
    conductingAuthority: 'ICAI',
    examLevel: 'National',
    category: 'Finance',
    description: 'CA Foundation Examination for entry to Chartered Accountancy course.',
    eligibility: 'Class 12th pass.',
    syllabus: 'Accounting, Business Laws, Quantitative Aptitude, Business Economics.',
    applicationProcess: { websiteUrl: 'https://icai.org' }
  },
  {
    examName: 'CA Intermediate',
    examSlug: 'ca-intermediate',
    conductingAuthority: 'ICAI',
    examLevel: 'National',
    category: 'Finance',
    description: 'CA Intermediate Examination - second level of CA course.',
    eligibility: 'CA Foundation pass or graduate with 55%.',
    applicationProcess: { websiteUrl: 'https://icai.org' }
  },
  {
    examName: 'CA Final',
    examSlug: 'ca-final',
    conductingAuthority: 'ICAI',
    examLevel: 'National',
    category: 'Finance',
    description: 'CA Final Examination - final level to become a Chartered Accountant.',
    eligibility: 'CA Intermediate pass + 2.5 years articleship.',
    applicationProcess: { websiteUrl: 'https://icai.org' }
  },
  {
    examName: 'CS Executive',
    examSlug: 'cs-executive',
    conductingAuthority: 'ICSI',
    examLevel: 'National',
    category: 'Finance',
    description: 'Company Secretary Executive Programme examination.',
    eligibility: 'CS Foundation pass or graduate.',
    applicationProcess: { websiteUrl: 'https://icsi.edu' }
  },
  {
    examName: 'CS Professional',
    examSlug: 'cs-professional',
    conductingAuthority: 'ICSI',
    examLevel: 'National',
    category: 'Finance',
    description: 'Company Secretary Professional Programme - final level.',
    eligibility: 'CS Executive pass.',
    applicationProcess: { websiteUrl: 'https://icsi.edu' }
  },
  {
    examName: 'CFA',
    examSlug: 'cfa',
    conductingAuthority: 'CFA Institute',
    examLevel: 'International',
    category: 'Finance',
    description: 'Chartered Financial Analyst certification exam.',
    eligibility: 'Bachelor degree or final year student.',
    applicationProcess: { websiteUrl: 'https://cfainstitute.org' }
  },
  {
    examName: 'CSEET',
    examSlug: 'cseet',
    conductingAuthority: 'ICSI',
    examLevel: 'National',
    category: 'Finance',
    description: 'CS Executive Entrance Test for CS aspirants.',
    eligibility: 'Class 12th pass.',
    applicationProcess: { websiteUrl: 'https://icsi.edu' }
  },
  {
    examName: 'ACET',
    examSlug: 'acet',
    conductingAuthority: 'IAI',
    examLevel: 'National',
    category: 'Finance',
    description: 'Actuarial Common Entrance Test for Actuarial Science.',
    eligibility: 'Class 12th pass with Mathematics.',
    applicationProcess: { websiteUrl: 'https://actuariesindia.org' }
  },

  // ========== COMPUTER/IT ==========
  {
    examName: 'NIMCET',
    examSlug: 'nimcet',
    conductingAuthority: 'NITs (Rotating)',
    examLevel: 'National',
    category: 'Computer Application and IT',
    description: 'NIT MCA Common Entrance Test for MCA admission.',
    eligibility: 'BCA or graduate with Mathematics.',
    applicationProcess: { websiteUrl: 'https://nimcet.in' }
  },
  {
    examName: 'CUET PG MCA',
    examSlug: 'cuet-pg-mca',
    conductingAuthority: 'NTA',
    examLevel: 'National',
    category: 'Computer Application and IT',
    description: 'CUET PG for MCA admission to central universities.',
    eligibility: 'Graduate with Mathematics.',
    applicationProcess: { websiteUrl: 'https://cuet.nta.nic.in' }
  },
  {
    examName: 'MAH MCA CET',
    examSlug: 'mah-mca-cet',
    conductingAuthority: 'MAH CET Cell',
    examLevel: 'State',
    category: 'Computer Application and IT',
    description: 'Maharashtra MCA Common Entrance Test.',
    applicationProcess: { websiteUrl: 'https://cetcell.mahacet.org' }
  },
  {
    examName: 'IPU CET MCA',
    examSlug: 'ipu-cet-mca',
    conductingAuthority: 'GGSIPU Delhi',
    examLevel: 'State',
    category: 'Computer Application and IT',
    description: 'IP University CET for MCA admission.',
    applicationProcess: { websiteUrl: 'https://ipu.ac.in' }
  },
  {
    examName: 'VITMEE',
    examSlug: 'vitmee',
    conductingAuthority: 'VIT University',
    examLevel: 'University',
    category: 'Computer Application and IT',
    description: 'VIT Master Entrance Examination for M.Tech/MCA.',
    applicationProcess: { websiteUrl: 'https://vit.ac.in' }
  },
  {
    examName: 'WB JECA',
    examSlug: 'wb-jeca',
    conductingAuthority: 'WBJEEB',
    examLevel: 'State',
    category: 'Computer Application and IT',
    description: 'West Bengal Joint Entrance for MCA.',
    applicationProcess: { websiteUrl: 'https://wbjeeb.nic.in' }
  },
  {
    examName: 'TANCET MCA',
    examSlug: 'tancet-mca',
    conductingAuthority: 'Anna University',
    examLevel: 'State',
    category: 'Computer Application and IT',
    description: 'Tamil Nadu CET for MCA admission.',
    applicationProcess: { websiteUrl: 'https://annauniv.edu' }
  },

  // ========== PHARMACY ==========
  {
    examName: 'GPAT',
    examSlug: 'gpat',
    conductingAuthority: 'NTA',
    examLevel: 'National',
    category: 'Pharmacy',
    description: 'Graduate Pharmacy Aptitude Test for M.Pharm admission.',
    eligibility: 'B.Pharm degree.',
    applicationProcess: { websiteUrl: 'https://gpat.nta.nic.in' }
  },
  {
    examName: 'NIPER JEE',
    examSlug: 'niper-jee',
    conductingAuthority: 'NIPER',
    examLevel: 'National',
    category: 'Pharmacy',
    description: 'NIPER Joint Entrance Exam for pharmacy postgraduate programs.',
    eligibility: 'B.Pharm/M.Sc.',
    applicationProcess: { websiteUrl: 'https://niper.ac.in' }
  }
];

const seedExams = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete existing exams (optional - comment out to append instead)
    await Exam.deleteMany({});
    console.log('Cleared existing exams');

    // Insert all exams
    const insertedExams = await Exam.insertMany(examsData);
    console.log(`Successfully seeded ${insertedExams.length} exams!`);
    
    console.log('\n--- SEEDED EXAMS ---');
    insertedExams.forEach(e => {
      console.log(`✅ ${e.examName} (${e.examSlug}) - ${e.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedExams();
