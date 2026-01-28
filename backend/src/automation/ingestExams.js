const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('../models/Exam.model');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');

dotenv.config();

const parser = new Parser();

const POPULAR_EXAMS = [
    // --- Engineering / Popular ---
    { name: 'JEE Main', authority: 'NTA', level: 'National', category: 'Engineering', website: 'https://jeemain.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Main+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JEE Advanced', authority: 'IITs', level: 'National', category: 'Engineering', website: 'https://jeeadv.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Advanced+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEET UG', authority: 'NTA', level: 'National', category: 'Medical', website: 'https://neet.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=NEET+UG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BITSAT', authority: 'BITS Pilani', level: 'National', category: 'Engineering', website: 'https://www.bitsadmission.com/', rss: 'https://news.google.com/rss/search?q=BITSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'VITEEE', authority: 'VIT', level: 'University', category: 'Engineering', website: 'https://viteee.vit.ac.in/', rss: 'https://news.google.com/rss/search?q=VITEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NIFT', authority: 'NTA', level: 'National', category: 'Design', website: 'https://nift.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=NIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CLAT', authority: 'Consortium of NLUs', level: 'National', category: 'Law', website: 'https://consortiumofnlus.ac.in/', rss: 'https://news.google.com/rss/search?q=CLAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPSC CSE', authority: 'UPSC', level: 'National', category: 'Civil Services', website: 'https://upsc.gov.in/', rss: 'https://news.google.com/rss/search?q=UPSC+Civil+Services+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GATE', authority: 'IITs', level: 'National', category: 'Engineering', website: 'https://gate.iitk.ac.in/', rss: 'https://news.google.com/rss/search?q=GATE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESEAT', authority: 'UPES', level: 'University', category: 'Engineering', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESEAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AEEE', authority: 'Amrita Vishwa Vidyapeetham', level: 'University', category: 'Engineering', website: 'https://www.amrita.edu/', rss: 'https://news.google.com/rss/search?q=AEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA National ---
    { name: 'CAT', authority: 'IIMs', level: 'National', category: 'Management', website: 'https://iimcat.ac.in/', rss: 'https://news.google.com/rss/search?q=CAT+Exam+IIM&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XAT', authority: 'XLRI', level: 'National', category: 'Management', website: 'https://xatonline.in/', rss: 'https://news.google.com/rss/search?q=XAT+Exam+XLRI&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMAT', authority: 'NTA', level: 'National', category: 'Management', website: 'https://cmat.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=CMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMAT by GMAC', authority: 'GMAC', level: 'National', category: 'Management', website: 'https://www.nmat.org/', rss: 'https://news.google.com/rss/search?q=NMAT+by+GMAC+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SNAP', authority: 'Symbiosis International', level: 'National', category: 'Management', website: 'https://www.snaptest.org/', rss: 'https://news.google.com/rss/search?q=SNAP+Test+Symbiosis&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MAT', authority: 'AIMA', level: 'National', category: 'Management', website: 'https://mat.aima.in/', rss: 'https://news.google.com/rss/search?q=MAT+Exam+AIMA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'ATMA', authority: 'AIMS', level: 'National', category: 'Management', website: 'https://www.atmaaims.com/', rss: 'https://news.google.com/rss/search?q=ATMA+Exam+AIMS&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GMAT', authority: 'GMAC', level: 'International', category: 'Management', website: 'https://www.mba.com/', rss: 'https://news.google.com/rss/search?q=GMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IBSAT', authority: 'ICFAI', level: 'University', category: 'Management', website: 'https://ibsindia.org/', rss: 'https://news.google.com/rss/search?q=IBSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MICAT', authority: 'MICA', level: 'University', category: 'Management', website: 'https://www.mica.ac.in/', rss: 'https://news.google.com/rss/search?q=MICAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CUET-PG (MBA)', authority: 'NTA', level: 'National', category: 'Management', website: 'https://pgcuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+PG+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA University / Institute ---
    { name: 'IIFT Entrance Exam', authority: 'NTA/IIFT', level: 'National', category: 'Management', website: 'https://www.iift.ac.in/', rss: 'https://news.google.com/rss/search?q=IIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TISSNET', authority: 'TISS', level: 'National', category: 'Management', website: 'https://tiss.edu/', rss: 'https://news.google.com/rss/search?q=TISSNET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMIMS NPAT', authority: 'NMIMS', level: 'University', category: 'Management', website: 'https://npat.in/', rss: 'https://news.google.com/rss/search?q=NMIMS+NPAT&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XGMT', authority: 'XIM University', level: 'University', category: 'Management', website: 'https://xim.edu.in/', rss: 'https://news.google.com/rss/search?q=XGMT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SPJIMR Profile-based', authority: 'SPJIMR', level: 'Institute', category: 'Management', website: 'https://www.spjimr.org/', rss: 'https://news.google.com/rss/search?q=SPJIMR+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    
    // --- MBA State Level ---
    { name: 'MAH MBA CET', authority: 'State CET Cell, Maharashtra', level: 'State', category: 'Management', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+MBA+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MHT CET', authority: 'State Common Entrance Test Cell, Maharashtra', level: 'State', category: 'Engineering', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MHT+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en' }, 
    { name: 'KMAT Karnataka', authority: 'KPPGCA', level: 'State', category: 'Management', website: 'http://kmatindia.com/', rss: 'https://news.google.com/rss/search?q=KMAT+Karnataka&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KMAT Kerala', authority: 'CEE Kerala', level: 'State', category: 'Management', website: 'https://kmatkerala.in/', rss: 'https://news.google.com/rss/search?q=KMAT+Kerala&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TS ICET', authority: 'TSCHE', level: 'State', category: 'Management', website: 'https://icet.tsche.ac.in/', rss: 'https://news.google.com/rss/search?q=TS+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AP ICET', authority: 'APSCHE', level: 'State', category: 'Management', website: 'https://apicet.apsche.ap.gov.in/', rss: 'https://news.google.com/rss/search?q=AP+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TANCET (MBA)', authority: 'Anna University', level: 'State', category: 'Management', website: 'https://tancet.annauniv.edu/', rss: 'https://news.google.com/rss/search?q=TANCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'HPCET (MBA)', authority: 'HPTU', level: 'State', category: 'Management', website: 'https://www.himtu.ac.in/', rss: 'https://news.google.com/rss/search?q=HPCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'OJEE (MBA)', authority: 'OJEE Board', level: 'State', category: 'Management', website: 'https://ojee.nic.in/', rss: 'https://news.google.com/rss/search?q=OJEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RMAT Rajasthan', authority: 'RTU', level: 'State', category: 'Management', website: 'https://rmat.rajasthan.gov.in/', rss: 'https://news.google.com/rss/search?q=RMAT+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JKBOPEE MBA', authority: 'JKBOPEE', level: 'State', category: 'Management', website: 'https://www.jkbopee.gov.in/', rss: 'https://news.google.com/rss/search?q=JKBOPEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Private / Other ---
    { name: 'AMU MBA Entrance', authority: 'AMU', level: 'University', category: 'Management', website: 'https://www.amucontrollerexams.com/', rss: 'https://news.google.com/rss/search?q=AMU+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BHU MBA Entrance', authority: 'BHU', level: 'University', category: 'Management', website: 'https://bhu.ac.in/', rss: 'https://news.google.com/rss/search?q=BHU+MBA+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'LPU NEST (MBA)', authority: 'LPU', level: 'University', category: 'Management', website: 'https://nest.lpu.in/', rss: 'https://news.google.com/rss/search?q=LPU+NEST+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KIITEE Management', authority: 'KIIT', level: 'University', category: 'Management', website: 'https://ksom.ac.in/', rss: 'https://news.google.com/rss/search?q=KIITEE+Management&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESMET', authority: 'UPES', level: 'University', category: 'Management', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESMET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Christ University MBA', authority: 'Christ University', level: 'University', category: 'Management', website: 'https://christuniversity.in/', rss: 'https://news.google.com/rss/search?q=Christ+University+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- UG Medical & Allied ---
    { name: 'AIIMS BSc Nursing', authority: 'AIIMS', level: 'National', category: 'Medical', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=AIIMS+BSc+Nursing+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JIPMER Nursing', authority: 'JIPMER', level: 'Institute', category: 'Medical', website: 'https://jipmer.edu.in/', rss: 'https://news.google.com/rss/search?q=JIPMER+Nursing+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Indian Army BSc Nursing', authority: 'Join Indian Army', level: 'National', category: 'Medical', website: 'https://joinindianarmy.nic.in/', rss: 'https://news.google.com/rss/search?q=Indian+Army+BSc+Nursing+MNS&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IPU CET (Medical)', authority: 'GGSIPU', level: 'University', category: 'Medical', website: 'http://www.ipu.ac.in/', rss: 'https://news.google.com/rss/search?q=IPU+CET+BSc+Nursing+Paramedical&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RUHS Nursing', authority: 'RUHS', level: 'State', category: 'Medical', website: 'https://ruhsraj.org/', rss: 'https://news.google.com/rss/search?q=RUHS+Nursing+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- PG Medical ---
    { name: 'NEET PG', authority: 'NBEMS', level: 'National', category: 'Medical', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+PG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'INI CET', authority: 'AIIMS', level: 'National', category: 'Medical', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=INI+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AIAPGET', authority: 'NTA', level: 'National', category: 'Medical', website: 'https://aiapget.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=AIAPGET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEET MDS', authority: 'NBEMS', level: 'National', category: 'Medical', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+MDS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GPAT', authority: 'NBEMS', level: 'National', category: 'Pharmacy', website: 'https://natboard.edu.in/', rss: 'https://news.google.com/rss/search?q=GPAT+Pharmacy+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Super Speciality & Foreign ---
    { name: 'NEET SS', authority: 'NBEMS', level: 'National', category: 'Medical', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+SS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'INI SS', authority: 'AIIMS', level: 'National', category: 'Medical', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=INI+SS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'FMGE', authority: 'NBEMS', level: 'International', category: 'Medical', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=FMGE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NExT', authority: 'NMC', level: 'National', category: 'Medical', website: 'https://www.nmc.org.in/', rss: 'https://news.google.com/rss/search?q=National+Exit+Test+Medical+NExT&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Finance & Accounts ---
    { name: 'CA Foundation', authority: 'ICAI', level: 'National', category: 'Finance', website: 'https://www.icai.org/', rss: 'https://news.google.com/rss/search?q=CA+Foundation+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CA Intermediate', authority: 'ICAI', level: 'National', category: 'Finance', website: 'https://www.icai.org/', rss: 'https://news.google.com/rss/search?q=CA+Intermediate+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CA Final', authority: 'ICAI', level: 'National', category: 'Finance', website: 'https://www.icai.org/', rss: 'https://news.google.com/rss/search?q=CA+Final+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CS CSEET', authority: 'ICSI', level: 'National', category: 'Finance', website: 'https://www.icsi.edu/', rss: 'https://news.google.com/rss/search?q=CS+CSEET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CS Executive', authority: 'ICSI', level: 'National', category: 'Finance', website: 'https://www.icsi.edu/', rss: 'https://news.google.com/rss/search?q=CS+Executive+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CS Professional', authority: 'ICSI', level: 'National', category: 'Finance', website: 'https://www.icsi.edu/', rss: 'https://news.google.com/rss/search?q=CS+Professional+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMA Foundation', authority: 'ICMAI', level: 'National', category: 'Finance', website: 'https://icmai.in/', rss: 'https://news.google.com/rss/search?q=CMA+Foundation+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMA Intermediate', authority: 'ICMAI', level: 'National', category: 'Finance', website: 'https://icmai.in/', rss: 'https://news.google.com/rss/search?q=CMA+Intermediate+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMA Final', authority: 'ICMAI', level: 'National', category: 'Finance', website: 'https://icmai.in/', rss: 'https://news.google.com/rss/search?q=CMA+Final+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CFA Level 1', authority: 'CFA Institute', level: 'International', category: 'Finance', website: 'https://www.cfainstitute.org/', rss: 'https://news.google.com/rss/search?q=CFA+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'ACCA', authority: 'ACCA Global', level: 'International', category: 'Finance', website: 'https://www.accaglobal.com/', rss: 'https://news.google.com/rss/search?q=ACCA+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'ACET', authority: 'IAI', level: 'National', category: 'Finance', website: 'http://www.actuariesindia.org/', rss: 'https://news.google.com/rss/search?q=ACET+Exam+Actuarial&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Media & Journalism ---
    { name: 'IIMC Entrance Exam', authority: 'IIMC', level: 'National', category: 'Media', website: 'http://iimc.nic.in/', rss: 'https://news.google.com/rss/search?q=IIMC+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JMI Mass Comm', authority: 'Jamia Millia Islamia', level: 'University', category: 'Media', website: 'https://www.jmi.ac.in/', rss: 'https://news.google.com/rss/search?q=Jamia+Mass+Communication+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XIC OET', authority: 'Xavier Institute', level: 'Institute', category: 'Media', website: 'https://www.xaviercomm.org/', rss: 'https://news.google.com/rss/search?q=XIC+OET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'FTII JET', authority: 'FTII/SRFTI', level: 'National', category: 'Media', website: 'https://ftii.ac.in/', rss: 'https://news.google.com/rss/search?q=FTII+JET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Computer Application & IT ---
    { name: 'NIMCET', authority: 'NITs', level: 'National', category: 'Computer Application and IT', website: 'https://www.nimcet.in/', rss: 'https://news.google.com/rss/search?q=NIMCET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CUET-PG (MCA)', authority: 'NTA', level: 'National', category: 'Computer Application and IT', website: 'https://pgcuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+PG+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MAH MCA CET', authority: 'State CET Cell, Maharashtra', level: 'State', category: 'Computer Application and IT', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+MCA+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IPU CET (MCA)', authority: 'GGSIPU', level: 'University', category: 'Computer Application and IT', website: 'http://www.ipu.ac.in/', rss: 'https://news.google.com/rss/search?q=IPU+CET+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'VITMEE', authority: 'VIT', level: 'University', category: 'Computer Application and IT', website: 'https://vit.ac.in/', rss: 'https://news.google.com/rss/search?q=VITMEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'WB JECA', authority: 'WBJEEB', level: 'State', category: 'Computer Application and IT', website: 'https://wbjeeb.nic.in/jeca/', rss: 'https://news.google.com/rss/search?q=WB+JECA+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TANCET (MCA)', authority: 'Anna University', level: 'State', category: 'Computer Application and IT', website: 'https://tancet.annauniv.edu/', rss: 'https://news.google.com/rss/search?q=TANCET+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KMAT Kerala (MCA)', authority: 'CEE Kerala', level: 'State', category: 'Computer Application and IT', website: 'https://kmatkerala.in/', rss: 'https://news.google.com/rss/search?q=KMAT+Kerala+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'OJEE (MCA)', authority: 'OJEE Board', level: 'State', category: 'Computer Application and IT', website: 'https://ojee.nic.in/', rss: 'https://news.google.com/rss/search?q=OJEE+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Karnataka PGCET (MCA)', authority: 'KEA', level: 'State', category: 'Computer Application and IT', website: 'https://cetonline.karnataka.gov.in/kea/', rss: 'https://news.google.com/rss/search?q=Karnataka+PGCET+MCA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BIT MCA', authority: 'BIT Mesra', level: 'University', category: 'Computer Application and IT', website: 'https://www.bitmesra.ac.in/', rss: 'https://news.google.com/rss/search?q=BIT+Mesra+MCA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' }
];

const scrapeMetaDescription = async (url) => {
    try {
        const { data } = await axios.get(url, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
             timeout: 5000,
             httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(data);
        const metaDesc = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') ||
                         '';
        return metaDesc.substring(0, 490) + (metaDesc.length > 490 ? '...' : '');
    } catch (e) {
        console.log(`Failed to scrape description for ${url}: ${e.message}`);
        return '';
    }
};

const ingestExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const examData of POPULAR_EXAMS) {
            console.log(`Processing ${examData.name}...`);

            // 1. Fetch News
            let newsItems = [];
            try {
                const feed = await parser.parseURL(examData.rss);
                newsItems = feed.items.slice(0, 10).map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    contentSnippet: item.contentSnippet || item.content,
                    guid: item.guid || item.link || item.id
                }));
                console.log(`- Fetched ${newsItems.length} news items.`);
            } catch (err) {
                console.error(`- Failed to fetch news: ${err.message}`);
            }

            // 2. Try to scrape description if not provided?
            const scrapedDesc = await scrapeMetaDescription(examData.website);
            const description = scrapedDesc || `Official entrance exam conducted by ${examData.authority}. Check official website for latest updates.`;

            // 3. Upsert into DB
            const slug = slugify(examData.name, { lower: true });
            
            await Exam.findOneAndUpdate(
                { examSlug: slug },
                {
                    examName: examData.name,
                    examSlug: slug,
                    conductingAuthority: examData.authority,
                    examLevel: examData.level,
                    category: examData.category || 'General',
                    registrationLink: examData.website,
                    rssFeedUrl: examData.rss,
                    description: description,
                    news: newsItems,
                    logoUrl: `https://ui-avatars.com/api/?name=${slugify(examData.name, {replacement:'+'})}&background=random&size=200`
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`- Saved/Updated ${examData.name} in DB.`);
        }

        console.log('✅ Exam Ingestion Complete');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

ingestExams();
