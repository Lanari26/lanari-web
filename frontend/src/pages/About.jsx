import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold mb-8 text-white">About Satellite AI</h1>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    Satellite AI is a technology company in Kigali, Rwanda. We build tools that let people make software and run a business with less friction.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed mb-12">
                    Our work is Satellite, an AI coding IDE, and Satellite Host, which puts what you build online. We also train custom AI models, build our own small coding model, Intore, and run Isiri, business software for Rwandan retail.
                </p>
                <div className="p-8 rounded-3xl bg-gray-800/50 border border-gray-700 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-3">What we want</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">Good software should be within reach of anyone who can describe what they need, wherever they are.</p>
                </div>
                <Link to="/contact" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-bold">Get in touch</Link>
            </div>
        </div>
    );
}
