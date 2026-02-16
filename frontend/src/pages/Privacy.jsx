import React from 'react';

export default function Privacy() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: February 2026</p>

                <div className="space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p className="leading-relaxed">
                            Lanari Tech ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            or use our applications (Siri, Rise, Academy, etc.) and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Data:</strong> first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> internet protocol (IP) address, your login data, browser type and version.</li>
                            <li><strong>Usage Data:</strong> information about how you use our website, products and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                        <p className="leading-relaxed">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p className="leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have questions about this privacy policy, please contact us at <a href="mailto:privacy@lanari.rw" className="text-blue-400 hover:underline">privacy@lanari.rw</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
