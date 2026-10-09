import { Link, Navigate } from 'react-router-dom';
import { PRODUCTS, bySlug } from '../data/products';

function Cta({ cta, accent }) {
    const cls = `px-8 py-4 rounded-full bg-gradient-to-r ${accent} text-gray-950 font-bold hover:opacity-90 transition-opacity`;
    return cta.href.startsWith('http')
        ? <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{cta.label}</a>
        : <Link to={cta.href} className={cls}>{cta.label}</Link>;
}

export default function Product({ slug }) {
    const p = bySlug(slug);
    if (!p) return <Navigate to="/" replace />;
    const others = PRODUCTS.filter((x) => x.slug !== p.slug);

    return (
        <div className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">
                    <div>
                        <span className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${p.accent} bg-clip-text text-transparent border border-gray-700 font-bold text-sm mb-6`}>
                            {p.tag.toUpperCase()}
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{p.name}</h1>
                        <p className="text-2xl text-gray-200 mb-4">{p.headline}</p>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed">{p.intro}</p>
                        <div className="flex flex-wrap gap-4">
                            <Cta cta={p.cta} accent={p.accent} />
                            <Link to="/contact" className="px-8 py-4 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">Talk to us</Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${p.accent} opacity-20 blur-3xl rounded-3xl`} />
                        {p.code ? (
                            <div className="relative rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl overflow-hidden">
                                <div className="flex gap-2 px-4 py-3 border-b border-gray-800">
                                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/70" />
                                    <span className="ml-3 text-xs text-gray-500">{p.name}</span>
                                </div>
                                <pre className="p-6 text-sm leading-7 text-gray-300 font-mono overflow-x-auto">{p.code.join('\n')}</pre>
                            </div>
                        ) : p.steps ? (
                            <div className="relative grid grid-cols-2 gap-4">
                                {p.steps.map((s, i) => (
                                    <div key={s} className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
                                        <div className={`text-4xl font-bold bg-gradient-to-r ${p.accent} bg-clip-text text-transparent`}>0{i + 1}</div>
                                        <div className="text-xl text-white font-semibold mt-2">{s}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative rounded-3xl border border-gray-700 bg-gray-900 aspect-square flex items-center justify-center text-9xl">{p.icon}</div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    {p.features.map((f) => (
                        <div key={f.title} className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{f.text}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">More from Satellite AI</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {others.map((o) => (
                        <Link key={o.slug} to={o.path} className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700 hover:border-gray-500 transition-colors">
                            <div className="text-2xl mb-2">{o.icon}</div>
                            <div className="font-bold text-white">{o.name}</div>
                            <div className="text-sm text-gray-400">{o.tag}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
