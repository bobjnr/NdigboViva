import Link from 'next/link'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center">
            <span className="text-brand-gold">Statement of Ethics</span>
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              STATEMENT OF ETHICS, TRANSPARENCY & PUBLIC TRUST
            </h2>
            
            <div className="space-y-8">
              <p className="text-gray-700">
                In line with YouTube Community Guidelines, Originality, Fair Use and Monetization Policies, 
                we in Ndigbo Viva Channel uphold full transparency in all aspects of our operations as we 
                pursue our mission to advance Igbo Civilization and promote the welfare of Ndigbo all over 
                the world.
              </p>

              <p className="text-gray-700">
                We are grateful to and respect the copyright of all authors, creators, human/digital 
                assistants and collaborators whose expertise, ideas and materials form part of our final 
                output, whether video, livestream, or article by obtaining their consent where applicable 
                and in all cases giving proper credit to them in line with copyright, Fair use and 
                Originality laws.
              </p>

              <p className="text-gray-700">
                To achieve Community Trust and Public Confidence our editorial and production processes, 
                maintain a clear chain of accountability that promotes research verification, encourages 
                constructive dialogue and fact-based criticism with shared learning. we also prohibit 
                hate speech, misinformation, or personal attacks. If an error or omission is identified, 
                we promptly post Transparent Corrections in the description, pinned comment, or 
                acknowledgement page.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">DISCLAIMER</h3>
                <p className="text-gray-700">
                  All our videos are produced for the purposes of educational and cultural commentary 
                  and may contain materials protected by copyright law. Please note that all rights 
                  remain with the original creators in line with Fair Use and no infringement is 
                  intended. If any author feels inadequately acknowledged or copyright not fairly used, 
                  or any of our viewers have concerns/need clarifications please urgently contact: 
                  <a 
                    href="mailto:ndigbovivalimited@gmail.com"
                    className="text-brand-gold hover:text-brand-gold-dark ml-1"
                  >
                    ndigbovivalimited@gmail.com
                  </a>
                </p>
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/acknowledgements"
                  className="inline-flex items-center px-6 py-3 bg-brand-gold text-white font-semibold rounded-md hover:bg-brand-gold-dark transition-colors"
                >
                  ← Back to Acknowledgements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}