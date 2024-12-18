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

      if (keypoint && keypoint.confidence > 0.95) {
        const x = keypoint.x;
        const y = keypoint.y;
        const cropWidth = 30; // 裁剪区域的宽度
        const cropHeight = 30; // 裁剪区域的高度

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

  if (!rightEyePose || rightEyePose.confidence <= 0.9) {
    clearReport();
    reportGenerated = false;
    chanceElement.textContent = "??";
    chanceElement.classList.remove('flicker'); 
  } else if (!reportGenerated) {
    generateRandomReport();
    reportGenerated = true; 
    chanceElement.classList.add('flicker'); 
    startFlickering(); 
    // setTimeout(() => {
    //   if (reportGenerated == true) {
    //     console.log("audience is still here");
    //   }
    // }, 10000);
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
    "Family vacations included impromptu history lectures",
    "Raised by a family that considers 'because I said so' a valid argument",
    "Born into a family where multitasking is a survival skill",
    "The only quiet one in a family of karaoke enthusiasts",
    "Childhood consisted of translating tech instructions for my parents",
    "Grew up in a home where the Wi-Fi password was more sacred than family recipes",
    "Parents considered ‘organized chaos’ a legitimate parenting strategy",
    "Spent childhood sharing a room with my grandparents—and their opinions",
    "Middle child who perfected diplomacy through sibling peace treaties",
    "Youngest child, with a PhD in inheriting blame",
    "Raised by parents who think every problem is solved by less phone usage",
    "Born bilingual, but my accent reveals which language I prefer",
    "Inherited my dad’s curiosity and my mom’s ability to overthink it",
    "Grew up in a town where everyone knows your name—and your business",
    "One of five left-handed people in a right-handed family",
    "Naturally gifted in sarcasm, much to my teachers' dismay",
    "Born into a climate where heatwaves are considered 'mild weather'",
    "Old soul trapped in a generation obsessed with memes",
    "A city kid who learned to adapt to small-town life—barely",
    "Third-culture kid who answers ‘Where are you from?’ with ‘It’s complicated’",
    "Inherited a talent for storytelling, but forgot the part about brevity",
    "Born with an unshakable need to argue with signs labeled 'Do Not Touch'",
    "Possesses an innate ability to trip on flat surfaces",
    "Born with a knack for overthinking simple questions like 'How are you?'",
    "Possesses a resting skeptical face that people call ‘thoughtful’",
    "Naturally gifted in turning hobbies into full-blown obsessions",
    "Equipped with a perpetual curiosity that often gets me into trouble",
    "Born with the ability to remember obscure trivia and forget names",
    "Possesses a poker face so bad my family banned me from board games",
    "A perfectionist born into a world that doesn't cooperate",
    "Born with a voice that makes every comment sound sarcastic",
    "First-generation student born into a family of unsolicited life coaches",
    "The only kid on the block whose ‘bike rides’ included trips to the library",
    "Moved so often that ‘home’ is just wherever my books are",
    "Grew up in a household where ‘close enough’ was a family motto",
    "Born in the wrong decade, according to my music playlist",
    "The only kid in class who thought recess was for reading",
    "Raised in a family where road trips doubled as lecture series",
    "Survived childhood summers as the mosquito buffet",
    "Grew up in a place where everyone waves at strangers—except me",
    "Born in a neighborhood where ‘going viral’ meant an actual flu season",
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
    "<strong>International Binder Organization Laureate</strong> <br>Recognized for color-coded tabs and flawless annotation techniques.",
    "<strong>Ctrl+Z Savior Award</strong><br>Recovered an essay deleted 10 seconds before submission; recognized for quick reflexes.",
    "<strong>World Champion of \"Forgot to Hit Save\" Resilience</strong><br>Survived a catastrophic Word crash with minimal emotional breakdown.",
    "<strong>High-Speed Copy-Paste Efficiency Award</strong><br>Set a school record for copying group project slides 10 minutes before class.",
    "<strong>Golden Snooze Button Medal</strong><br>Perfected the art of snoozing alarms to avoid any actual waking.",
    "<strong>Regional Passive-Aggressive Email Writer Award</strong><br>Honored for sending perfectly phrased \"per my last email\" responses.",
    "<strong>Textbook Hoarder Excellence Award</strong><br>Carried 30 pounds of books all semester; used only one of them.",
    "<strong>World’s Quietest Keyboard Hero</strong><br>Mastered the ability to type furiously without disrupting classmates during exams.",
    "<strong>National Caffeine Chemistry Bowl Champion</strong><br>Calculated the optimal espresso-to-sleep ratio during finals week.",
    "<strong>Unstoppable Screenshot Taker Medal</strong><br>Captured over 1,000 slides in virtual classes; won \"Most Organized Folders\" title.",
    "<strong>Accidental Mute Button Gold</strong><br>Spent 10 minutes on a brilliant monologue while muted in a Zoom call.",
    "<strong>Most Strategic Snack Consumption Award</strong><br>Timed snack openings perfectly to avoid teacher detection.",
    "<strong>Pro-Level Background Blur Innovator</strong><br>Pioneered new methods for making messy rooms disappear on Zoom.",
    "<strong>Advanced Chrome Tab Overload Survival Medal</strong><br>Successfully operated with 100+ tabs open without a single crash.",
    "<strong>School-Wide Late-Night Google Master</strong><br>Discovered obscure articles at 3 a.m. for a history essay due by 8.",
    "<strong>Champion of \"Forgot My Calculator\" Mental Math</strong><br>Solved an entire math test without essential tools; hailed as a genius.",
    "<strong>Speedy Virtual Breakout Room Relocator</strong><br>Managed to \"accidentally\" rejoin the main room within seconds.",
    "<strong>Junior Varsity Wi-Fi Signal Detector</strong><br>Mapped the best places on campus for flawless TikTok uploads.",
    "<strong>Top-Tier Lecture Video Speedrunner</strong><br>Completed an entire semester’s worth of lectures at 2x speed in one night.",
    "<strong>Digital Folder Over-Organization Award</strong><br>Spent more time organizing files than actually studying from them.",
    "<strong>Fastest Charger Borrowing Relay Champion</strong><br>Secured a phone charger in under 30 seconds mid-lecture.",
    "<strong>National Awkward Participation Award</strong><br>Asked a question in class, then immediately regretted it.",
    "<strong>Champion of \"I Thought This Was Due Tomorrow\" Recoveries</strong><br>Turned in a full essay written 20 minutes before class.",
    "<strong>World Record Holder in Speed-Email Composition</strong><br>Drafted and sent an apology email in 12 seconds flat.",
    "<strong>Procrastination Jenga Gold Medalist</strong><br>Balanced a pile of incomplete assignments until the last possible moment.",
    "<strong>Zoom Call Avatar Style Award</strong><br>Used the perfect profile picture to maintain professional vibes while absent.",
    "<strong>Extreme Desk Doodler Recognition</strong><br>Covered every square inch of a desk in intricate, unnecessary art.",
    "<strong>Platinum Wi-Fi Password Decoder</strong><br>Guessed over 10 different Wi-Fi passwords successfully during a single school day.",
    "<strong>Most Efficient Copywriter in Group Chats</strong><br>Perfectly summarized 5-page instructions into one-sentence replies.",
    "<strong>Ultimate Whiteboard Marker Juggler</strong><br>Simultaneously used three different colors to make notes visually overwhelming.",
    "<strong>Accidental Screenshot Genius</strong><br>Saved critical moments in group projects through random button pressing.",
    "<strong>Elite Tab-Closer Champion</strong><br>Closed 200+ browser tabs in under a minute, causing minimal emotional damage.",
    "<strong>Legendary Mute-While-Chewing Operator</strong><br>Awarded for maintaining professionalism while eating loudly on calls.",
    "<strong>\"Where’s the Link?\" Super Sleuth Award</strong><br>Found obscure Zoom links faster than the meeting’s host.",
    "<strong>Dynamic Chair Spin Performer</strong><br>Perfected dramatic spins during virtual class discussions.",
    "<strong>World-Class Typing Noise Coordinator</strong><br>Synchronized furious typing with lecture pauses for comedic timing.",
    "<strong>Undercover Class Notes Exporter</strong><br>Secretly emailed notes to 15 classmates during a pop quiz.",
    "<strong>Strategic Participation Timing Champion</strong><br>Raised hand only when the bell was about to ring.",
    "<strong>Elite Overthinking Gold Medalist</strong><br>Spent 3 hours rephrasing a single text to sound casual.",
    "<strong>Virtual Background Curator Extraordinaire</strong><br>Changed backgrounds mid-lecture for comedic and dramatic effect.",
    "<strong>Pop Quiz Guesswork Champion</strong><br>Awarded for a 90% success rate on educated guesses.",
    "<strong>Class Group Chat Moderator of the Year</strong><br>Ensured memes and actual study resources coexisted harmoniously.",
    "<strong>Reigning Champion of the \"Accidentally Sent Too Early\" Texts</strong><br>Won national recognition for masterfully recovering from blunders.",
    "<strong>BeReal Timing Champion</strong><br>Posted every BeReal within 10 seconds of notification; recognized for authenticity under pressure.",
    "<strong>Discord Server Management Excellence Award</strong><br>Created and moderated a 500-member study group; banned 23 trolls with precision.",
    "<strong>Top Spotify Wrapped Strategist</strong><br>Carefully curated playlists to ensure \"intellectual\" top artists; earned 200+ playlist followers.",
    "<strong>King/Queen of the Google Classroom Refresh</strong><br>Refreshed the page 100 times a day to check for surprise assignments.",
    "<strong>TikTok Trend Analyzer of the Year</strong><br>Accurately predicted the lifespan of 10 viral trends; coined \"Too Late to Post\" syndrome.",
    "<strong>Master of the Silent Phone Check</strong><br>Flawlessly responded to texts during class without getting caught; inducted into the Hall of Stealth.",
    "<strong>Champion of the Dual Monitor Gaming League</strong><br>Simultaneously attended virtual class while ranking up in Valorant; maintained a GPA above 3.5.",
    "<strong>World Record Holder in \"Forgot to Turn It In\" Recovery</strong><br>Uploaded late Google Classroom submissions faster than teachers could notice.",
    "<strong>Snapchat Streak Preservation Award</strong><br>Maintained a 1,000-day streak through power outages, time zone shifts, and poor Wi-Fi.",
    "<strong>Advanced AirPods Pro Escape Artist</strong><br>Successfully wore AirPods during class without detection; recognized for strategic hoodie use.",
    "<strong>Master of 0.5x Speed Lecture Recovery</strong><br>Rewatched recorded lessons at half-speed to \"understand better\" after skipping them live.",
    "<strong>High-Speed Canva Project Designer</strong><br>Created aesthetically perfect group project slides in under 30 minutes.",
    "<strong>Regional Champion of \"Forgot to Unmute\" Excellence</strong><br>Delivered an entire presentation while muted; praised for visual aids.",
    "<strong>Most Creative Late Excuse Writer</strong><br>Submitted \"my Chromebook froze\" as a plausible excuse 17 times successfully.",
    "<strong>Professional Screenshot Recycler</strong><br>Reused old class notes for 5 different assignments; maximized academic efficiency.",
    "<strong>Fastest Quizlet Set Producer</strong><br>Created 200 flashcards overnight before every major exam; shared with 50 classmates.",
    "<strong>Genius Bar Wannabe Technician</strong><br>Fixed 15 classmates' Chromebooks; made $100 in \"thank you\" Starbucks gift cards.",
    "<strong>School-Wide Mental Health Day Advocate</strong><br>Rallied peers to petition for \"extra pajama day Fridays\" during exam weeks.",
    "<strong>Reddit Research Medalist</strong><br>Found obscure college admissions advice by browsing 3,000+ A2C subreddit posts.",
    "<strong>Ultimate \"Will You Sign My Yearbook?\" Organizer</strong><br>Collected over 150 signatures in the final week of senior year; recognized for charm."
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
    "<strong>Senior Member of the Lunchtime Philosophers' Society</strong><br>Led deep discussions on life’s mysteries between bites; no conclusions reached, but minds expanded.",
    "<strong>Master of Competitive Paper Clip Chains</strong><br>Set a school record for longest paperclip chain; recognized for ingenuity and persistence.",
    "<strong>Regional Champion of Textbook Tetris</strong><br>Perfected the art of fitting maximum books into a backpack; undefeated for 3 years.",
    "<strong>Chief Strategist of Cafeteria Line Efficiency</strong><br>Optimized lunch break logistics; reduced wait times by 30%.",
    "<strong>Inventor of the Silent Pencil Sharpener</strong><br>Designed noise-reducing mechanisms for quieter classroom environments.",
    "<strong>Self-Appointed Hallway Traffic Control Officer</strong><br>Improved flow by enforcing unwritten rules of walking etiquette.",
    "<strong>Founder of the Lost and Found Reclamation Society</strong><br>Organized monthly expeditions to reunite students with forgotten items.",
    "<strong>Captain of the Speed-Scrolling Social Media Team</strong><br>Achieved record-breaking scrolling speeds while multitasking.",
    "<strong>Champion of the National Overthinkers Association</strong><br>Represented school in competitions to solve problems that didn't exist.",
    "<strong>Advanced Study in the Art of Last-Minute Presentations</strong><br>Delivered compelling slideshows created minutes before deadlines.",
    "<strong>Designer of the Unofficial School Hoodie</strong><br>Sold 200+ custom hoodies, boosting school pride while making a profit.",
    "<strong>Professional Desk Doodler</strong><br>Transformed desks into canvases; work recognized as \"accidentally inspirational\" by peers.",
    "<strong>Certified Binder Organization Consultant</strong><br>Developed systems to color-code tabs and optimize study efficiency.",
    "<strong>Solo Relay Race Champion</strong><br>Completed all legs of a relay race solo; shattered previous records.",
    "<strong>Official Study Playlist Curator</strong><br>Created collaborative playlists to maximize focus and reduce stress.",
    "<strong>Leader of the Unofficial Blanket Fort Builders Club</strong><br>Engineered elaborate structures; praised for architectural innovation.",
    "<strong>Senior Analyst for Meme Research</strong><br>Studied memes to improve cultural relevance in school events.",
    "<strong>Founder of the Campus Caffeine Economy</strong><br>Ran a coffee distribution network for stressed students during finals.",
    "<strong>Organizer of the First Annual Homework Swap Meet</strong><br>Facilitated a barter system for exchanging assignments; increased collaboration.",
    "<strong>Coordinator for Late Night Dorm Karaoke</strong><br>Improved participation rates and morale during stressful exam weeks.",
    "<strong>Ambassador of the Silent Cheer Squad</strong><br>Supported teams with discreet hand signals to minimize noise disruptions.",
    "<strong>Architect of the Perfect Paper Airplane</strong><br>Designed planes with optimal flight paths; dominated classroom competitions.",
    "<strong>Chief Debugger of the Unofficial Tech Support Team</strong><br>Solved over 200 tech problems for students and teachers.",
    "<strong>Lead Volunteer for the Recycle and Repurpose Club</strong><br>Created art installations from discarded materials to promote sustainability.",
    "<strong>Master of the Single-Sentence Essay Competition</strong><br>Perfected the art of conciseness; won 5 local awards.",
    "<strong>Inventor of the Binder Clip Stress Toy</strong><br>Developed a tool to help students manage test anxiety.",
    "<strong>Captain of the Synchronized Note-Taking Team</strong><br>Organized coordinated note-sharing during lectures; improved classwide retention.",
    "<strong>Champion of the Mid-Lecture Snack Relay</strong><br>Successfully passed snacks without disturbing the teacher.",
    "<strong>Pioneering Member of the Early Bus Line Waiters</strong><br>Perfected strategies to secure prime seating on morning commutes.",
    "<strong>President of the Midnight Google Scholars</strong><br>Organized late-night search parties for obscure academic references.",
    "<strong>Chief Strategist of the Yearbook Photo Hiding Team</strong><br>Developed camouflage tactics to avoid candid yearbook shots.",
    "<strong>Creator of the 3-Minute Breakfast Program</strong><br>Developed recipes to maximize sleep time and reduce prep time.",
    "<strong>Official Advocate for Post-Class Nap Rights</strong><br>Championed after-school nap breaks to improve productivity.",
    "<strong>Lead Analyst for Random Fact Sharing Club</strong><br>Introduced weekly \"Fun Fact Fridays\" to enhance general knowledge.",
    "<strong>Director of the \"Most Likely to Procrastinate\" Awards</strong><br>Recognized and celebrated peers' creative procrastination strategies.",
    "<strong>Organizer of the Weekly Whiteboard Doodle Competitions</strong><br>Turned study rooms into creative spaces; promoted stress relief.",
    "<strong>Coordinator for \"Laptop Charger Emergency Services\"</strong><br>Set up a charger-sharing network to prevent mid-class power outages.",
    "<strong>Founder of the \"Unofficial Campus Map Redesign Team\"</strong><br>Created a map optimizing walking routes between classes.",
    "<strong>President of the \"Last to Leave\" Study Group</strong><br>Led marathon study sessions that lasted until the library closed.",
    "<strong>Senior Member of the Hallway Philosophers</strong><br>Hosted deep discussions on life’s mysteries between classes.",
    "<strong>Founder and Sole Member of the AI Ethics Club</strong><br>Hosted debates on whether AI should write our essays; ironically used ChatGPT to draft the club charter.",
    "<strong>President of the Zoom Breakout Room Survivors Alliance</strong><br>Supported peers who endured awkward silences during online classes; developed strategies for graceful exits.",
    "<strong>Lead Organizer of the Annual \"Muted on Purpose\" Talent Show</strong><br>Celebrated the art of pretending to be muted to avoid answering questions in virtual classes.",
    "<strong>Captain of the Campus Wi-Fi Speed Testing Team</strong><br>Mapped every corner of the school for optimal TikTok uploading speeds; became a hero to all procrastinators.",
    "<strong>Chief Strategist for the \"Screenshot Everything\" Initiative</strong><br>Archived over 1,000 digital class notes, memes, and accidental professor emails; considered a historian for Gen Z.",
    "<strong>Ambassador for the \"Group Project Ghost Recon\" Task Force</strong><br>Tracked down unresponsive group members; achieved a 60% success rate in securing last-minute contributions.",
    "<strong>Coordinator of the \"Can I Borrow Your Charger?\" Network</strong><br>Operated an underground economy of USB-C cables; successfully avoided 43 mid-lecture laptop shutdowns.",
    "<strong>Inventor of the \"One Tab Only\" Challenge</strong><br>Encouraged students to minimize open browser tabs during study sessions; failed personally but inspired others.",
    "<strong>Chairperson of the \"Definitely Read the Terms & Conditions\" Club</strong><br>Analyzed 300 app privacy policies; declared \"ignorance is bliss\" as the official club motto.",
    "<strong>Co-Founder of the \"Slideshow Presentation Olympics\"</strong><br>Specialized in presenting poorly prepared slides with maximum confidence; awarded \"Best Improvised Pie Chart\" three years in a row.",
    "<strong>Head Curator of the \"Student Council for Memes\"</strong><br>Integrated memes into official emails; successfully boosted school newsletter engagement by 200%.",
    "<strong>Champion of the \"Who Can Finish Netflix First?\" League</strong><br>Binge-watched 10 shows during finals week; developed a spreadsheet ranking plot holes by absurdity.",
    "<strong>CEO of the \"Early Morning Alarm Snoozers\" Union</strong><br>Negotiated extended snooze time policies with parents and teachers; considered a trailblazer in procrastination advocacy.",
    "<strong>Founder of the \"Unnecessary Amazon Wishlist\" Initiative</strong><br>Compiled over 500 random items no one needed; surprisingly got 12 purchases during a school fundraiser.",
    "<strong>Captain of the \"Passive-Aggressive Email Composition Team\"</strong><br>Perfected the art of \"per my last email\" as a competitive sport; undefeated in regional tournaments.",
    "<strong>Lead Researcher for the \"Digital Background Aesthetic Optimization\" Study</strong><br>Spent 200 hours testing which Zoom backgrounds make students look the least stressed.",
    "<strong>Chair of the \"Ctrl + Z Advocacy Program\"</strong><br>Helped classmates recover from regrettable editing decisions; promoted keyboard shortcut literacy across the school.",
    "<strong>Professional Distracted Typist</strong><br>Specialized in typing gibberish during virtual lectures while nodding convincingly; considered a pioneer in the art of looking engaged.",
    "<strong>Architect of the \"Avoid Being Seen in Break Room\" Strategy</strong><br>Mapped escape routes to avoid small talk; published findings in the hallway gossip column.",
    "<strong>Founder of the \"Everything is Content\" Club</strong><br>Turned mundane moments into viral posts; monetized the cafeteria's spaghetti incident with 10k likes."  
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
    },
    {
      title: "The Great Charger Heist",
      description: "My journey to 'borrow' a stranger's charger during finals taught me the value of resourcefulness, negotiation, and the universal reliance on USB-C cables."
    },
    {
        title: "When My TikTok Algorithm Knew Me Better Than I Did",
        description: "An existential exploration of how a series of oddly specific memes revealed my deepest fears, dreams, and love of raccoon videos."
    },
    {
        title: "How I Became the Family’s Designated Zoom Tech Support",
        description: "In the chaos of virtual gatherings, I rose to power by fixing muted mics, sharing screens, and battling the dreaded 'You’re on mute.'"
    },
    {
        title: "Why I Chose to Protect My Snapchat Streak Over My GPA",
        description: "This essay reflects on a 1,000-day streak and the creative problem-solving required to maintain it during power outages and road trips."
    },
    {
        title: "The Day I Accidentally Sent the Wrong Attachment",
        description: "An unplanned email mishap taught me humility, triple-checking file names, and how to explain why my teacher received a meme instead of my essay."
    },
    {
        title: "Surviving the Hunger Games of Cafeteria Seating",
        description: "A strategic analysis of navigating high school social hierarchies through lunch tables, alliances, and a well-timed joke about pizza toppings."
    },
    {
        title: "What My Spotify Wrapped Says About My Personality",
        description: "An investigation into why 80% of my top songs were 'Lo-Fi Beats to Chill To' and what that says about my coping mechanisms."
    },
    {
        title: "The Wi-Fi Dead Zone Chronicles",
        description: "How finding a signal at school became a quest of epic proportions, complete with hidden corners, desperate prayers, and magical hotspots."
    },
    {
        title: "How I Outsmarted My BeReal Notification",
        description: "A deep dive into the ethical dilemmas of waiting for a better moment versus embracing chaotic authenticity."
    },
    {
        title: "When My Planner Became My Worst Enemy",
        description: "A reflection on over-scheduling myself into oblivion and learning that not everything needs a color-coded sticker system."
    },
    {
        title: "The Unwritten Rules of the Hallway Traffic Jam",
        description: "A sociological study of hallway dynamics, the art of sidestepping slow walkers, and the politics of holding the door."
    },
    {
        title: "How I Mastered the Art of Fake Nodding During Lectures",
        description: "From glazed-over eyes to perfectly timed 'mhmm's, this essay examines how I became a professional at looking engaged while zoning out."
    },
    {
        title: "The Midnight Battle of Me vs. the Essay Word Count",
        description: "My struggle to cut exactly 18 words at 2 a.m. taught me the delicate art of prioritizing quality over verbose rambling."
    },
    {
        title: "The Great Group Project Survival Guide",
        description: "A firsthand account of navigating group dynamics, from ghosting teammates to miracle deadlines, and still managing an A-minus."
    },
    {
        title: "How I Became the Unofficial School Vending Machine Whisperer",
        description: "Decoding snack probabilities and vending machine quirks, I became the go-to expert for strategic snack retrieval."
    },
    {
        title: "When I Accidentally Deleted My Entire Science Fair Project",
        description: "An exploration of data recovery, panic, and finding inspiration in disaster to submit something entirely new."
    },
    {
        title: "Why My Gaming Keyboard Was Louder Than My Ambition",
        description: "Reflections on being a late-night gamer, accidental unmuting during calls, and the thrill of competitive typing speed records."
    },
    {
        title: "How I Became a Master of Passive-Aggressive Google Docs Comments",
        description: "Perfecting the art of collaborative editing while leaving subtle hints like 'Interesting choice...' and 'Are you sure about this?'"
    },
    {
        title: "When I Mistook Ctrl+Z for a Life Undo Button",
        description: "This essay examines my unrealistic expectations for problem-solving and the limits of my favorite keyboard shortcut."
    },
    {
        title: "How I Discovered My Mom Is Better at Wordle Than Me",
        description: "A humbling journey of intergenerational rivalry, logic puzzles, and her unexpected knack for five-letter words."
    },
    {
        title: "The Art of Overthinking My Yearbook Quote",
        description: "My attempt to craft the perfect one-liner turned into a philosophical crisis about identity, humor, and impressing my future self."
    },
    {
        title: "When My Fidget Toy Became a Weapon of Mass Distraction",
        description: "How a simple spinning device led to a classroom uprising, accidental disruptions, and an unintentional lesson in physics."
    },
    {
        title: "How I Became the Campus Unofficial Locker Organizer",
        description: "Turning chaos into aesthetic perfection, I revolutionized locker layouts while unintentionally starting a decluttering movement."
    },
    {
        title: "The Day My Calculator Went Rogue",
        description: "A story of betrayal, miscalculated test answers, and the realization that even machines have their limits."
    },
    {
        title: "How My Prettiest Notes Became My Biggest Distraction",
        description: "This essay explores the double-edged sword of artistic study techniques and why 'Pinterest-worthy' isn't always efficient."
    },
    {
        title: "The Time I Found Inner Peace at a Bus Stop",
        description: "An unexpected encounter with a kind stranger and a shared Spotify playlist turned an ordinary wait into a profound moment."
    },
    {
        title: "Why My Closet Organizing System Is Smarter Than Me",
        description: "An overly elaborate system of hangers and color-coding taught me that not everything in life needs an algorithm."
    },
    {
        title: "How I Accidentally Joined the School Chess Team",
        description: "One mistaken 'yes' later, I found myself facing the school’s chess prodigy—and surprisingly holding my own."
    },
    {
        title: "The Time I Tried to Create the Perfect Hot Chocolate",
        description: "A culinary journey of marshmallow ratios, milk frothing techniques, and the bittersweet lessons of overcomplicating simple joys."
    },
    {
        title: "How I Outsmarted the Smart Thermostat",
        description: "A battle of wits with my home's thermostat revealed the unexpected depth of my competitive streak."
    },
    {
        title: "When I Tried to Go 24 Hours Without My Phone",
        description: "An introspective look at why even a single day offline felt like a journey through uncharted territory."
    },
    {
        title: "Why I Considered Submitting My Doodles as AP Art",
        description: "An exploration of why margins filled with dragons and stick-figure comics are just as valid as still-life paintings."
    },
    {
        title: "The Science of Sitting in the Perfect Seat",
        description: "From strategic angles to classroom politics, this essay uncovers the unspoken rules of prime seating arrangements."
    },
    {
        title: "When I Accidentally Became the School's TikTok Icon",
        description: "A 10-second video of my epic trip-and-fall turned into an unexpected lesson in humility and going viral."
    },
    {
        title: "Why I Brought a Spare Shoe to Class Every Day",
        description: "A reflection on a wardrobe mishap turned personal policy, and the unexpected conversations it started."
    },
    {
        title: "How I Became the Master of Exam Day Rituals",
        description: "This essay explores the psychology behind lucky socks, special pencils, and the magical power of routine."
    },
    {
        title: "The Day I Won the Class Group Chat Roast Battle",
        description: "An unexpectedly fiery exchange taught me the value of wit, timing, and knowing when to stop typing."
    },
    {
      title: "How I Accidentally Turned My Sketchbook Into a Scrapbook",
      description: "What began as a collection of figure studies evolved into a chaotic collage of ticket stubs, doodles, and coffee stains. This essay explores the blurred lines between intention and experimentation."
  },
  {
      title: "The Day My Painting Fell at the School Exhibit",
      description: "In the chaos of an unsteady easel, I learned that even failure can be framed as performance art."
  },
  {
      title: "Why I Can’t Look at Van Gogh Without Thinking About That One TikTok",
      description: "A reflection on how meme culture reshapes our engagement with classical art and whether that’s a bad thing."
  },
  {
      title: "The Life-Changing Magic of Organizing My Art Supplies",
      description: "This essay explores how sorting pencils by hardness taught me that creativity thrives in order—or at least controlled chaos."
  },
  {
      title: "How a Single Line Drawing Changed My Perspective",
      description: "A doodle on the back of my hand during a lecture led to a weeks-long exploration of minimalism and constraint."
  },
  {
      title: "The Time I Accidentally Set Off the Fire Alarm in Ceramics Class",
      description: "A kiln mishap taught me about temperature control, resilience, and how to apologize to the entire school."
  },
  {
      title: "Why I Refused to Erase My Mistakes",
      description: "This essay reflects on my journey from perfectionism to embracing smudges, crossed-out lines, and unintentional beauty."
  },
  {
      title: "What Drawing Hands Taught Me About Patience",
      description: "An exploration of why hands are the bane of every art student’s existence and how I learned to embrace the challenge."
  },
  {
      title: "When I Tried to Make a Sculpture Out of Broken Pens",
      description: "What started as a statement on waste turned into a meditation on limits, persistence, and super glue."
  },
  {
      title: "The Time I Fell Asleep in a Life Drawing Class",
      description: "A poorly timed nap during a session taught me about exhaustion, grace, and the art of bouncing back."
  },
  {
      title: "How My iPad Pro Became My Favorite Canvas",
      description: "An essay on transitioning from traditional to digital mediums and the surprising things I missed about real paint."
  },
  {
      title: "The Great Debate Over \"What Counts as Art\"",
      description: "After defending my performance piece featuring grocery bags, I learned the beauty of standing by unconventional ideas."
  },
  {
      title: "When I Ruined My Best Painting by Overworking It",
      description: "A lesson in letting go and knowing when enough is enough, as told through the slow demise of a watercolor landscape."
  },
  {
      title: "The Day I Became the Designated Critique Whisperer",
      description: "Why being the friend who knows how to 'say something constructive' turned into both a blessing and a curse."
  },
  {
      title: "How My First Sketchbook Became My Diary",
      description: "This essay examines how filling empty pages with ideas, memories, and emotions transformed a simple book into a time capsule."
  },
  {
      title: "Why I Broke Up with Oil Paints",
      description: "A humorous reflection on how toxic fumes, endless drying times, and expensive materials led me to acrylics—my rebound medium."
  },
  {
      title: "How \"Happy Little Accidents\" Saved My Portfolio",
      description: "Channeling Bob Ross during a rushed submission week reminded me that some mistakes are worth keeping."
  },
  {
      title: "When I Tried to Paint My Feelings and It Ended in Chaos",
      description: "A failed attempt at abstract art taught me about process, imperfection, and the surprising emotional weight of color choices."
  },
  {
      title: "The Day I Turned My Art Studio Into a Science Lab",
      description: "Experimenting with unconventional materials—like soap and coffee grounds—taught me about the chemistry of creativity."
  },
  {
      title: "Why I’ll Never Use Glitter Again",
      description: "A reflection on how one ill-fated mixed-media project taught me the meaning of regret and the permanence of sparkles."
  },
  {
      title: "How I Accidentally Entered My Self-Portrait Into the Wrong Competition",
      description: "An embarrassing mistake turned into an opportunity to explore vulnerability and self-expression in unexpected contexts."
  },
  {
      title: "The Year I Learned to Sculpt With My Eyes Closed",
      description: "A blindfolded ceramics exercise reshaped how I approach form, intuition, and trust in my hands."
  },
  {
      title: "Why My Desk Looks Like an Explosion of Creativity",
      description: "An analysis of how clutter fuels inspiration and the fine line between creative mess and chaos."
  },
  {
      title: "How My First Art Critique Gave Me an Existential Crisis",
      description: "A brutal assessment of my work made me question everything—until I realized growth often starts with discomfort."
  },
  {
      title: "When I Tried to Make My First Animation",
      description: "Learning the hard way that 24 frames per second means 24 opportunities to mess up—and how I persevered anyway."
  },
  {
      title: "The Time I Got Ink All Over My Favorite Hoodie",
      description: "A messy screen-printing accident led to a new favorite wearable artwork and a lesson in embracing imperfection."
  },
  {
      title: "How Doodling in Class Helped Me Survive High School",
      description: "A reflection on how drawing during lectures kept me sane and occasionally got me in trouble."
  },
  {
      title: "When My Collage Got Rejected for Being \"Too Abstract\"",
      description: "A rejection letter taught me that art can be subjective, but conviction in your vision isn’t."
  },
  {
      title: "Why I Keep a Mini Sketchpad in My Pocket",
      description: "An ode to capturing fleeting moments of inspiration and why I never leave home without a pencil."
  },
  {
      title: "The Art of Borrowing Without Asking",
      description: "How \"borrowing\" classmates' materials turned into a journey of collaboration, negotiation, and shared creativity."
  },
  {
      title: "Why I Call My Failed Projects \"Learning Opportunities\"",
      description: "This essay celebrates my worst pieces and what they taught me about resilience and risk-taking."
  },
  {
      title: "The Day I Turned My Leftovers Into a Still Life",
      description: "A spontaneous dining table composition taught me to find beauty in the mundane."
  },
  {
      title: "How I Accidentally Painted My Bedroom Wall",
      description: "An exploration of creative overflow, questionable decisions, and the lasting joy of making your environment your canvas."
  },
  {
      title: "The Time I Tried to 3D Print a Coffee Mug",
      description: "What I thought would be a functional piece became a lopsided art object—and an ode to failure."
  },
  {
      title: "Why I Stopped Looking at the Clock During Studio Time",
      description: "An essay on getting lost in the process and learning that good art takes as long as it needs."
  },
  {
      title: "How I Accidentally Started a Zine Collective",
      description: "A side project with friends turned into a full-scale production, teaching me the power of collaboration."
  },
  {
      title: "When My Art Teacher Told Me to \"Break the Rules\"",
      description: "A lesson in rebellion, creativity, and knowing when to ignore tradition for the sake of innovation."
  },
  {
      title: "Why My Eraser Collection Is My Most Prized Possession",
      description: "A reflection on why tiny, colorful erasers symbolize my journey through art and self-discovery."
  },
  {
      title: "The Time My Portfolio Became a Dumpster Fire",
      description: "A metaphorical—and almost literal—disaster during a portfolio review taught me about resilience and reinvention."
  },
  {
      title: "How I Accidentally Made a Meme Out of My Sculpture",
      description: "A poorly timed Instagram post turned my work into a viral sensation, sparking questions about art’s place in digital culture."
  },
  {
      title: "Why I Don’t Let Anyone Watch Me Draw",
      description: "An exploration of vulnerability, perfectionism, and why the creative process is sometimes better left unseen."
  },
  {
      title: "How I Made My Sketchbook Into a Self-Portrait",
      description: "A collection of scribbles, ticket stubs, and pressed flowers became an unintentional map of who I am."
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
  
  const typingDuration = 3;
  
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
window.addEventListener('load', () => {
  const url = "https://www.instagram.com/muyuanliii";
  const canvas = document.getElementById('qrcode-canvas');
  QRCode.toCanvas(canvas, url, { color: { dark: '#656565', light: '#000000' } }, function (error) {
    if (error) console.error(error);
    console.log('QR code generated!');
  });
});