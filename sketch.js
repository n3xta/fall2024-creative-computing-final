let bodyPose;
let reportGenerated = false; // 添加标志变量

function preload() {
  bodyPose = ml5.bodyPose("BlazePose");
}

class VideoCanvas {
  constructor(canvasId, keypointName) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.keypointName = keypointName;
  }

  draw(video, poses) {
    if (poses.length > 0) {
      const pose = poses[0]; // 假设只有一个人
      const keypoint = pose.keypoints.find(k => k.name === this.keypointName);

      if (keypoint && keypoint.confidence > 0.1) {
        const x = keypoint.x;
        const y = keypoint.y;
        const cropWidth = 35; // 裁剪区域的宽度
        const cropHeight = 35; // 裁剪区域的高度

        // 确保裁剪区域在视频范围内
        const sx = Math.max(0, x - cropWidth / 2);
        const sy = Math.max(0, y - cropHeight / 2);

        this.ctx.drawImage(
          video.elt,
          sx, sy, cropWidth, cropHeight, // 从视频中裁剪
          0, 0, this.canvas.width, this.canvas.height // 绘制到画布
        );
      } else {
        // 如果关键点不可用，绘制空白或占位符
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
}

let video;
let canvases = [];
let poses = [];

function setup() {
  canvases.push(new VideoCanvas("1", "left_eye"));
  canvases.push(new VideoCanvas("2", "right_eye"));
  canvases.push(new VideoCanvas("3", "left_shoulder"));
  canvases.push(new VideoCanvas("4", "right_wrist"));
  canvases.push(new VideoCanvas("5", "left_thumb"));
  canvases.push(new VideoCanvas("6", "right_thumb"));
  canvases.push(new VideoCanvas("7", "mouth_left"));
  canvases.push(new VideoCanvas("8", "right_shoulder"));

  video = createCapture(VIDEO, { video: { facingMode: "user" }, audio: false });
  video.elt.setAttribute("loading", "lazy"); // Lazy load video
  video.hide();
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  canvases.forEach(canvas => canvas.draw(video, poses));
  checkRightEye();
}

function checkRightEye() {
  const rightEyePose = poses.length > 0 ? poses[0].keypoints.find(k => k.name === "right_eye") : null;
  const chanceElement = document.getElementById('chance-percentage');

  if (!rightEyePose || rightEyePose.confidence <= 0.1) {
    clearReport();
    reportGenerated = false; // 重置标志变量
    chanceElement.textContent = "??"; // 设置为 "??"
    chanceElement.classList.remove('flicker'); // 移除闪烁效果
  } else if (!reportGenerated) {
    generateRandomReport();
    reportGenerated = true; // 设置标志变量
    chanceElement.classList.add('flicker'); // 添加闪烁效果
    startFlickering(); // 开始闪烁
    setTimeout(() => {
      if (reportGenerated == true) {
        console.log("audience is still here");
      }
    }, 10000);
  }
}

function startFlickering() {
  const chanceElement = document.getElementById('chance-percentage');
  if (chanceElement.textContent !== "??") { // 仅当不为 "??" 时才开始闪烁
    setInterval(() => {
      const randomPercentage = Math.floor(Math.random() * 90) + 10;
      chanceElement.textContent = `${randomPercentage}`;
    }, 99);
  }
}

function clearReport() {
  document.getElementById('background').innerHTML = `
    <h2>Background</h2>
    <p><strong>Gender:</strong> </p>
    <p><strong>Ethnicity:</strong> </p>
    <p><strong>School Type:</strong> </p>
    <p><strong>Sexual Orientation:</strong> </p>
    <p><strong>First-Gen Status:</strong> </p>
    <p><strong>Nationality:</strong> </p>
    <p><strong>Intended Majors:</strong> </p>
    <p><strong>Notable Tags:</strong> </p>
  `;

  document.getElementById('academic-stats').innerHTML = `
    <h2>Academic Stats</h2>
    <p><strong>SAT:</strong> </p>
    <p><strong>TOEFL:</strong> </p>
    <p><strong>AP Scores:</strong> </p>
  `;

  document.getElementById('awards').innerHTML = `
    <h2>Awards</h2>
    <ul></ul>
  `;

  document.getElementById('extracurriculars').innerHTML = `
    <h2>Extracurriculars</h2>
    <ol></ol>
  `;

  document.getElementById('essays').innerHTML = `
    <h2>Essays</h2>
    <p><strong>Personal Statement:</strong> </p>
  `;
}

// Add code to generate the report
function generateRandomReport() {
  // Define preset data arrays
  const genders = ["Non-Binary", "Male", "Female"];
  const ethnicities = [
    "Shinobi", "Saiyan", "Elf", "Hylian", 
    "Zaunite", "Piltoverian", "Amestrian", 
    "Zora", "Al Bhed", "Galarian", 
    "Moogle", "Demonkin", "Wutain", 
    "Atlantean", "Viera", "Half-Orc", 
    "Kree", "Asgardian", "Mandalorian", 
    "Rito", "Skaven", "Valkyrie"
  ];
  const schoolTypes = ["Public School", "Private School", "IB School", "Boarding School"];
  const sexualOrientations = ["Asexual", "Straight", "Bisexual", "Pansexual"];
  const firstGenStatuses = ["Yes", "No"];
  const nationalities = [
    "Konoha", "Hogwarts", "Midgar", "Rivendell", 
    "Shiganshina", "Mushroom Kingdom", "Pallet Town", 
    "Zion", "Pandora", "Atlantis", 
    "Hyrule", "Spira", "Wakanda", 
    "Gotham City", "Star City", "The Shire", 
    "Terra", "Eorzea", "Narnia", 
    "Rapture", "Columbia", "Kamurocho", 
    "Cybertron", "Ivalice", "The Citadel", 
    "Dalaran", "Novigrad", "Night City", 
    "Kaer Morhen", "Thedas", "Mordor"
  ];
  

  const intendedMajorsList = [
    "Animal Studies",
    "Anthropology",
    "Art History",
    "Biology",
    "Chemistry",
    "Classics",
    "Columbia Language Exchange",
    "Comparative Literature",
    "Computer Science",
    "Creative Writing",
    "Data Science",
    "Dramatic Literature",
    "East Asian Studies",
    "Economics",
    "English",
    "Environmental Studies",
    "European and Mediterranean Studies",
    "Expository Writing",
    "French",
    "Gender & Sexuality Studies - Social and Cultural Analysis",
    "German",
    "Hebrew & Judaic Studies",
    "Hellenic Studies",
    "History",
    "International Relations",
    "Irish Studies",
    "Italian",
    "Journalism",
    "Latin American-Caribbean Studies",
    "Latino Studies - Social and Cultural Analysis",
    "Law and Society",
    "Linguistics",
    "Math",
    "Medieval & Renaissance Studies",
    "Metropolitan Studies",
    "Middle Eastern and Islamic Studies",
    "Minor in Medical Humanities",
    "Music",
    "Neural Science",
    "Non-Departmental",
    "Philosophy",
    "Physics",
    "Politics",
    "Psychology",
    "Public Policy",
    "Religious Studies",
    "Social and Cultural Analysis",
    "Sociology",
    "Dental Hygiene",
    "Accounting",
    "Business and Society",
    "Computing and Data Science",
    "Economics",
    "Finance",
    "Management",
    "Marketing",
    "Operations Management",
    "Social Impact",
    "Statistics & Operations Research",
    "Liberal Studies",
    "Economics",
    "Economics",
    "Environmental Studies",
    "Experiential Learning",
    "Life Science",
    "Topics in Humanities",
    "Art History",
    "Biology",
    "Chemistry",
    "Chinese Language",
    "Computer Science",
    "Economics",
    "Engineering",
    "Film and New Media",
    "French Language",
    "Gender Studies",
    "Heritage Studies",
    "History",
    "Interactive Media Arts",
    "Japanese Language",
    "Legal Studies",
    "Literature & Creative Writing",
    "Mathematics",
    "Music",
    "Peace Studies",
    "Philosophy",
    "Physical Education",
    "Physics",
    "Political Science",
    "Psychology",
    "Science",
    "Social Research & Public Policy",
    "Social Sciences",
    "Spanish Language",
    "Theater",
    "Visual Arts",
    "Writing",
    "Art",
    "Biology",
    "Business and Finance",
    "Chemistry",
    "Chinese Language",
    "Computer Engineering",
    "Computer Science",
    "Creative Writing",
    "Creativity and Innovation",
    "Data Science",
    "Economics",
    "Electrical Engineering",
    "French Language",
    "Global China Studies",
    "History",
    "Humanities",
    "Interactive Media Arts",
    "Journalism",
    "Korean Language",
    "Literature",
    "Management",
    "Marketing",
    "Mathematics",
    "Media, Culture, & Communication",
    "Music",
    "Neural Science",
    "Philosophy",
    "Physics",
    "Psychology",
    "Religious Studies",
    "Social Foundations",
    "Social Science",
    "Social and Cultural Analysis",
    "World Languages",
  ];
  
  const notableTagsList = [
    "Once grounded for hacking the family Wi-Fi password",
    "Middle child who mastered the art of being ignored",
    "Survived a summer vacation without air conditioning",
    "Spent childhood debating conspiracy theories with grandparents",
    "Only student who brought snacks to a chemistry lab",
    "Grew up with seven cats and zero personal space",
    "Bilingual, thanks to binge-watching subtitled anime",
    "Parents confused my AP courses with Wi-Fi passwords",
    "Moved schools five times, mastered awkward introductions",
    "Once caught writing essays during a family wedding",
    "Ran a side business selling erasers in fourth grade",
    "Family celebrated my SAT score more than birthdays",
    "Older sibling perfected sabotage; I perfected resilience",
    "Homeschool grad with a curriculum designed by Pinterest",
    "Babysat younger siblings while solving calculus problems",
    "Learned programming to fix the family’s smart fridge",
    "Family reunions double as competitive debate tournaments",
    "Survived four major moves and two broken laptops",
    "Youngest in a family of professional overachievers",
    "Parents insisted I list piano lessons from 2007",
  ];

  const awardsList = [
    "<strong>Lunch-Time Homework Champion (3 Years Running)</strong> <br>Known for completing assignments with one hand while eating with the other.",
    "<strong>Regional Procrastination Recovery Award</strong> <br>Awarded for submitting a 10-page essay 30 seconds before the deadline.",
    "<strong>Netflix Multi-Tasking Scholar</strong> <br>Simultaneously binge-watched 12 seasons of a show while studying for finals.",
    "<strong>National Bed-Head Physics Olympiad Finalist</strong> <br>Scored top marks while attending via Zoom from bed.",
    "<strong>Midnight Snack Productivity Award</strong> <br>Solved three physics problems during a 2 a.m. kitchen run.",
    "<strong>Advanced Bathroom Break Debater</strong> <br>Crafted and won arguments in under five minutes between classes.",
    "<strong>3x Spreadsheet Formatting State Champion</strong> <br>Known for perfectly aligned cells and color-coded glory.",
    "<strong>Google Search Olympian (Silver Medal)</strong> <br>Found obscure research papers faster than librarians.",
    "<strong>Lofi Study Vibes International Competitor</strong> <br>Represented the nation in chill beats while grinding out problem sets.",
    "<strong>\"Ctrl+Z Savior Award\"</strong> <br>Recovered a deleted essay seconds before submission.",
    "<strong>Elite Email Refresh League MVP</strong> <br>Achieved 500 refreshes per minute during college application season.",
    "<strong>Ergonomic Desk Setup Engineer</strong> <br>Optimized workspace to maximize back pain and mental breakdown efficiency.",
    "<strong>Caffeine Chemistry Bowl (Bronze)</strong> <br>Perfected the molecular ratio for staying awake during finals.",
    "<strong>AI-Generated Response Coordinator</strong> <br>Outsourced 15 discussion board posts to ChatGPT without detection.",
    "<strong>Honors in Nap-Time Microeconomics</strong> <br>Solved a market equilibrium question mid-power nap.",
    "<strong>Regional Tab-Closing Marathoner (Platinum)</strong> <br>Successfully closed 200+ tabs after a six-hour study session.",
    "<strong>National Calculator Speed-Input Medalist</strong> <br>Entered integrals with zero typos at record-breaking speed.",
    "<strong>International Binder Organization Laureate</strong> <br>Recognized for color-coded tabs and flawless annotation techniques."
  ];

  const extracurricularsList = [
    "<strong>Founder and President of the Procrastinators' Club</strong><br>Organized last-minute study sessions; increased average grades by proving the effectiveness of adrenaline-fueled cramming.",
    "<strong>CEO of the Midnight Snack Distribution Network</strong><br>Managed logistics for nocturnal food deliveries in the dorm; optimized snack satisfaction rates among students.",
    "<strong>Captain of the Debate Team Against Myself</strong><br>Held solo debates to prepare for competitions; undefeated record with zero losses.",
    "<strong>Head Organizer of the Annual Invisible Art Exhibition</strong><br>Curated \"invisible\" artworks; event praised for its minimalist aesthetic and sold out (figuratively).",
    "<strong>President of the Society for the Appreciation of Unfinished Projects</strong><br>Hosted weekly meetings to start new projects; none completed, but creativity levels soared.",
    "<strong>Organizer of Disco for Introverts</strong><br>Hosted dance parties where participants enjoyed music individually.",
    "<strong>Lead Volunteer for the Wi-Fi Password Sharing for All Campaign</strong><br>Extended school's Wi-Fi range to nearby coffee shops; connected over 100 caffeine-dependent students.",
    "<strong>Founder of the Nap Time Awareness Movement</strong><br>Advocated for designated nap periods; improved overall school mood and alertness.",
    "<strong>Director of the Anti-Awkward Elevator Silence Initiative</strong><br>Installed custom elevator music composed by students; reduced uncomfortable rides by 100%.",
    "<strong>Pioneer of the Study on Caffeine-Induced Time Perception</strong><br>Consumed various caffeinated drinks to measure their effects on time management skills.",
    "<strong>Intern at the Institute of Imaginary Numbers</strong><br>Explored practical applications of imaginary numbers in everyday life; findings remain theoretical.",
    "<strong>Lead Scientist in the Browser Tab Overload Experiment</strong><br>Determined the maximum number of open tabs before system failure; results pending due to crash.",
    "<strong>Researcher in Quantum Homework Dynamics</strong><br>Investigated how homework size appears larger when observed; concluded it's relative to procrastination levels.",
    "<strong>Developer of the Auto-Response Essay Generator</strong><br>Created an AI to draft essays; increased free time while maintaining grades.",
    "<strong>Captain of the Competitive Sleeping Team</strong><br>Achieved record-breaking nap times; team motto: \"We dream big.\"",
    "<strong>World Record Holder in Speed Scrolling</strong><br>Scrolled through social media feeds at unprecedented speeds; thumb endurance unmatched.",
    "<strong>Master of the Ancient Art of Desk Doodling</strong><br>Transformed desks into canvases; work recognized as \"accidentally inspirational\" by peers.",
    "<strong>Champion of the One-Person Relay Race</strong><br>Completed all legs of a relay solo; set a school record by default.",
    "<strong>Professional Shower Singer</strong><br>Perfected acoustics and repertoire; audience limited but enthusiastic.",
    "<strong>Lead Analyst for Memes in Education Initiative</strong><br>Integrated memes into study guides; increased information retention through humor.",
    "<strong>Serial Club Attendee</strong><br>Joined every club to diversify interests; attendance records unmatched, participation levels variable.",
    "<strong>Volunteer Human Alarm Clock</strong><br>Woke up classmates for important exams; reliability rate of 99% (excluding Daylight Saving Time).",
    "<strong>Architect of the Perfect Paper Airplane</strong><br>Designed planes with optimal flight paths; dominated unofficial classroom competitions.",
    "<strong>Social Media Ghostwriter for Pets</strong><br>Managed Instagram accounts for friends' pets; increased follower counts through strategic hashtag use.",
    "<strong>Participated in the Great Homework Swap Meet</strong><br>Facilitated a barter system for assignments; improved overall completion rates.",
    "<strong>Senior Member of the Lunchtime Philosophers' Society</strong><br>Led deep discussions on life’s mysteries between bites; no conclusions reached, but minds expanded."
  ];

  const essaysList = [
    {
      title: "The Day My Alarm Clock Gave Up on Me",
      description: "I woke up 30 minutes late for the most important debate of my life. This essay explores the complex relationship between time management, caffeine dependence, and the adrenaline-fueled art of improvisation."
    },
    {
      title: "How I Negotiated Peace Between My Dog and My Roomba",
      description: "A deep dive into conflict resolution strategies, highlighting how I brokered a truce between an overeager golden retriever and a vacuum determined to clean everything in its path."
    },
    {
      title: "The Wi-Fi War: Growing Up in a Tech-Dependent Household",
      description: "In a home where bandwidth was scarcer than affection, I became a mediator, IT technician, and occasional saboteur, learning the value of resource allocation."
    },
    {
      title: "Why the Last Slice of Pizza Is Always Political",
      description: "A socio-economic analysis of familial resource sharing, as told through countless dinnertime debates over who deserved the last slice."
    },
    {
      title: "The Year I Mastered the Art of Faking Confidence",
      description: "From failing my first public speech to winning a Model UN award, I learned that self-doubt is just an accessory you don’t have to wear."
    },
    {
      title: "When the Microwave Betrayed Me",
      description: "An exploration of resilience, sparked by an incident where my popcorn burned, setting off a chain reaction that almost canceled my study group."
    },
    {
      title: "What Mario Kart Taught Me About Road Rage",
      description: "I’ve never had a driver’s license, but years of throwing banana peels at friends in Mario Kart taught me the ethics of competition and forgiveness."
    },
    {
      title: "How I Accidentally Became the Family Therapist",
      description: "When my parents started using me as their go-to referee, I learned the importance of active listening—and when to run away."
    },
    {
      title: "The Life-Changing Magic of Cleaning Out My Inbox",
      description: "3,000 unread emails taught me about procrastination, organization, and the occasional joy of stumbling upon forgotten scholarship opportunities."
    },
    {
      title: "Why I Banned Myself from Google Search During Finals",
      description: "I thought looking up 'how to ace exams' would help. Instead, it sent me down a rabbit hole of productivity apps and study tips I never used."
    },
    {
      title: "My Grandparents’ Recipe for Resilience: Dumplings and Discipline",
      description: "A heartfelt reflection on how cooking lessons with my grandparents taught me patience, problem-solving, and the importance of a perfectly pleated dumpling."
    },
    {
      title: "The Economics of Selling Candy Bars in 8th Grade",
      description: "From underpricing Snickers to understanding supply and demand, my brief candy empire showed me the sweet (and bitter) taste of entrepreneurship."
    },
    {
      title: "How a Tamagotchi Prepared Me for the Modern World",
      description: "The anxiety of keeping a virtual pet alive in middle school became my first lesson in responsibility, time management, and inevitable failure."
    },
    {
      title: "The Science Fair Project That Blew Up (Literally)",
      description: "A miscalculation with baking soda and vinegar turned into my most valuable lesson about preparation, humility, and owning up to mistakes."
    },
    {
      title: "The Curse of Being the ‘Tech Savvy’ Kid",
      description: "Being the unofficial IT department of my family taught me patience, troubleshooting, and how to explain 'turn it off and on again' to boomers."
    },
    {
      title: "Why I Never Trust GPS",
      description: "After a 30-minute detour during a robotics competition, I discovered the importance of analog solutions in a digital world."
    },
    {
      title: "The Year I Invented Homework Speedrunning",
      description: "Completing assignments in record time taught me efficiency, but it also reminded me that some things—like sleep—should never be skipped."
    },
    {
      title: "Learning Chemistry Through Cooking Disasters",
      description: "Burning a pot of rice was the turning point that made me realize science doesn’t just belong in the lab—it’s in every mistake I make in the kitchen."
    },
    {
      title: "How I Outsmarted the Vending Machine",
      description: "After it ate my last dollar, I devised an elaborate workaround, learning persistence, resourcefulness, and the limits of institutional bureaucracy."
    },
    {
      title: "The Art of Failing Spectacularly in PE Class",
      description: "From falling off the rope climb to accidentally hitting myself with a dodgeball, I learned that effort—and humor—can be more important than success."
    }
  ];

  // Helper functions
  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomItems(array, min, max) {
    const count = getRandomInt(min, max);
    const items = [];
    const copy = array.slice();
    for (let i = 0; i < count && copy.length > 0; i++) {
      const index = Math.floor(Math.random() * copy.length);
      items.push(copy.splice(index, 1)[0]);
    }
    return items;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate random data
  const gender = randomItem(genders);
  const ethnicity = randomItem(ethnicities);
  const schoolType = randomItem(schoolTypes);
  const sexualOrientation = randomItem(sexualOrientations);
  const firstGenStatus = randomItem(firstGenStatuses);
  const nationality = randomItem(nationalities);
  const intendedMajors = randomItems(intendedMajorsList, 1, 2);
  const notableTags = randomItems(notableTagsList, 1, 2);

  const satMath = getRandomInt(65, 80) * 10;
  const satRW = getRandomInt(65, 80) * 10;
  const satTotal = satMath + satRW;

  const toeflR = getRandomInt(25, 30);
  const toeflL = getRandomInt(25, 30);
  const toeflS = getRandomInt(25, 30);
  const toeflW = getRandomInt(25, 30);
  const toeflTotal = toeflR + toeflL + toeflS + toeflW;

  const apSubjects = [
    "Physics C: Mechanics",
    "Physics C: Electricity and Magnetism",
    "Calculus AB",
    "Calculus BC",
    "Chemistry",
    "Biology",
    "Environmental Science",
    "Computer Science A",
    "Computer Science Principles",
    "Statistics",
    "Macroeconomics",
    "Microeconomics",
    "Psychology",
    "Human Geography",
    "World History: Modern",
    "United States History",
    "European History",
    "Government and Politics: United States",
    "Government and Politics: Comparative",
    "English Language and Composition",
    "English Literature and Composition",
    "Spanish Language and Culture",
    "Spanish Literature and Culture",
    "French Language and Culture",
    "German Language and Culture",
    "Italian Language and Culture",
    "Latin",
    "Chinese Language and Culture",
    "Japanese Language and Culture",
    "Art and Design: Drawing",
    "Art and Design: 2D Design",
    "Art and Design: 3D Design",
    "Music Theory"
  ];

  const apScores = randomItems(apSubjects, 1, 5).map(subject => {
    const score = getRandomInt(4, 5);
    return `${subject} (${score})`;
  });

  const ibScore = getRandomInt(38, 45); // 随机生成一个 38-45 的 IB 成绩

  const selectedAwards = randomItems(awardsList, 2, 2);
  const selectedExtracurriculars = randomItems(extracurricularsList, 3, 3);
  const randomEssay = randomItem(essaysList);

  // 在生成的内容中添加唯一的 ID
  const backgroundDiv = document.getElementById('background');
  backgroundDiv.innerHTML = `
    <h2>Background</h2>
    <p><strong>Gender:</strong> <span id="gender"></span></p>
    <p><strong>Ethnicity:</strong> <span id="ethnicity"></span></p>
    <p><strong>School Type:</strong> <span id="schoolType"></span></p>
    <p><strong>Sexual Orientation:</strong> <span id="sexualOrientation"></span></p>
    <p><strong>First-Gen Status:</strong> <span id="firstGenStatus"></span></p>
    <p><strong>Nationality:</strong> <span id="nationality"></span></p>
    <p><strong>Intended Majors:</strong> <span id="intendedMajors"></span></p>
    <p><strong>Notable Tags:</strong> <span id="notableTags"></span></p>
  `;

  const academicStatsDiv = document.getElementById('academic-stats');
  academicStatsDiv.innerHTML = `
    <h2>Academic Stats</h2>
    <p><strong>SAT:</strong> <span id="satTotal"></span> (Math: <span id="satMath"></span>, R/W: <span id="satRW"></span>)</p>
    <p><strong>TOEFL:</strong> <span id="toeflTotal"></span> (R: <span id="toeflR"></span>, L: <span id="toeflL"></span>, S: <span id="toeflS"></span>, W: <span id="toeflW"></span>)</p>
    <p><strong>AP Scores:</strong> <span id="apScores"></span></p>
    <p><strong>IB Score:</strong> <span id="ibScore"></span> out of 45</p>
  `;

  const awardsDiv = document.getElementById('awards');
  awardsDiv.innerHTML = `
    <h2>Awards</h2>
    ${selectedAwards.map((award, index) => `<p class="award" id="award${index}"></p>`).join('')}
  `;

  const extracurricularsDiv = document.getElementById('extracurriculars');
  extracurricularsDiv.innerHTML = `
    <h2>Extracurriculars</h2>
    ${selectedExtracurriculars.map((activity, index) => `<p class="extracurricular" id="extracurricular${index}"></p>`).join('')}
  `;

  const essaysDiv = document.getElementById('essays');
  essaysDiv.innerHTML = `
    <h2>Essays</h2>
    <p><strong>Personal Statement:</strong> <em id="essayTitle"></em> <br> <span id="essayDescription"></span></p>
  `;

  gsap.registerPlugin(TextPlugin);
  
  const typingDuration = 1;
  
  gsap.to("#gender", {text: gender, duration: typingDuration, ease: "none"});
  gsap.to("#ethnicity", {text: ethnicity, duration: typingDuration, ease: "none"});
  gsap.to("#schoolType", {text: schoolType, duration: typingDuration, ease: "none"});
  gsap.to("#sexualOrientation", {text: sexualOrientation, duration: typingDuration, ease: "none"});
  gsap.to("#firstGenStatus", {text: firstGenStatus, duration: typingDuration, ease: "none"});
  gsap.to("#nationality", {text: nationality, duration: typingDuration, ease: "none"});
  gsap.to("#intendedMajors", {text: intendedMajors.join("; "), duration: typingDuration, ease: "none"});
  gsap.to("#notableTags", {text: notableTags.map(tag => `${tag}`).join("; "), duration: typingDuration, ease: "none"});
  gsap.to("#satTotal", {text: satTotal, duration: typingDuration, ease: "none"});
  gsap.to("#satMath", {text: satMath, duration: typingDuration, ease: "none"});
  gsap.to("#satRW", {text: satRW, duration: typingDuration, ease: "none"});
  gsap.to("#toeflTotal", {text: toeflTotal, duration: typingDuration, ease: "none"});
  gsap.to("#toeflR", {text: toeflR, duration: typingDuration, ease: "none"});
  gsap.to("#toeflL", {text: toeflL, duration: typingDuration, ease: "none"});
  gsap.to("#toeflS", {text: toeflS, duration: typingDuration, ease: "none"});
  gsap.to("#toeflW", {text: toeflW, duration: typingDuration, ease: "none"});
  gsap.to("#apScores", {text: apScores.join(", "), duration: typingDuration, ease: "none"});
  gsap.to("#ibScore", {text: ibScore, duration: typingDuration, ease: "none"});
  selectedAwards.forEach((award, index) => {
    gsap.to(`#award${index}`, {text: award, duration: typingDuration, ease: "none"});
  });
  selectedExtracurriculars.forEach((activity, index) => {
    gsap.to(`#extracurricular${index}`, {text: activity, duration: typingDuration, ease: "none"});
  });
  gsap.to("#essayTitle", {text: randomEssay.title, duration: typingDuration, ease: "none"});
  gsap.to("#essayDescription", {text: randomEssay.description, duration: typingDuration, ease: "none"});
}

function updateStaticText() {
  const textElements = document.querySelectorAll('.scrolling-text .text'); // 获取所有文字元素
  if (textElements.length === 0) return;

  const textLength = 80;

  textElements.forEach(textElement => {
    const container = textElement.parentElement; // 获取文字的容器
    const isVertical = container.classList.contains('left') || container.classList.contains('right'); // 判断方向

    const containerLength = isVertical ? container.offsetHeight : container.offsetWidth; // 测量容器长度

    // 打印调试信息
    console.log(`Text: ${textElement.textContent.trim()}`);
    console.log(`Text Length: ${textLength}`);
    console.log(`Container Length: ${containerLength}`);

    const repeatCount = Math.ceil(containerLength / textLength) + 1; // 计算重复次数

    const originalText = textElement.textContent.trim() + ' '; // 原始文字加空格
    textElement.textContent = originalText.repeat(repeatCount); // 重复文字直到填满

    // 打印调试信息
    console.log(`Repeat Count: ${repeatCount}`);
    console.log(`Final Text: ${textElement.textContent}`);
  });
}

window.addEventListener('load', startFlickering);
window.addEventListener('load', updateStaticText);