import Header from '../components/Header';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: November 30, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Match Your Job ("the Service"), you accept and agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                Match Your Job is a job matching platform that helps users find suitable job opportunities
                based on their skills, experience, and preferences. The Service includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Job matching based on user profile</li>
                <li>Resume/CV generation tools</li>
                <li>Job listings from various sources</li>
                <li>Career tips and resources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate and truthful information in your profile</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
                <li>Not attempt to access other users' data</li>
                <li>Not interfere with the proper functioning of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Job Listings Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                Job listings displayed on our platform are aggregated from various sources. We do not
                guarantee the accuracy, completeness, or availability of any job posting. We are not
                responsible for the hiring decisions of any employer or the outcome of any job application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content, features, and functionality are owned by Match Your Job
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                The Service is provided "as is" without warranties of any kind. We shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages resulting from
                your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to terminate or suspend your access to the Service at any time,
                without prior notice, for conduct that we believe violates these Terms or is harmful
                to other users or the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any
                material changes by updating the "Last updated" date. Continued use of the Service
                after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@matchyourjob.com" className="text-blue-600 hover:underline">
                  legal@matchyourjob.com
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
