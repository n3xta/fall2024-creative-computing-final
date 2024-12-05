let bodyPose;

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

  video = createCapture(VIDEO);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  canvases.forEach(canvas => canvas.draw(video, poses));
}

// Add code to generate the report
function generateRandomReport() {
  // Define preset data arrays
  const genders = ["Non-Binary"];
  const ethnicities = [
    "Asian", "Asian", "Asian", "Asian", "Asian", "Asian", "Asian", "Asian", "Asian", "Asian", 
    "Hispanic", "Hispanic", "Hispanic", "Hispanic", "Hispanic", 
    "Caucasian", "Caucasian", "Caucasian", "Caucasian", "Caucasian", 
    "African American", "African American", "African American", 
    "Native American", 
    "Pacific Islander", 
    "Middle Eastern", 
    "Mixed Race", 
    "Other"
  ];
  const schoolTypes = ["Public School", "Private School", "IB School", "Boarding School"];
  const sexualOrientations = ["Asexual", "Straight", "Bisexual"];
  const firstGenStatuses = ["Yes", "No"];
  const nationalities = [
    "USA", "USA", "USA", "USA", "USA", "USA", "USA", "USA", "USA", "USA", 
    "China", "China", "China", "China", "China", "China", "China", "China", 
    "India", "India", "India", "India", "India", "India", "India", "India", 
    "Canada", "Canada", "Canada", "Canada", "Canada", 
    "UK", "UK", "UK", "UK", "UK", 
    "Germany", "Germany", "Germany", "Germany", 
    "France", "France", "France", "France", 
    "Australia", "Australia", "Australia", 
    "Japan", "Japan", "Japan", 
    "South Korea", "South Korea", "South Korea", 
    "Brazil",
    "Mexico",
    "Russia",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Switzerland", 
    "Norway",
    "Denmark",
    "Finland", 
    "New Zealand", 
    "South Africa",
    "Argentina",
    "Chile",
    "Colombia",
    "Peru", 
    "Venezuela",
    "Saudi Arabia", 
    "United Arab Emirates",
    "Turkey", 
    "Israel", 
    "Egypt",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Vietnam",
    "Thailand",
    "Malaysia",
    "Singapore",
    "Indonesia",
    "Philippines",
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
    "Fieldwork Seminar",
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
    "Future Nobel Prize winner in procrastination",
    "Self-taught AI overlord (in progress)",
    "Professional physics nerd with a side hustle in overthinking",
    "First-generation student of Google and YouTube tutorials",
    "Mathlete turned sleep-deprived problem-set warrior",
    "Award-winning expert in finding free Wi-Fi spots",
    "Serial extracurricular joiner with zero free time",
    "Accidental linguist (thanks to Duolingo guilt notifications)",
    "Ambassador of chaos during group projects",
    "High school overachiever, part-time existential crisis manager"
  ];

  const awardsList = [
    "Lunch-Time Homework Champion (3 Years Running) – Known for completing assignments with one hand while eating with the other.",
    "Regional Procrastination Recovery Award – Awarded for submitting a 10-page essay 30 seconds before the deadline.",
    "Netflix Multi-Tasking Scholar – Simultaneously binge-watched 12 seasons of a show while studying for finals.",
    "National Bed-Head Physics Olympiad Finalist – Scored top marks while attending via Zoom from bed.",
    "Midnight Snack Productivity Award – Solved three physics problems during a 2 a.m. kitchen run.",
    "Advanced Bathroom Break Debater – Crafted and won arguments in under five minutes between classes.",
    "3x Spreadsheet Formatting State Champion – Known for perfectly aligned cells and color-coded glory.",
    "Google Search Olympian (Silver Medal) – Found obscure research papers faster than librarians.",
    "Lofi Study Vibes International Competitor – Represented the nation in chill beats while grinding out problem sets.",
    "\"Ctrl+Z Savior Award\" – Recovered a deleted essay seconds before submission.",
    "Elite Email Refresh League MVP – Achieved 500 refreshes per minute during college application season.",
    "Ergonomic Desk Setup Engineer – Optimized workspace to maximize back pain and mental breakdown efficiency.",
    "Caffeine Chemistry Bowl (Bronze) – Perfected the molecular ratio for staying awake during finals.",
    "AI-Generated Response Coordinator – Outsourced 15 discussion board posts to ChatGPT without detection.",
    "Honors in Nap-Time Microeconomics – Solved a market equilibrium question mid-power nap.",
    "Regional Tab-Closing Marathoner (Platinum) – Successfully closed 200+ tabs after a six-hour study session.",
    "National Calculator Speed-Input Medalist – Entered integrals with zero typos at record-breaking speed.",
    "International Binder Organization Laureate – Recognized for color-coded tabs and flawless annotation techniques."
  ];

  const extracurricularsList = [
    "Founder and President of the Procrastinators' Club\nOrganized last-minute study sessions; increased average grades by proving the effectiveness of adrenaline-fueled cramming.",
    "CEO of the Midnight Snack Distribution Network\nManaged logistics for nocturnal food deliveries in the dorm; optimized snack satisfaction rates among students.",
    "Captain of the Debate Team Against Myself\nHeld solo debates to prepare for competitions; undefeated record with zero losses.",
    "Head Organizer of the Annual Invisible Art Exhibition\nCurated \"invisible\" artworks; event praised for its minimalist aesthetic and sold out (figuratively).",
    "President of the Society for the Appreciation of Unfinished Projects\nHosted weekly meetings to start new projects; none completed, but creativity levels soared.",
    "Organizer of Disco for Introverts\nHosted dance parties where participants enjoyed music individually.",
    "Lead Volunteer for the Wi-Fi Password Sharing for All Campaign\nExtended school's Wi-Fi range to nearby coffee shops; connected over 100 caffeine-dependent students.",
    "Founder of the Nap Time Awareness Movement\nAdvocated for designated nap periods; improved overall school mood and alertness.",
    "Director of the Anti-Awkward Elevator Silence Initiative\nInstalled custom elevator music composed by students; reduced uncomfortable rides by 100%.",
    "Pioneer of the Study on Caffeine-Induced Time Perception\nConsumed various caffeinated drinks to measure their effects on time management skills.",
    "Intern at the Institute of Imaginary Numbers\nExplored practical applications of imaginary numbers in everyday life; findings remain theoretical.",
    "Lead Scientist in the Browser Tab Overload Experiment\nDetermined the maximum number of open tabs before system failure; results pending due to crash.",
    "Researcher in Quantum Homework Dynamics\nInvestigated how homework size appears larger when observed; concluded it's relative to procrastination levels.",
    "Developer of the Auto-Response Essay Generator\nCreated an AI to draft essays; increased free time while maintaining grades.",
    "Captain of the Competitive Sleeping Team\nAchieved record-breaking nap times; team motto: \"We dream big.\"",
    "World Record Holder in Speed Scrolling\nScrolled through social media feeds at unprecedented speeds; thumb endurance unmatched.",
    "Master of the Ancient Art of Desk Doodling\nTransformed desks into canvases; work recognized as \"accidentally inspirational\" by peers.",
    "Champion of the One-Person Relay Race\nCompleted all legs of a relay solo; set a school record by default.",
    "Professional Shower Singer\nPerfected acoustics and repertoire; audience limited but enthusiastic.",
    "Lead Analyst for Memes in Education Initiative\nIntegrated memes into study guides; increased information retention through humor.",
    "Serial Club Attendee\nJoined every club to diversify interests; attendance records unmatched, participation levels variable.",
    "Volunteer Human Alarm Clock\nWoke up classmates for important exams; reliability rate of 99% (excluding Daylight Saving Time).",
    "Architect of the Perfect Paper Airplane\nDesigned planes with optimal flight paths; dominated unofficial classroom competitions.",
    "Social Media Ghostwriter for Pets\nManaged Instagram accounts for friends' pets; increased follower counts through strategic hashtag use.",
    "Participated in the Great Homework Swap Meet\nFacilitated a barter system for assignments; improved overall completion rates.",
    "Senior Member of the Lunchtime Philosophers' Society\nLed deep discussions on life’s mysteries between bites; no conclusions reached, but minds expanded."
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
  const notableTags = randomItems(notableTagsList, 1, 3);

  const satMath = getRandomInt(600, 800);
  const satRW = getRandomInt(600, 800);
  const satTotal = satMath + satRW;

  const toeflR = getRandomInt(20, 30);
  const toeflL = getRandomInt(20, 30);
  const toeflS = getRandomInt(20, 30);
  const toeflW = getRandomInt(20, 30);
  const toeflTotal = toeflR + toeflL + toeflS + toeflW;

  const apSubjects = ["Physics C", "Calculus BC", "Chemistry"];
  const apScores = apSubjects.map(subject => {
    const score = getRandomInt(3, 5);
    return `${subject} (${score})`;
  });

  const selectedAwards = randomItems(awardsList, 2, 3);
  const selectedExtracurriculars = randomItems(extracurricularsList, 2, 3);

  // Populate each section individually
  const backgroundDiv = document.getElementById('background');
  backgroundDiv.innerHTML = `
    <h2>Background</h2>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Ethnicity:</strong> ${ethnicity}</p>
    <p><strong>School Type:</strong> ${schoolType}</p>
    <p><strong>Sexual Orientation:</strong> ${sexualOrientation}</p>
    <p><strong>First-Gen Status:</strong> ${firstGenStatus}</p>
    <p><strong>Nationality:</strong> ${nationality}</p>
    <p><strong>Intended Majors:</strong> ${intendedMajors.join(", ")}</p>
    <p><strong>Notable Tags:</strong> ${notableTags.map(tag => `"${tag}"`).join(", ")}</p>
  `;

  const academicStatsDiv = document.getElementById('academic-stats');
  academicStatsDiv.innerHTML = `
    <h2>Academic Stats</h2>
    <p><strong>SAT:</strong> ${satTotal} (Math: ${satMath}, R/W: ${satRW})</p>
    <p><strong>TOEFL:</strong> ${toeflTotal} (R: ${toeflR}, L: ${toeflL}, S: ${toeflS}, W: ${toeflW})</p>
    <p><strong>AP Scores:</strong> ${apScores.join(", ")}</p>
  `;

  const awardsDiv = document.getElementById('awards');
  awardsDiv.innerHTML = `
    <h2>Awards</h2>
    <ul>
      ${selectedAwards.map(award => `<li>${award}</li>`).join('')}
    </ul>
  `;

  const extracurricularsDiv = document.getElementById('extracurriculars');
  extracurricularsDiv.innerHTML = `
    <h2>Extracurriculars</h2>
    <ol>
      ${selectedExtracurriculars.map(activity => `<li><strong>${activity}</strong></li>`).join('')}
    </ol>
  `;

  const essaysDiv = document.getElementById('essays');
  essaysDiv.innerHTML = `
    <h2>Essays</h2>
    <p><strong>Personal Statement:</strong> "Compared rebuilding a car to rebuilding myself after failure; includes metaphors on oil changes and emotional growth."</p>
  `;
}

function startFlickering() {
  const chanceElement = document.getElementById('chance-percentage');
  setInterval(() => {
    const randomPercentage = Math.floor(Math.random() * 100) + 1;
    chanceElement.textContent = `${randomPercentage}%`;
  }, 99);
}

// Generate the report after the page loads
window.addEventListener('load', generateRandomReport);
window.addEventListener('load', startFlickering);
