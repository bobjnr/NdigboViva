export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-yellow-100">
            Last updated: January 15, 2024
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none ">
            <h2>Introduction</h2>
            <p>
              Ndigbo Viva (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website and use our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul>
              <li>Name and email address when you register for an account</li>
              <li>Profile information you choose to provide</li>
              <li>Communication preferences and notification settings</li>
              <li>Any other information you voluntarily provide through our contact forms or surveys</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We may automatically collect certain information about your device and usage, including:</p>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
              <li>Device information and operating system</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process your account registration and manage your profile</li>
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul>
              <li>With your explicit consent</li>
              <li>To service providers who assist us in operating our website and conducting our business</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              You can control cookie settings through your browser preferences.
            </p>

            <h2>Third-Party Services</h2>
            <p>Our website may integrate with third-party services, including:</p>
            <ul>
              <li>YouTube API for video content</li>
              <li>Firebase for authentication and data storage</li>
              <li>Mailchimp for email marketing</li>
              <li>Google Analytics for website analytics</li>
            </ul>
            <p>
              These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to certain types of processing</li>
              <li>Data portability</li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <ul>
              <li>Email: ndigboviva@outlook.com</li>
              <li>Website: <a href="/contact" className="text-yellow-600 hover:text-yellow-700">Contact Form</a></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
