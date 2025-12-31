import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Moon,
  Sun,
  Award,
  Briefcase,
  Code,
  Cpu,
  TrendingUp,
  Users,
  Zap,
  ExternalLink,
  Terminal,
  Server,
  Database
} from 'lucide-react';

// --- Types & Interfaces ---

interface Kudo {
  id: string;
  sender: string;
  date: string;
  text: string;
  tags: string[];
  team: 'Vertex AI' | 'Network Infra' | 'Cloud Infra' | 'Serverless' | 'Booking' | 'Cross-team';
  theme: 'Technical Excellence' | 'Leadership' | 'Collaboration' | 'Incident Response' | 'Automation' | 'Mentoring' | 'Innovation';
  year: number;
  featured?: boolean;
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  impact_points: string[];
  skills: string[];
  type: 'work' | 'education';
}

interface SkillCategory {
  name: string;
  skills: string[];
  icon: React.ReactNode;
}

// --- Data Source (Grounded in User Files) ---

const RESUME_DATA = {
  profile: {
    name: "Tanmay Sahay",
    title: "Software Engineer in Site Reliability Engineering",
    tagline: "Building resilient AI platforms & sustainable operations at scale.",
    location: "Pittsburgh, PA (relocatable)",
    contact: {
      email: "tanmaysahay94@gmail.com",
      phone: "+1-650-705-7651",
      linkedin: "linkedin.com/in/tanmaysahay"
    },
    summary: "Customer-obsessed engineer with 6+ years of experience making service operability sustainable. Expert in automating complex infrastructure turnups, reducing operational toil by >50%, and pioneering AI-powered troubleshooting. Proven track record of saving 30+ SWE-years through efficiency optimizations.",
    languages: ["English", "Hindi", "Kannada", "Sanskrit"]
  },
  metrics: [
    { label: "Peer Bonuses", value: "43", icon: <Award className="w-5 h-5" />, desc: "Recognized for impact & collaboration" },
    { label: "Impact", value: "30+", unit: "SWE-Years", icon: <Users className="w-5 h-5" />, desc: "Saved via Vertex Endpoint Health" },
    { label: "Latency", value: "50%", unit: "Reduction", icon: <Zap className="w-5 h-5" />, desc: "Image generation at Booking.com" },
    { label: "Adoption", value: "500+", unit: "Databases", icon: <Database className="w-5 h-5" />, desc: "Safe Spanner rollouts enabled" },
  ],
  skills: [
    { name: "Programming", skills: ["Python", "Go", "Java", "C++", "SQL", "Shell"], icon: <Code /> },
    { name: "SRE & Cloud", skills: ["Kubernetes", "Terraform", "Bazel", "GCP", "Incident Response", "Observability"], icon: <Server /> },
    { name: "AI & ML", skills: ["Vertex AI", "LLM Ops", "Gemini CLI", "Model Serving", "TPU Fleet Mgmt"], icon: <Cpu /> },
    { name: "Tools", skills: ["Prodspec", "Spanner", "Bigtable", "Prometheus/Monarch"], icon: <Terminal /> }
  ] as SkillCategory[],
  experience: [
    {
      id: "google-gemini",
      company: "Google",
      role: "Software Engineer, SRE (Gemini & Vertex AI)",
      period: "Apr '25 - Present",
      location: "US-PIT",
      type: "work",
      description: "Leading reliability for Google Cloud's LLM offerings (Gemini, Veo, Imagen).",
      impact_points: [
        "Automated months-long turnup process for Vertex AI in new regions.",
        "Saved Google ~30 SWE-years and relinquished ~7.6k TPUs by enforcing Vertex Endpoint Health.",
        "Pioneered 'Gemini Powered Vertex Operations', using AI to reduce Mean Time To Mitigate (MTTM).",
        "Designed capacity presubmits preventing Vertex capacity overconsumption."
      ],
      skills: ["AI/ML", "Automation", "Capacity Planning", "Python", "Go"]
    },
    {
      id: "google-network",
      company: "Google",
      role: "Software Engineer, SRE (Network Infrastructure)",
      period: "Feb '24 - Apr '25",
      location: "US-PIT",
      type: "work",
      description: "Ensuring reliability for Google's global backbone network telemetry and monitoring systems.",
      impact_points: [
        "Navigated chaotic environment with constantly changing requirements while maintaining system stability.",
        "Successfully collaborated with NetInfra Telemetry teams to improve network observability.",
        "Built tooling to enhance network monitoring and alerting capabilities.",
        "Contributed to infrastructure supporting Google's global network operations."
      ],
      skills: ["Networking", "Telemetry", "Observability", "Collaboration", "Python"]
    },
    {
      id: "google-switzerland",
      company: "Google",
      role: "Software Engineer, SRE (Cloud Infrastructure)",
      period: "Feb '23 - Feb '24",
      location: "CH-ZRH",
      type: "work",
      description: "Continued driving reliability improvements and tooling development from Zurich.",
      impact_points: [
        "Continued development and expansion of Khoj (InvDash), scaling adoption across Google SRE teams.",
        "Mentored junior engineers and drove knowledge transfer across regions.",
        "Contributed to cross-functional infrastructure reliability initiatives.",
        "Prepared for and executed smooth transition to US-based Network Infrastructure team."
      ],
      skills: ["Mentoring", "Tooling", "Cross-team Collaboration", "Infrastructure"]
    },
    {
      id: "google-serverless",
      company: "Google",
      role: "Software Engineer, SRE (Serverless Platform)",
      period: "Mar '19 - Feb '23",
      location: "UK-LON / CH-ZRH",
      type: "work",
      description: "Enhanced reliability for Cloud Run, Cloud Functions, and App Engine.",
      impact_points: [
        "Reduced team's oncall load by over 50% through actionable metrics and democratization of data.",
        "Enabled safe, slow rollouts for 500+ Spanner databases, preventing global outages.",
        "Created 'Khoj' (InvDash) in 2021 — an automated incident root-causing system now used Google-wide and still actively maintained.",
        "Led Log4j Code Red response for Serverless products."
      ],
      skills: ["Serverless", "Spanner", "Incident Management", "Mentoring"]
    },
    {
      id: "khoj-project",
      company: "Google (Internal Project)",
      role: "Creator & Lead Developer — Khoj (InvDash)",
      period: "2021 - Present",
      location: "Global",
      type: "work",
      description: "Built and continuously evolved an automated incident investigation and root-causing system.",
      impact_points: [
        "Conceived and built Khoj in 2021 to automate tedious incident root-cause analysis.",
        "System correlates logs, metrics, and change events to surface probable causes during outages.",
        "Adopted Google-wide across multiple SRE teams, significantly reducing Mean Time To Diagnose (MTTD).",
        "Continuously maintained and enhanced over 4+ years, adapting to new infrastructure patterns."
      ],
      skills: ["Incident Response", "Automation", "Data Correlation", "Python", "Observability"]
    },
    {
      id: "booking",
      company: "Booking.com",
      role: "Software Developer",
      period: "Jun '17 - Feb '19",
      location: "NL-AMS",
      type: "work",
      description: "Machine Learning Services & Image Infrastructure.",
      impact_points: [
        "Reduced image serving latency by 50% and storage costs by 80% via on-the-fly resizing service.",
        "Built ML platform features used by 200+ Data Scientists.",
        "Migrated image building pipelines to Google Cloud Dataproc."
      ],
      skills: ["Java", "Machine Learning", "Optimization", "Distributed Systems"]
    },
    {
      id: "education",
      company: "IIIT Hyderabad",
      role: "B.Tech in Computer Science",
      period: "2013 - 2017",
      location: "Hyderabad, India",
      type: "education",
      description: "Premier research university, ranked among top CS programs in India.",
      impact_points: [
        "ACM ICPC Regional Finalist (2014, 2015) — among top competitive programmers in Asia.",
        "JEE Mains Rank 719 (Top 0.05%) out of 1.4M candidates nationwide.",
        "National Talent Scholar — recognized for academic excellence.",
        "CodeChef Campus Chapter Ambassador — organized coding competitions.",
        "Teaching Assistant for Algorithms & Data Structures courses."
      ],
      skills: ["Algorithms", "Data Structures", "Competitive Programming", "Problem Solving"]
    }
  ] as ExperienceItem[],
  kudos: [
    // === VERTEX AI / GEMINI (2025) ===
    {
      id: "kudo-1",
      sender: "TJ Angelo",
      date: "Dec 04, 2025",
      text: "Thank you Tanmay for your contribution to key V1P Initiatives: Groot Turnup Automation Scripting, Observability, Troubleshooting and Incident response Improvements with eCatcher, Fireaxe playbooks, Instructions and prompting guidance on simplifying ops with Gemini CLI, etc.",
      tags: ["Automation", "AI/ML", "Leadership"],
      team: "Vertex AI",
      theme: "Automation",
      year: 2025,
      featured: true
    },
    {
      id: "kudo-2",
      sender: "Himanshu Raj",
      date: "Sep 30, 2025",
      text: "Thanks Tanmay for introducing me and keeping me up to date with all the innovative things happening in the world of AI. Your presentation on gemini-cli and how to prompt was awesome. Your push towards using AI to automate our operations and investigations will be really impactful for the team.",
      tags: ["AI/ML", "Innovation", "Knowledge Sharing"],
      team: "Vertex AI",
      theme: "Innovation",
      year: 2025,
      featured: true
    },
    {
      id: "kudo-3",
      sender: "Abhishek Gupta",
      date: "Aug 07, 2025",
      text: "Thank you for taking time and providing detailed feedback on the Production Agent insights in IRM. Your valuable insights will help us improve the Outage Investigator experience for all Googlers.",
      tags: ["Feedback", "UX", "Collaboration"],
      team: "Cross-team",
      theme: "Collaboration",
      year: 2025
    },
    {
      id: "kudo-4",
      sender: "Mark Langer",
      date: "Jun 30, 2025",
      text: "Thank you for going above and beyond during my Pittsburgh trip. You had dinner with me every night I was there, organized a small team dinner, and collaborated with me in person. It really added to the welcoming atmosphere I experienced during my time in the Pittsburgh office :)",
      tags: ["Team Building", "Hospitality", "Collaboration"],
      team: "Cross-team",
      theme: "Leadership",
      year: 2025
    },
    {
      id: "kudo-5",
      sender: "Kevin Shumaker",
      date: "Jun 27, 2025",
      text: "Tanmay has really ramped up this quarter quickly on Autoscaler and metrics work. He's been quick to engage and iterate with dev partners on how to format metrics and dashboards, what debugging looks like and how we can better enable it, and has been excellent at using Taskflow and bug updates to keep the wider audience informed. It's been awesome to see such confident structure introduced to the working group.",
      tags: ["Autoscaler", "Communication", "Structure"],
      team: "Vertex AI",
      theme: "Leadership",
      year: 2025,
      featured: true
    },
    {
      id: "kudo-6",
      sender: "Andrei-Marius Dincu",
      date: "Jun 19, 2025",
      text: "Thanks for helping us prepare for ProdEx. We got an overall score of 4/5, which is great! We couldn't get there without your contributions!",
      tags: ["ProdEx", "Preparation", "Impact"],
      team: "Vertex AI",
      theme: "Technical Excellence",
      year: 2025
    },
    {
      id: "kudo-7",
      sender: "Himanshu Raj",
      date: "Jun 09, 2025",
      text: "Thanks for helping me in setting up taskflow for MMS!",
      tags: ["Taskflow", "Tooling", "Help"],
      team: "Vertex AI",
      theme: "Collaboration",
      year: 2025
    },
    {
      id: "kudo-8",
      sender: "Maria Samokhina",
      date: "Jun 03, 2025",
      text: "Tanmay, thank you for your work on capacity presubmits. You laid the foundation for capacity presubmits and later improved them to account for models in migration. As a result, we now have an effective mechanism to preventing Vertex capacity overconsumption before it even happens, and saving hours of debugging for many people working with TPU fleet. Thank you very much, this is a game changer.",
      tags: ["Capacity", "TPU", "Prevention"],
      team: "Vertex AI",
      theme: "Technical Excellence",
      year: 2025,
      featured: true
    },
    {
      id: "kudo-9",
      sender: "Antonino Radici",
      date: "May 21, 2025",
      text: "Again, another spot bonus for you stepping in and taking the initiative here. I really appreciate the ownership and autonomy in spotting the problem we had with autoscaler numbers and produce a generator that pulled both uniserve actual config and the state in prod. It is true that this will eventually be solved by a control plane call, but your change really increased the quality of life of anybody that, in the future, will edit protoconf.pi. You also worked on it despite this not being part of your OKRs, thanks again!!",
      tags: ["Autoscaler", "Initiative", "Quality"],
      team: "Vertex AI",
      theme: "Technical Excellence",
      year: 2025
    },
    {
      id: "kudo-10",
      sender: "Antonino Radici",
      date: "May 07, 2025",
      text: "Thanks for being around in irm/i_G9B23gUQ13v66zRreanP and helping me and Lucky with the incident. This was a multiple hours situation where the utilization of gemini 1.5 hit 100% and we couldn't find the chips. Thanks to your help we were able to harvest chips from multiple endpoints until autoscaler finally kicked in!",
      tags: ["Incident", "Gemini", "Collaboration"],
      team: "Vertex AI",
      theme: "Incident Response",
      year: 2025,
      featured: true
    },
    // === NETWORK INFRA (2024-2025) ===
    {
      id: "kudo-11",
      sender: "Tharindu Bamunuarachchi",
      date: "Feb 03, 2025",
      text: "While on B2 WAN OnCall, Tanmay helped GEN to avoid imminent office outage by addressing underlying issues in the router undrain mechanism and undrained it successfully going through multiple obstacles. His effort helped us to avoid imminent office outage.",
      tags: ["OnCall", "Incident Prevention", "Network"],
      team: "Network Infra",
      theme: "Incident Response",
      year: 2025
    },
    {
      id: "kudo-12",
      sender: "Yogisai Maramraj",
      date: "Jan 31, 2025",
      text: "Thank you for responding and being the 'operator' on omg/79852 after hours! Much appreciated.",
      tags: ["OnCall", "After Hours", "Responsiveness"],
      team: "Network Infra",
      theme: "Incident Response",
      year: 2025
    },
    {
      id: "kudo-13",
      sender: "Sierra Ventuleth",
      date: "Jan 25, 2025",
      text: "Thank you for being a B2 Postmortem Pre-reviewer and contributing to the preparation and pre-review of postmortems in 2024. This is a volunteer effort and your contributions are appreciated.",
      tags: ["Postmortem", "Volunteer", "Quality"],
      team: "Network Infra",
      theme: "Collaboration",
      year: 2025
    },
    {
      id: "kudo-14",
      sender: "Zoltán Németh",
      date: "Oct 10, 2024",
      text: "Thank you for your efforts during the B2 SRE TPC Surge, specifically collaborating on critical dashboards needed for overall customer-critical observability on routers, their linecard states, and related metrics. We really stepped up as a team and delivered an important milestone! Thank you again!",
      tags: ["TPC Surge", "Dashboards", "Observability"],
      team: "Network Infra",
      theme: "Collaboration",
      year: 2024
    },
    {
      id: "kudo-15",
      sender: "Masha Pospelova",
      date: "Oct 03, 2024",
      text: "Thank you Tanmay for your great work migrating B2 Device Linecards dashboard for TPC under extremely challenging circumstances and a very tight timeline. You did an amazing job navigating a truly chaotic environment where everything changes every day, things don't work as expected and one has to follow up with multiple teams at the same time to get unblocked. You successfully collaborated with NetInfra Telemetry team and merged the overlapping work which is something I wasn't able to do on my own. Thank you and keep up the good work!",
      tags: ["Dashboard", "Migration", "Resilience"],
      team: "Network Infra",
      theme: "Collaboration",
      year: 2024,
      featured: true
    },
    {
      id: "kudo-16",
      sender: "Mihai Guran",
      date: "Sep 14, 2024",
      text: "Thank you Tanmay for always reviewing my Khoj CLs quickly! I often write CLs and sometimes nobody from my team is able to review them. Tanmay is always very responsive and reviews the CLs and offers great feedback. His help is crucial for making progress quickly on my project.",
      tags: ["Khoj", "Code Review", "Responsiveness"],
      team: "Cross-team",
      theme: "Collaboration",
      year: 2024,
      featured: true
    },
    {
      id: "kudo-17",
      sender: "Zoltán Németh",
      date: "Sep 11, 2024",
      text: "Thank you Tanmay for exceptional contributions to the Q3 '24 B2 WAN SRE team Fixit! You were a key person driving redefinition of playbooks while also being a great team resource for Borgmon-Monarch pursuits in track 1. Thank you Tanmay!",
      tags: ["Fixit", "Playbooks", "Borgmon"],
      team: "Network Infra",
      theme: "Leadership",
      year: 2024
    },
    {
      id: "kudo-18",
      sender: "Pawel Czepczor",
      date: "Aug 26, 2024",
      text: "Thank you for taking most difficult borgmon>monarch bug and giving us example how to proceed with creation of similar metrics.",
      tags: ["Borgmon", "Monarch", "Metrics"],
      team: "Network Infra",
      theme: "Technical Excellence",
      year: 2024
    },
    {
      id: "kudo-19",
      sender: "Diana Cortes",
      date: "Jul 30, 2024",
      text: "Thank you for volunteering at the last minute to test the new Veto Integration. Your willingness to take the time to test the new safety override feature helped the project maintain momentum while some team members were out of the office. Your time and assistance were greatly appreciated. Keep up the good work!",
      tags: ["Volunteering", "Testing", "Flexibility"],
      team: "Network Infra",
      theme: "Collaboration",
      year: 2024
    },
    {
      id: "kudo-20",
      sender: "Loris Marcellini",
      date: "Jul 03, 2024",
      text: "Thanks, Tanmay for the follow up, dedication and technical breadth demonstrated as part of your work in b/342078410. Not only you have prevented further issues with Turnup Silencer silencing logic but you have very well represented the entire PG by advocating for SRE principles and prod best practices to be enforced across teams even outside of our PA. PS - you even built a preso about it, with enough details to be almost considered a training slides deck.",
      tags: ["Turnup Silencer", "SRE Principles", "Documentation"],
      team: "Network Infra",
      theme: "Technical Excellence",
      year: 2024
    },
    {
      id: "kudo-21",
      sender: "Pawel Czepczor",
      date: "Jun 27, 2024",
      text: "Thank you for pointing me in the right direction to quickly address the problem of Monarch alert PREncapsulatedProbesLoss still opening for 100% loss to a peering device.",
      tags: ["Monarch", "Alerting", "Guidance"],
      team: "Network Infra",
      theme: "Technical Excellence",
      year: 2024
    },
    {
      id: "kudo-22",
      sender: "Ali Onur Uyar",
      date: "Apr 02, 2024",
      text: "Thanks for the proposal on for improving Incident documentation and tagging for B2 WAN SRE (go/b2-wan-tag-nag). I think this is a great approach that should be extended to all B2 SRE.",
      tags: ["Documentation", "Incident Tagging", "Process"],
      team: "Network Infra",
      theme: "Innovation",
      year: 2024
    },
    {
      id: "kudo-23",
      sender: "Rob Rockell",
      date: "Mar 08, 2024",
      text: "Thank you for your leadership in driving mitigations into our network for omg/70340. Your significant contributions to the planning and execution of our get-well plan resulted in a smooth mitigation and ultimately protected our customers experience. Great work!",
      tags: ["Leadership", "Mitigation", "Customer Impact"],
      team: "Network Infra",
      theme: "Leadership",
      year: 2024
    },
    // === CLOUD INFRA / SWITZERLAND (2023) ===
    {
      id: "kudo-24",
      sender: "Enrique García Torres",
      date: "Sep 27, 2023",
      text: "Thank you for your great work on the AMC->MAC migration. Your efforts and attention to detail to this critical part of the project has made a significant contribution to the success of the project. Your work made possible to have a smooth transition. Also, thank you for always looking on different ways to contribute and help others on their tasks.",
      tags: ["Migration", "Attention to Detail", "Helpfulness"],
      team: "Cloud Infra",
      theme: "Technical Excellence",
      year: 2023,
      featured: true
    },
    {
      id: "kudo-25",
      sender: "Codrin Grajdeanu",
      date: "Mar 15, 2023",
      text: "Congratulations on finalising Docs SREs alert2bug migration! We would have started missing tickets without this.",
      tags: ["Alert2Bug", "Migration", "Impact"],
      team: "Cloud Infra",
      theme: "Technical Excellence",
      year: 2023
    },
    // === SERVERLESS (2019-2022) ===
    {
      id: "kudo-26",
      sender: "Dora Diao",
      date: "Dec 08, 2022",
      text: "Tanmay was my mentor from Serverless Platform team, London site. He introduced and guided me through different internal tools, and walked through with me the problems I had. He was able to commit to frequent 1:1s, and keep me up to date. I appreciate his time and help a lot. Thank you so much for the mentoring during the first three months!",
      tags: ["Mentoring", "Onboarding", "Guidance"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2022,
      featured: true
    },
    {
      id: "kudo-27",
      sender: "Charan Suresh",
      date: "Oct 14, 2022",
      text: "Thanks a ton Tanmay!! Tanmay was the SRE who jumped on the Cloud Run Quota Bug which was to address the unplanned sudden quota increase requested by VerSe. Tanmay swiftly acted on the bug being the oncall and stepped in the next day when he wasn't the on-call to duely address customers immediate ask.",
      tags: ["Cloud Run", "Customer Focus", "Dedication"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2022
    },
    {
      id: "kudo-28",
      sender: "Anna Ayvazyan",
      date: "Oct 10, 2022",
      text: "Tanmay, thanks very much for helping me understand GCL better! I saved tons of time thanks to you!",
      tags: ["GCL", "Knowledge Sharing", "Time Saving"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2022
    },
    {
      id: "kudo-29",
      sender: "Joan Grau",
      date: "Oct 05, 2022",
      text: "Thanks for being an awesome mentor! You helped me a lot during the onboarding, giving me all the tips and information that I need to understand our products and how we work. I know I always can come to you to ask for help or for any questions I have, and your knowledge and tips are invaluable.",
      tags: ["Mentoring", "Onboarding", "Accessibility"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2022
    },
    {
      id: "kudo-30",
      sender: "Aleksej Truhan",
      date: "Sep 22, 2022",
      text: "Being oncall in an understaffed rotation takes time away from your project work and personal life. Thank you Tanmay for enabling our team to persevere through this challenging time!",
      tags: ["OnCall", "Dedication", "Team Support"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2022
    },
    {
      id: "kudo-31",
      sender: "Harman Dhaliwal",
      date: "Sep 21, 2022",
      text: "Thank you for your help in resolving OMG/57103 including unblocking a major customer; you showed exemplary dedication to our customers!",
      tags: ["Customer Focus", "Incident Resolution", "Dedication"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2022
    },
    {
      id: "kudo-32",
      sender: "Ashwin Chandrasekher",
      date: "Mar 02, 2022",
      text: "Thank you Tanmay for your amazing ongoing contributions towards Oppia.org! Your volunteering spirit has been shining through and thanks to your effort and several others, we have been able to make good progress in making Oppia lessons available in indic languages. Thank you again for everything!",
      tags: ["Oppia", "Volunteering", "Social Impact"],
      team: "Cross-team",
      theme: "Collaboration",
      year: 2022
    },
    {
      id: "kudo-33",
      sender: "Anna Ayvazyan",
      date: "Jan 13, 2022",
      text: "Thanks Tanmay for giving an insight of our partner GAE Flex dev team's upcoming projects. We, as liaisons, for sure should follow your example and keep the SRE team aware and involved at the earliest stages of development lifecycle. One more step towards the healthy relationship between SRE and Dev. Keep it up!",
      tags: ["GAE Flex", "SRE-Dev Relations", "Proactive"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2022
    },
    {
      id: "kudo-34",
      sender: "Philip Beevers",
      date: "Jan 10, 2022",
      text: "Thank you for going above and beyond the call of duty in your response to the log4j security vulnerabilities in December 2021. Your commitment to securing Google and our customers is truly appreciated!",
      tags: ["Log4j", "Security", "Dedication"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2022,
      featured: true
    },
    {
      id: "kudo-35",
      sender: "Sergio Rodriguez",
      date: "Dec 13, 2021",
      text: "For helping coordinate the Serverless SRE response to the CODE RED in omg/45447 (log4j vulnerability), being responsive and becoming the PA point of contact for go/log4j-pa-irt-tracking over the weekend.",
      tags: ["Log4j", "Coordination", "Code Red"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2021
    },
    {
      id: "kudo-36",
      sender: "Yifan Zhu",
      date: "Sep 24, 2021",
      text: "Hi Tanmay! We would like to thank you for all the efforts you made to mentor us and help us grow professionally. You were always there to help us out, answer our questions and offer valuable advice. You made our working environment comfortable and we cannot thank you enough for that! Yifan & Pavel",
      tags: ["Mentoring", "Support", "Growth"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2021
    },
    {
      id: "kudo-37",
      sender: "Pavel Petrukhin",
      date: "Sep 24, 2021",
      text: "Thank you so much for being my co-host during this internship. You provided valuable advice about professional and technical skills. You were always there to help. Your high-level view of the project helped make better design decisions. You did an amazing job as a mentor :)",
      tags: ["Internship", "Co-host", "Design Guidance"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2021
    },
    {
      id: "kudo-38",
      sender: "Rahul Sahu",
      date: "Sep 06, 2021",
      text: "Hi Tanmay, thank you for being my noogler guide for the past two quarters. You were very kind to accept my request and find a weekly time for us. Your support & insights have helped me understand my role and made my job much easier to perform. Keep up the good work :)",
      tags: ["Noogler Guide", "Support", "Insights"],
      team: "Serverless",
      theme: "Mentoring",
      year: 2021
    },
    {
      id: "kudo-39",
      sender: "Steve Jordan",
      date: "Jul 28, 2021",
      text: "Thanks for your work on the Pod Spanner migration!",
      tags: ["Spanner", "Migration", "Infrastructure"],
      team: "Serverless",
      theme: "Technical Excellence",
      year: 2021
    },
    {
      id: "kudo-40",
      sender: "Wilson Yeung",
      date: "May 27, 2020",
      text: "Thank you for helping to resolve omg/19960. You really went above and beyond in a short amount of time in service to our customers. Thank you!",
      tags: ["Customer Service", "Quick Resolution", "Dedication"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2020
    },
    {
      id: "kudo-41",
      sender: "JJ Zeng",
      date: "Sep 20, 2019",
      text: "The config storage team is in the process of backfilling AppInfos from Bigtable to regional Spanner. We had finished most of the regions, which can be completed in a few hours. But us-central is a bit too large, and will take many days to finish with the restriction to pacific business hours. So we split the jobs into four 15-hours chunks and ask LON SREs to start the jobs so they can finish in SRE core hours and we always have active supervise/investigation. Tanmay stepped up and volunteered to take this job. Everyday this week he started the job, updated the doc, and handed over. We finished without a hiccup. This is a great example of collaboration across the pond.",
      tags: ["Spanner", "Cross-team", "Collaboration"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2019
    },
    {
      id: "kudo-42",
      sender: "Chris Raynor",
      date: "Jun 13, 2019",
      text: "During the May 2019 GCF Reliability Fix-it you were a significant contributor, thank you. This effort will help reduce time to resolution to GCF incidents and is crucial to GCF oncall rotation's healthiness.",
      tags: ["GCF", "Reliability", "Fix-it"],
      team: "Serverless",
      theme: "Technical Excellence",
      year: 2019
    },
    {
      id: "kudo-43",
      sender: "Chris Raynor",
      date: "Jun 13, 2019",
      text: "For collaborating with Cloud Functions SREs to ensure alignment and shared understanding of observability requirements during the GCF v2 launch preparation.",
      tags: ["GCF v2", "Observability", "Launch Prep"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2019
    }
  ] as Kudo[]
};

// --- Components ---

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-slate-800 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200/80 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:hover:shadow-lg ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }: { children: React.ReactNode, color?: "blue" | "green" | "purple" | "orange" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
    orange: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

// Filter chip component
const FilterChip = ({
  label,
  active,
  onClick,
  count
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
    }`}
  >
    {label} {count !== undefined && <span className="ml-1 opacity-70">({count})</span>}
  </button>
);

export default function InteractiveResume() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'skills' | 'kudos'>('all');
  const [kudosTeamFilter, setKudosTeamFilter] = useState<string | null>(null);
  const [kudosThemeFilter, setKudosThemeFilter] = useState<string | null>(null);
  const [kudosYearFilter, setKudosYearFilter] = useState<number | null>(null);
  const [showAllKudos, setShowAllKudos] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Search Logic
  const filteredExperience = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.experience;
    const lowerQ = searchQuery.toLowerCase();
    return RESUME_DATA.experience.filter(item =>
      item.role.toLowerCase().includes(lowerQ) ||
      item.company.toLowerCase().includes(lowerQ) ||
      item.description.toLowerCase().includes(lowerQ) ||
      item.skills.some(s => s.toLowerCase().includes(lowerQ))
    );
  }, [searchQuery]);

  // Kudos filter options (derived from data)
  const kudosFilterOptions = useMemo(() => {
    const teams = [...new Set(RESUME_DATA.kudos.map(k => k.team))];
    const themes = [...new Set(RESUME_DATA.kudos.map(k => k.theme))];
    const years = [...new Set(RESUME_DATA.kudos.map(k => k.year))].sort((a, b) => b - a);
    return { teams, themes, years };
  }, []);

  // Count kudos per filter
  const kudosCounts = useMemo(() => {
    const teamCounts: Record<string, number> = {};
    const themeCounts: Record<string, number> = {};
    const yearCounts: Record<number, number> = {};

    RESUME_DATA.kudos.forEach(k => {
      teamCounts[k.team] = (teamCounts[k.team] || 0) + 1;
      themeCounts[k.theme] = (themeCounts[k.theme] || 0) + 1;
      yearCounts[k.year] = (yearCounts[k.year] || 0) + 1;
    });

    return { teamCounts, themeCounts, yearCounts };
  }, []);

  const filteredKudos = useMemo(() => {
    let filtered = RESUME_DATA.kudos;

    // Apply search query
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.text.toLowerCase().includes(lowerQ) ||
        item.tags.some(t => t.toLowerCase().includes(lowerQ)) ||
        item.sender.toLowerCase().includes(lowerQ) ||
        item.team.toLowerCase().includes(lowerQ) ||
        item.theme.toLowerCase().includes(lowerQ)
      );
    }

    // Apply team filter
    if (kudosTeamFilter) {
      filtered = filtered.filter(k => k.team === kudosTeamFilter);
    }

    // Apply theme filter
    if (kudosThemeFilter) {
      filtered = filtered.filter(k => k.theme === kudosThemeFilter);
    }

    // Apply year filter
    if (kudosYearFilter) {
      filtered = filtered.filter(k => k.year === kudosYearFilter);
    }

    return filtered;
  }, [searchQuery, kudosTeamFilter, kudosThemeFilter, kudosYearFilter]);

  // Show featured by default, or all if filters active or showAllKudos toggled
  const displayedKudos = useMemo(() => {
    const hasActiveFilters = kudosTeamFilter || kudosThemeFilter || kudosYearFilter || searchQuery;
    if (hasActiveFilters || showAllKudos) {
      return filteredKudos;
    }
    // Show featured kudos by default (diverse selection)
    return filteredKudos.filter(k => k.featured);
  }, [filteredKudos, kudosTeamFilter, kudosThemeFilter, kudosYearFilter, searchQuery, showAllKudos]);

  const clearKudosFilters = () => {
    setKudosTeamFilter(null);
    setKudosThemeFilter(null);
    setKudosYearFilter(null);
    setShowAllKudos(false);
  };

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.skills;
    const lowerQ = searchQuery.toLowerCase();
    return RESUME_DATA.skills.map(cat => ({
      ...cat,
      skills: cat.skills.filter(s => s.toLowerCase().includes(lowerQ))
    })).filter(cat => cat.skills.length > 0);
  }, [searchQuery]);


  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>

      {/* Header / Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2 text-white shadow-md">
                <Terminal size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900 dark:text-white">Tanmay Sahay</span>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-full leading-5 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 sm:text-sm transition-all"
                  placeholder="Search skills, impact, or kudos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-6 animate-fadeIn py-4">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2">
              {RESUME_DATA.profile.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-slate-300 font-medium">
              {RESUME_DATA.profile.title}
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
            {RESUME_DATA.profile.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-slate-400">
            {Object.entries(RESUME_DATA.profile.contact).map(([key, val]) => (
              <a
                key={key}
                href={key === 'email' ? `mailto:${val}` : `https://${val}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all shadow-sm"
              >
                <ExternalLink size={14} /> {val}
              </a>
            ))}
          </div>

          {/* Spoken Languages */}
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-slate-500">
            <span className="font-medium">Languages:</span>
            {RESUME_DATA.profile.languages.map((lang, idx) => (
              <span key={lang}>
                {lang}{idx < RESUME_DATA.profile.languages.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {RESUME_DATA.metrics.map((metric, idx) => (
            <Card key={idx} className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-800 hover:scale-[1.02]">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
                {metric.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}<span className="text-sm font-medium text-gray-500 dark:text-slate-400 ml-1">{metric.unit}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-slate-300">{metric.label}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">{metric.desc}</div>
            </Card>
          ))}
        </section>

        {/* Tab Navigation */}
        <div className="flex justify-center border-b border-gray-200 dark:border-slate-700">
          {(['all', 'experience', 'skills', 'kudos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Experience Timeline */}
        {(activeTab === 'all' || activeTab === 'experience') && (
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="text-blue-600 dark:text-blue-400" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Map</h2>
            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-4 md:ml-6 space-y-12">
              {filteredExperience.map((job) => (
                <div key={job.id} className="relative pl-8 md:pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-0 bg-gray-50 dark:bg-slate-900 p-1 rounded-full">
                    <div className={`w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${job.type === 'work' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.company}</h3>
                      <div className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{job.role}</div>
                    </div>
                    <div className="text-right mt-1 sm:mt-0">
                      <div className="text-sm font-mono text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded inline-block">{job.period}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">{job.location}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-slate-300 mb-4 italic border-l-2 border-gray-200 dark:border-slate-600 pl-3">
                    {job.description}
                  </p>

                  <ul className="space-y-2.5 mb-4">
                    {job.impact_points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-slate-300">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <Badge key={skill} color="blue">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}

              {filteredExperience.length === 0 && (
                <div className="pl-12 text-gray-500 dark:text-slate-500 italic">No experience found matching "{searchQuery}"</div>
              )}
            </div>
          </section>
        )}

        {/* Skills Matrix */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Cpu className="text-purple-600 dark:text-purple-400" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Technologies</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSkills.map((category) => (
                <Card key={category.name} className="flex flex-col h-full hover:border-purple-300 dark:hover:border-purple-500">
                  <div className="flex items-center gap-3 mb-4 text-gray-900 dark:text-white font-semibold">
                    <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg text-gray-600 dark:text-slate-300 shadow-sm">
                      {category.icon}
                    </div>
                    {category.name}
                  </div>
                  <div className="flex flex-wrap gap-2 content-start">
                    {category.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Social Proof (Kudos) */}
        {(activeTab === 'all' || activeTab === 'kudos') && (
          <section className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-slate-800/30 dark:to-slate-800/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-y border-amber-100/80 dark:border-slate-700">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="text-amber-600 dark:text-orange-400" size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Peer Recognition</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      {RESUME_DATA.kudos.length} peer bonuses • Showing {displayedKudos.length}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
                  Validated Google Peer Bonus Data
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="space-y-4">
                  {/* Team Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Team</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.teams.map(team => (
                        <FilterChip
                          key={team}
                          label={team}
                          active={kudosTeamFilter === team}
                          onClick={() => setKudosTeamFilter(kudosTeamFilter === team ? null : team)}
                          count={kudosCounts.teamCounts[team]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Theme Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Theme</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.themes.map(theme => (
                        <FilterChip
                          key={theme}
                          label={theme}
                          active={kudosThemeFilter === theme}
                          onClick={() => setKudosThemeFilter(kudosThemeFilter === theme ? null : theme)}
                          count={kudosCounts.themeCounts[theme]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Year</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.years.map(year => (
                        <FilterChip
                          key={year}
                          label={String(year)}
                          active={kudosYearFilter === year}
                          onClick={() => setKudosYearFilter(kudosYearFilter === year ? null : year)}
                          count={kudosCounts.yearCounts[year]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <button
                      onClick={() => setShowAllKudos(!showAllKudos)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showAllKudos
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {showAllKudos ? 'Showing All' : 'Show All Kudos'}
                    </button>
                    {(kudosTeamFilter || kudosThemeFilter || kudosYearFilter) && (
                      <button
                        onClick={clearKudosFilters}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Kudos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedKudos.map((kudo) => (
                  <Card key={kudo.id} className="relative bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-lg hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all">
                    <div className="absolute top-4 right-4 text-amber-100 dark:text-slate-700">
                      <Award size={40} />
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{kudo.sender}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-500">{kudo.date}</div>
                    </div>

                    {/* Team & Theme badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                        {kudo.team}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                        {kudo.theme}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed mb-4 relative z-10">
                      "{kudo.text}"
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-slate-700">
                      {kudo.tags.map(tag => (
                        <Badge key={tag} color="orange">#{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {displayedKudos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-slate-600 mb-2">
                    <Award size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-slate-500">No kudos found matching your filters.</p>
                  <button
                    onClick={clearKudosFilters}
                    className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Built with React & Tailwind CSS. Grounded in verified career documents.
          </p>
          <div className="text-sm text-gray-500 dark:text-slate-500">
            © {new Date().getFullYear()} Tanmay Sahay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
