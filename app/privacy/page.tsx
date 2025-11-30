import Header from '../components/Header';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: November 30, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to Match Your Job ("we," "our," or "us"). We are committed to protecting your privacy
                and personal data. This Privacy Policy explains how we collect, use, and safeguard your
                information when you use our job matching platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Profile Information:</strong> Name, email, phone number, location, skills, work experience, and education that you provide when creating your profile.</li>
                <li><strong>Usage Data:</strong> Information about how you use our platform, including pages visited and features used.</li>
                <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for analytics purposes.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Match you with relevant job opportunities based on your profile</li>
                <li>Generate personalized resumes tailored to specific jobs</li>
                <li>Improve our matching algorithms and user experience</li>
                <li>Send you relevant job recommendations (with your consent)</li>
                <li>Analyze platform usage to improve our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Storage</h2>
              <p className="text-gray-600 mb-4">
                Your profile data is stored locally in your browser (localStorage) and is not transmitted
                to external servers unless you explicitly use features that require it. We use Vercel Analytics
                for anonymous usage statistics.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share
                anonymized, aggregated data for analytics purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access your personal data stored in the platform</li>
                <li>Delete your profile and all associated data at any time</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of analytics tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use essential cookies for platform functionality and Vercel Analytics for understanding
                how users interact with our service. You can disable cookies in your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information. However,
                no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@matchyourjob.com" className="text-blue-600 hover:underline">
                  privacy@matchyourjob.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
