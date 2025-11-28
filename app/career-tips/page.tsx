'use client';

import { useState } from 'react';
import Header from '../components/Header';

interface Tip {
  id: number;
  category: string;
  title: string;
  summary: string;
  content: string;
  icon: string;
}

const tips: Tip[] = [
  {
    id: 1,
    category: 'Portfolio',
    title: 'Build a Strong Portfolio',
    summary: 'Create a personal website or GitHub repository showcasing your projects.',
    content: `A strong portfolio is your best marketing tool:

• Create a personal website or GitHub repository showcasing your projects
• Include detailed descriptions: what problem you solved, technologies used, your role in the project
• Highlight real-world applications rather than small school exercises
• Quality over quantity - showcase your best 3-5 projects
• Explain the problem, your solution, and the impact
• Make it easy to navigate and visually appealing
• Keep it updated with recent work
• Host it on your own domain if possible

For developers: GitHub profile, live demos, technical blog posts
For designers: Behance, Dribbble, detailed case studies`,
    icon: '💼'
  },
  {
    id: 2,
    category: 'Interview',
    title: 'Practice for Interviews',
    summary: 'Conduct mock interviews and practice both technical and behavioral questions.',
    content: `Interview preparation is key to success:

• Conduct mock interviews via Pramp, Interviewing.io, or with friends
• Practice both technical questions (LeetCode, HackerRank) and behavioral questions
• Use the STAR method (Situation, Task, Action, Result) to structure examples from your experience

Common behavioral questions:
- Tell me about a time you faced a challenge at work
- Describe a situation where you had to work with a difficult colleague
- Give an example of when you showed leadership
- Tell me about a mistake you made and how you handled it

For technical interviews:
- Practice coding problems daily
- Explain your thought process out loud
- Ask clarifying questions before diving in`,
    icon: '🎤'
  },
  {
    id: 3,
    category: 'Learning',
    title: 'Learn & Showcase Relevant Courses',
    summary: 'Complete trending courses and earn certificates to display on your profile.',
    content: `Continuous learning sets you apart:

• Complete trending courses in your area (AI/ML, Cloud, DevOps, Fullstack)
• Earn certificates and display them on your portfolio or LinkedIn
• Apply knowledge in mini-projects or proofs-of-concept to demonstrate practical skills

Top platforms for learning:
- Coursera, Udemy, LinkedIn Learning
- FreeCodeCamp, The Odin Project
- Codecademy, Pluralsight

Tips:
- Focus on skills mentioned in job postings you're targeting
- Don't just collect certificates - build something with what you learn
- Share your learning journey on LinkedIn`,
    icon: '📚'
  },
  {
    id: 4,
    category: 'Networking',
    title: 'Network Smartly',
    summary: 'Join communities and engage with tech leaders - recruiters notice engagement.',
    content: `Smart networking opens doors to hidden opportunities:

• Join LinkedIn groups, Discord servers, or Slack communities for developers
• Follow tech leaders and actively engage with their posts – recruiters notice engagement
• Conduct informational interviews to learn about companies and job openings
• Attend virtual and in-person networking events
• Don't just ask for help - offer value to your connections too

Remember: networking is about building genuine relationships, not just asking for favors.

Pro tips:
- Comment thoughtfully on posts, don't just "like"
- Share your own insights and learnings
- Help others when you can - it comes back around`,
    icon: '🤝'
  },
  {
    id: 5,
    category: 'LinkedIn',
    title: 'Optimize Your LinkedIn Profile',
    summary: 'Use a professional photo and headline emphasizing your key skills.',
    content: `Your LinkedIn profile is often your first impression:

• Use a professional photo and a headline emphasizing your key skills
• Write a summary highlighting your value proposition clearly and concisely
• Request endorsements or recommendations from colleagues, classmates, or mentors

Profile optimization tips:
- Use keywords from job descriptions in your headline and summary
- List specific technologies and tools you work with
- Include measurable achievements (e.g., "Increased performance by 40%")
- Keep your experience section updated with recent projects
- Add media: links to projects, presentations, articles

Your headline should be more than just "Software Developer" - try "Full Stack Developer | React & Node.js | Building Scalable Web Apps"`,
    icon: '💼'
  },
  {
    id: 6,
    category: 'Industry',
    title: 'Keep Up With Industry Trends',
    summary: 'Stay updated on technologies and best practices in your field.',
    content: `Staying current demonstrates initiative to employers:

• Stay updated on technologies, frameworks, and best practices in your field
• Read blogs, newsletters, or listen to podcasts related to your specialization
• Being informed demonstrates initiative during interviews

Recommended resources:
- Hacker News, Dev.to, Medium tech publications
- Podcasts: Syntax, Software Engineering Daily, JS Party
- Newsletters: JavaScript Weekly, TLDR, ByteByteGo
- YouTube: Fireship, Traversy Media, Web Dev Simplified

During interviews, mentioning recent industry developments shows you're engaged and passionate about your field.`,
    icon: '📰'
  },
  {
    id: 7,
    category: 'Open Source',
    title: 'Contribute to Open Source',
    summary: 'Pick GitHub projects where you can help with bug fixes or new features.',
    content: `Open source contributions demonstrate real-world skills:

• Pick GitHub projects where you can help with bug fixes or new features
• Track pull requests as part of your portfolio to show practical experience
• Demonstrates teamwork and real-world problem-solving skills to potential employers

Getting started:
- Look for "good first issue" or "help wanted" labels
- Start with documentation improvements or small bug fixes
- Read contribution guidelines carefully
- Be patient - maintainers are often busy

Benefits:
- Learn from experienced developers through code reviews
- Build your GitHub contribution graph
- Get real-world collaboration experience
- Make valuable connections in the community`,
    icon: '🌐'
  },
  {
    id: 8,
    category: 'Soft Skills',
    title: 'Improve Soft Skills',
    summary: 'Practice communication, presenting projects, and collaborating with teams.',
    content: `Technical skills alone aren't enough:

• Practice communication, presenting projects, and collaborating with teams
• Improve time management and problem-solving skills
• Show in interviews that you're a team player, not just a coder

Key soft skills for developers:
- Clear written and verbal communication
- Ability to explain technical concepts to non-technical people
- Active listening and asking good questions
- Giving and receiving constructive feedback
- Conflict resolution and negotiation

How to improve:
- Present your projects to friends or at meetups
- Write technical blog posts
- Participate in code reviews
- Take on cross-functional projects`,
    icon: '🗣️'
  },
  {
    id: 9,
    category: 'Application',
    title: 'Apply Strategically',
    summary: 'Focus on 5-10 companies where your skills fit best and tailor applications.',
    content: `Quality over quantity in job applications:

• Focus on 5–10 companies where your skills fit best and tailor applications
• Include a personalized cover letter explaining why you're interested in the role
• Track applications and follow up with thank-you emails after interviews

Application strategy:
- Research each company thoroughly before applying
- Customize your resume for each position
- Reference specific projects or company values in your cover letter
- Apply to roles where you meet at least 60-70% of requirements

Follow-up tips:
- Send a thank-you email within 24 hours of an interview
- Reference specific topics discussed in the interview
- Reiterate your interest and fit for the role`,
    icon: '🎯'
  },
  {
    id: 10,
    category: 'Projects',
    title: 'Build Projects with Impact',
    summary: 'Focus on projects that solve real-world problems or automate processes.',
    content: `Impactful projects stand out to employers:

• Focus on projects that solve real-world problems or automate processes
• Prioritize projects that align with your target jobs' requirements
• Highlight measurable outcomes, e.g., "Reduced data processing time by 30%"

Project ideas that impress:
- Tools that solve your own problems
- Contributions to open source projects
- Apps with real users (even if just friends/family)
- Automations that save time

When describing projects:
- Start with the problem you were solving
- Explain your technical approach and decisions
- Quantify the impact whenever possible
- Mention challenges you overcame
- Include what you would do differently next time`,
    icon: '🚀'
  }
];

export default function CareerTipsPage() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Career Tips</h1>
          <p className="text-gray-600 mt-2">
            Expert advice to help you land your dream job and advance your career.
          </p>
        </div>


        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{tip.icon}</div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                      {tip.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.summary}</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  {expandedTip === tip.id ? 'Show less' : 'Read more'}
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedTip === tip.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedTip === tip.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                      {tip.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Want More Career Advice?</h2>
            <p className="text-blue-100 mb-6">
              Get weekly tips and job market insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
