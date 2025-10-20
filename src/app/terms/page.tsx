export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
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
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using the Ndigbo Viva website and services, you agree to be bound by 
              these Terms of Service and all applicable laws and regulations. If you do not agree 
              with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Ndigbo Viva&apos;s 
              website for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities that occur under your account.
            </p>

            <h2>Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>

            <h2>Content and Intellectual Property</h2>
            <p>
              The content on this website, including but not limited to text, graphics, logos, images, 
              audio clips, video, and software, is the property of Ndigbo Viva and is protected by 
              copyright and other intellectual property laws.
            </p>

            <h2>User-Generated Content</h2>
            <p>
              By submitting content to our website, you grant Ndigbo Viva a non-exclusive, royalty-free, 
              perpetual, and worldwide license to use, modify, publicly perform, publicly display, 
              reproduce, and distribute such content.
            </p>

            <h2>Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the website, to understand our practices.
            </p>

            <h2>Disclaimers</h2>
            <p>
              The information on this website is provided on an &ldquo;as is&rdquo; basis. To the fullest extent 
              permitted by law, Ndigbo Viva excludes all representations, warranties, conditions, 
              and terms relating to our website and the use of this website.
            </p>

            <h2>Limitations of Liability</h2>
            <p>
              In no event shall Ndigbo Viva or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Ndigbo Viva&apos;s website, 
              even if Ndigbo Viva or a Ndigbo Viva authorized representative has been notified orally 
              or in writing of the possibility of such damage.
            </p>

            <h2>Accuracy of Materials</h2>
            <p>
              The materials appearing on Ndigbo Viva&apos;s website could include technical, typographical, 
              or photographic errors. Ndigbo Viva does not warrant that any of the materials on its 
              website are accurate, complete, or current.
            </p>

            <h2>Links to Other Websites</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned 
              or controlled by Ndigbo Viva. We have no control over, and assume no responsibility for, 
              the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, 
              without prior notice or liability, under our sole discretion, for any reason whatsoever 
              and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the United States, without 
              regard to its conflict of law provisions. Our failure to enforce any right or provision 
              of these Terms will not be considered a waiver of those rights.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any 
              time. If a revision is material, we will provide at least 30 days notice prior to any 
              new terms taking effect.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: ndigboviva@outlook.com</li>
              <li>Website: <a href="/contact" className="text-yellow-600 hover:text-yellow-700">Contact Form</a></li>
            </ul>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable by a court, 
              the remaining provisions of these Terms will remain in effect.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
