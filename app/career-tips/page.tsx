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
    category: 'Resume',
    title: 'Tailor Your Resume for Each Job',
    summary: 'Customize your resume to match the job description keywords.',
    content: `Your resume should be tailored for each position you apply to. Here's how:

• Read the job description carefully and identify key skills and requirements
• Mirror the language used in the job posting
• Highlight relevant experience that matches what they're looking for
• Use action verbs like "developed," "managed," "implemented"
• Quantify your achievements with numbers when possible (e.g., "Increased sales by 25%")
• Keep it concise - ideally 1-2 pages for most positions`,
    icon: '📄'
  },
  {
    id: 2,
    category: 'Interview',
    title: 'Prepare for Behavioral Questions',
    summary: 'Use the STAR method to structure your interview answers.',
    content: `Behavioral questions ask about past experiences. Use the STAR method:

• Situation: Describe the context
• Task: Explain what you needed to accomplish
• Action: Detail the steps you took
• Result: Share the outcome and what you learned

Common questions to prepare for:
- Tell me about a time you faced a challenge at work
- Describe a situation where you had to work with a difficult colleague
- Give an example of when you showed leadership
- Tell me about a mistake you made and how you handled it`,
    icon: '🎤'
  },
  {
    id: 3,
    category: 'Skills',
    title: 'Keep Your Skills Up to Date',
    summary: 'Continuous learning is essential in today\'s job market.',
    content: `The tech industry evolves rapidly. Stay competitive by:

• Taking online courses (Coursera, Udemy, LinkedIn Learning)
• Getting relevant certifications
• Contributing to open-source projects
• Building personal projects to demonstrate skills
• Following industry blogs and newsletters
• Attending webinars and conferences
• Joining professional communities and meetups

Focus on both technical skills and soft skills like communication and teamwork.`,
    icon: '🎯'
  },
  {
    id: 4,
    category: 'Networking',
    title: 'Build Your Professional Network',
    summary: 'Many jobs are filled through referrals and connections.',
    content: `Networking can open doors to opportunities you won't find online:

• Optimize your LinkedIn profile with a professional photo and summary
• Connect with former colleagues, classmates, and industry professionals
• Engage with content - like, comment, and share relevant posts
• Join industry-specific groups and participate in discussions
• Attend virtual and in-person networking events
• Reach out to people for informational interviews
• Don't just ask for help - offer value to your connections too

Remember: networking is about building genuine relationships, not just asking for favors.`,
    icon: '🤝'
  },
  {
    id: 5,
    category: 'Application',
    title: 'Write Compelling Cover Letters',
    summary: 'A good cover letter can set you apart from other candidates.',
    content: `Your cover letter should complement, not repeat, your resume:

• Address it to a specific person when possible
• Open with a strong hook that shows enthusiasm
• Explain why you're interested in THIS company specifically
• Highlight 2-3 key achievements relevant to the role
• Show you've researched the company and understand their challenges
• Keep it concise - aim for 3-4 paragraphs
• End with a clear call to action
• Proofread carefully for errors

A personalized cover letter shows effort and genuine interest.`,
    icon: '✉️'
  },
  {
    id: 6,
    category: 'Salary',
    title: 'Negotiate Your Salary Confidently',
    summary: 'Don\'t leave money on the table - learn to negotiate.',
    content: `Salary negotiation is expected and can significantly impact your earnings:

Before negotiating:
• Research market rates for your role and location (Glassdoor, PayScale)
• Know your worth based on experience and skills
• Have a specific number in mind, slightly above your target

During negotiation:
• Let them make the first offer when possible
• Express enthusiasm for the role before discussing salary
• Don't accept immediately - ask for time to consider
• Consider the total package: benefits, bonus, equity, flexibility
• Be prepared to explain why you deserve more
• Don't share your current salary if not required by law

Remember: the worst they can say is no, and they rarely rescind offers for negotiating politely.`,
    icon: '💰'
  },
  {
    id: 7,
    category: 'Remote Work',
    title: 'Excel in Remote Job Applications',
    summary: 'Remote work requires specific skills - highlight them.',
    content: `When applying for remote positions, emphasize:

• Previous remote work experience
• Self-motivation and time management skills
• Excellent written communication
• Experience with remote collaboration tools (Slack, Zoom, Asana)
• Ability to work independently without supervision
• Reliable home office setup
• Experience working across time zones if applicable

In interviews, demonstrate:
• Your communication clarity
• Problem-solving ability
• How you stay organized and productive
• Your approach to work-life balance`,
    icon: '🏠'
  },
  {
    id: 8,
    category: 'Portfolio',
    title: 'Create a Strong Portfolio',
    summary: 'Show, don\'t just tell - demonstrate your skills with projects.',
    content: `A portfolio can be more powerful than a resume:

What to include:
• Personal projects that showcase your skills
• Open-source contributions
• Case studies of professional work (with permission)
• Screenshots, links, and descriptions of your role

Tips for a great portfolio:
• Quality over quantity - showcase your best 3-5 projects
• Explain the problem, your solution, and the impact
• Include the technologies and tools you used
• Make it easy to navigate and visually appealing
• Keep it updated with recent work
• Host it on your own domain if possible

For developers: GitHub profile, live demos, technical blog posts
For designers: Behance, Dribbble, detailed case studies`,
    icon: '💼'
  }
];

export default function CareerTipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(tips.map(tip => tip.category)))];

  const filteredTips = selectedCategory === 'All'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
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
