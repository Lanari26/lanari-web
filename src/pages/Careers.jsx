import React from 'react';

export default function Careers() {
    const jobs = [
        { title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote / Kigali', dept: 'Engineering' },
        { title: 'UI/UX Designer', type: 'Full-time', location: 'Kigali', dept: 'Design' },
        { title: 'Marketing Specialist', type: 'Part-time', location: 'Remote', dept: 'Marketing' },
        { title: 'AI Research Intern', type: 'Internship', location: 'Kigali', dept: 'Research' },
    ];

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-white">Join Our Team</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Be part of a team that is redefining the future of technology in Africa. We are looking for passionate, curious, and driven individuals.
                    </p>
                </div>

                <div className="grid gap-6">
                    {jobs.map((job, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-gray-800/40 border border-gray-700 hover:border-blue-500/50 transition-all hover:bg-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-400 font-medium">
                                    <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300">{job.dept}</span>
                                    <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300">{job.type}</span>
                                    <span className="flex items-center gap-1">📍 {job.location}</span>
                                </div>
                            </div>
                            <button className="px-6 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-blue-50 transition-colors w-full md:w-auto">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-4">Don't see the right fit?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        We are always on the lookout for talent. Send us your CV and tell us how you can make a difference at Lanari Tech.
                    </p>
                    <a href="mailto:careers@lanari.rw" className="inline-block px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-all">
                        Email Us
                    </a>
                </div>
            </div>
        </div>
    );
}
