import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ArrowLeft, Share2, Clock, DollarSign } from 'lucide-react';
import papers from '../data/publishedPapers.json';

const PaperView = () => {
    const { id } = useParams();

    // Find the specific paper based on the URL ID
    const paper = papers.find(p => p.id === parseInt(id));

    // Scroll to top when page opens
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!paper) return <div className="text-white text-center mt-20">Project not found</div>;

    // Calculate Progress Percentage for the bar
    const progressPercentage = Math.min((paper.raised / paper.goal) * 100, 100);

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
            <Navbar />

            <main className="max-w-300 mx-auto px-6 py-12">

                {/* Back Button (Stays at the very top) */}
                <Link to="/" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm">Back to Explore</span>
                </Link>

                {/* THE 2-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

                    {/* ================= LEFT COLUMN: CONTENT ================= */}
                    <div>

                        {/* Category & Date */}
                        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#58a6ff] mb-4">
                            <span>{paper.category}</span>
                            <span className="text-[#30363d]">|</span>
                            <span className="text-[#8b949e]">Published Oct 2024</span>
                        </div>

                        {/* Big Title */}
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight mb-6">
                            {paper.title}
                        </h1>

                        {/* Researcher Profile */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600"></div>
                            <div>
                                <div className="text-white font-medium">{paper.researcher}</div>
                                <div className="text-sm text-[#8b949e]">{paper.institution}</div>
                            </div>
                        </div>

                        {/* Abstract "Hook" */}
                        <div className="text-xl leading-relaxed text-[#c9d1d9] font-light mb-10 border-l-4 border-[#58a6ff] pl-6 italic">
                            {paper.abstract}
                        </div>

                        {/* Full Content (Simulated Article) */}
                        <article className="prose prose-invert prose-lg max-w-none text-[#c9d1d9]">
                            <p>
                                Traditional methodologies have long struggled to address the core inefficiencies present in this domain.
                                Our approach leverages a novel framework that integrates recent advancements in high-throughput analysis.
                            </p>
                            <h3 className="text-white mt-8 mb-4 font-serif text-2xl">The Methodology</h3>
                            <p>
                                By synthesizing data from over 500 independent trials, we have established a correlation that was previously
                                obscured by noise. The experimental setup utilized a distributed sensor network, allowing for real-time
                                data acquisition at a granularity of 5ms.
                            </p>
                            <p>
                                This precision is critical. As shown in preliminary studies (Smith et al., 2023), the margin for error
                                in these environments is less than 0.5%. Our system achieves a stability rating of 99.8%, significantly
                                outperforming the current industry standard.
                            </p>
                            <h3 className="text-white mt-8 mb-4 font-serif text-2xl">Potential Impact</h3>
                            <p>
                                If fully funded, this project moves to Phase 2: Field Trials. The implications for the industry are vast,
                                potentially reducing operational costs by 40% while simultaneously lowering the carbon footprint of
                                production by an estimated 15,000 tons annually.
                            </p>
                        </article>

                    </div>


                    {/* ================= RIGHT COLUMN: FUNDING WIDGET (Sticky) ================= */}
                    <div className="hidden lg:block sticky top-24">
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 shadow-xl">

                            {/* Progress Bar Container */}
                            <div className="w-full bg-[#30363d] h-3 rounded-full mb-4 overflow-hidden">
                                <div
                                    className="bg-[#238636] h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Stats */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">${paper.raised.toLocaleString()}</span>
                                        <span className="text-[#8b949e] text-sm">raised out of ${paper.goal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[#8b949e] text-sm mt-1">
                                        <Clock size={16} />
                                        <span className="font-semibold">{paper.days_left} days left</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-[#30363d] my-1"></div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <Link to={`/fund/${paper.id}`} className="flex-1">
                                        <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
                                            <DollarSign size={16} />
                                            Fund this project
                                        </button>
                                    </Link>
                                    <button className="px-3 border border-[#30363d] text-[#c9d1d9] rounded-md hover:bg-[#30363d] transition-colors flex items-center gap-2 font-medium text-sm">
                                        <Share2 size={16} />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default PaperView;