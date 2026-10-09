import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function Home() {
    return (
        <div>
            <section className="relative overflow-hidden px-6 pt-24 pb-28">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 left-1/4 w-[32rem] h-[32rem] bg-blue-500/15 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-1/4 w-[28rem] h-[28rem] bg-violet-500/15 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-5xl mx-auto text-center">
                    <p className="text-sm font-bold tracking-widest text-blue-400 mb-6">LANARI · KIGALI, RWANDA</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                        Build software by <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">describing it.</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Satellite is an AI coding agent. Satellite Host puts what you build online. We train custom models, make our own small coding model, Intore, and run Isiri for Rwandan retail.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://satellite.isiri.rw" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-950 font-bold hover:opacity-90 transition-opacity">Open Satellite</a>
                        <Link to="/contact" className="px-8 py-4 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">Talk to us</Link>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-28">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCTS.map((p, i) => (
                        <Link key={p.slug} to={p.path} className={`group p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:border-gray-500 transition-all hover:-translate-y-1 ${i === 0 ? 'lg:col-span-2' : ''}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-3xl mb-6`}>{p.icon}</div>
                            <div className="text-sm font-semibold text-gray-500 mb-1">{p.tag}</div>
                            <h2 className="text-2xl font-bold text-white mb-3">{p.name}</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">{p.short}</p>
                            <span className="text-blue-400 font-semibold group-hover:underline">Learn more →</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="px-6 pb-28">
                <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-gray-700 bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Have something to build?</h2>
                    <p className="text-lg text-gray-300 mb-8">Tell us what you need: software, hosting, a trained model or a retail system.</p>
                    <Link to="/contact" className="inline-block px-8 py-4 rounded-full bg-white text-gray-950 font-bold hover:bg-gray-200 transition-colors">Contact us</Link>
                </div>
            </section>
        </div>
    );
}
