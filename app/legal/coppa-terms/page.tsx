'use client';

export default function COPPACompliantTerms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Terms of Service - COPPA Compliant
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Age Requirements Section */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🔒 Age Requirements & Child Safety
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800">Under 13 Years Old</h3>
                <p className="text-red-700">
                  In compliance with the Children's Online Privacy Protection Act (COPPA), 
                  children under 13 years of age are <strong>NOT PERMITTED</strong> to create 
                  accounts or use this platform. Any accounts discovered belonging to users 
                  under 13 will be immediately deleted.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800">Ages 13-15 (Young Minors)</h3>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Requires verified parental consent for account creation</li>
                  <li>• Limited messaging capabilities (peer-to-peer only)</li>
                  <li>• All uploads require manual review before publication</li>
                  <li>• Enhanced privacy protections automatically enabled</li>
                  <li>• Parents have oversight and control permissions</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800">Ages 16-17 (Older Minors)</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• Can create accounts with age verification</li>
                  <li>• Restricted messaging with adult users</li>
                  <li>• Content uploads subject to safety review</li>
                  <li>• Access to age-appropriate communities only</li>
                  <li>• Account automatically transitions to adult status at 18</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-800">18+ Years Old (Adults)</h3>
                <ul className="text-green-700 space-y-1">
                  <li>• Full platform access and features</li>
                  <li>• Complete messaging and communication capabilities</li>
                  <li>• Standard content upload and sharing permissions</li>
                  <li>• Can participate in all community features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety Features */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🛡️ Child Safety Features
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We maintain the following safety measures to protect minors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Age Verification:</strong> Mandatory birth date verification for all users</li>
                <li><strong>Content Moderation:</strong> AI-powered and human review of all content involving minors</li>
                <li><strong>Messaging Restrictions:</strong> Adults cannot initiate contact with minors</li>
                <li><strong>Upload Quarantine:</strong> Minor content reviewed before publication</li>
                <li><strong>Reporting System:</strong> Fast-track review for child safety reports</li>
                <li><strong>Parental Controls:</strong> Parents can monitor and control minor accounts</li>
                <li><strong>Automatic Transitions:</strong> Accounts upgrade to adult status on 18th birthday</li>
              </ul>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📊 Data Collection for Minors
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800">Information We Collect from Minors:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Date of birth (for age verification only)</li>
                  <li>Username and display preferences</li>
                  <li>Content posted to the platform</li>
                  <li>Basic usage analytics for safety monitoring</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800">Information We DO NOT Collect from Minors:</h3>
                <ul className="list-disc pl-6 space-y-1 text-red-700">
                  <li>Social Security numbers or government IDs</li>
                  <li>Physical addresses or location data</li>
                  <li>Financial information</li>
                  <li>Contact information without parental consent</li>
                  <li>Sensitive personal information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Parental Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              👨‍👩‍👧‍👦 Parental Rights & Controls
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Parents and legal guardians have the following rights regarding their minor children's accounts:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Oversight:</strong> View and monitor account activity</li>
                <li><strong>Content Control:</strong> Review and approve posts before publication</li>
                <li><strong>Contact Management:</strong> Approve or block communications</li>
                <li><strong>Privacy Settings:</strong> Adjust privacy and safety controls</li>
                <li><strong>Data Access:</strong> Request copies of collected information</li>
                <li><strong>Account Deletion:</strong> Request immediate account termination</li>
                <li><strong>Communication Preferences:</strong> Control notifications and alerts</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800">
                  <strong>To exercise parental rights:</strong> Email us at 
                  <a href="mailto:parents@witnessproject.net" className="underline ml-1">
                    parents@witnessproject.net
                  </a> with verification of your parental status.
                </p>
              </div>
            </div>
          </section>

          {/* Account Transitions */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🎂 Account Transitions at Age 18
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                On a user's 18th birthday, their account automatically transitions to adult status:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Enhanced Features:</strong> Access to full platform capabilities</li>
                <li><strong>Messaging Freedom:</strong> Unrestricted communication with all users</li>
                <li><strong>Content Upload:</strong> Standard upload process without pre-review</li>
                <li><strong>Privacy Control:</strong> Complete control over privacy settings</li>
                <li><strong>Community Access:</strong> Participation in adult-oriented communities</li>
                <li><strong>Parental Independence:</strong> Parental oversight privileges end</li>
              </ul>
            </div>
          </section>

          {/* Reporting & Safety */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              🚨 Reporting & Safety
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We take child safety extremely seriously. Report any concerning behavior:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-800">Emergency Situations</h3>
                  <p className="text-red-700">
                    Immediate danger, threats, or suspected grooming
                  </p>
                  <p className="font-bold text-red-800">
                    📞 Call: 1-800-THE-LOST<br/>
                    📧 Email: emergency@witnessproject.net
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-800">Safety Concerns</h3>
                  <p className="text-yellow-700">
                    Inappropriate content or behavior
                  </p>
                  <p className="font-bold text-yellow-800">
                    Use our in-platform reporting system<br/>
                    📧 Email: safety@witnessproject.net
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              ⚖️ Legal Compliance
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                This platform complies with:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Children's Online Privacy Protection Act (COPPA)</li>
                <li>General Data Protection Regulation (GDPR) for EU users</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>State and federal child protection laws</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📧 Contact Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>General Inquiries:</strong> support@witnessproject.net</p>
              <p><strong>Child Safety:</strong> safety@witnessproject.net</p>
              <p><strong>Parental Concerns:</strong> parents@witnessproject.net</p>
              <p><strong>Legal Matters:</strong> legal@witnessproject.net</p>
              <p><strong>Emergency:</strong> emergency@witnessproject.net</p>
            </div>
          </section>
        </div>
        
        <div className="text-center mt-8 text-gray-600">
          <p>Last Updated: December 15, 2025</p>
          <p>Effective Date: December 15, 2025</p>
        </div>
      </div>
    </div>
  );
}