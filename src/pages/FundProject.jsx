import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import papers from '../data/publishedPapers.json';

const FundProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const paper = papers.find(p => p.id === parseInt(id));

  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!paper) return <div className="text-white">Project not found</div>;

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(Number(e.target.value));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
        alert(`Successfully funded $${amount} to ${paper.researcher}!`);
        setIsProcessing(false);
        navigate(`/project/${id}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <main className="max-w-250 mx-auto px-6 py-12">
        
        <Link to={`/project/${id}`} className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm">Cancel contribution</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
          
          {/* LEFT COLUMN: INPUTS */}
          <div>
            <h1 className="text-3xl font-serif text-white mb-2">Make a contribution</h1>
            <p className="text-[#8b949e] mb-8">You're supporting open science. 100% of your fund goes directly to the researcher.</p>

            {/* 1. Select Amount */}
            <div className="mb-10">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span className="bg-[#1f6feb] w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Select Amount
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {[10, 50, 100].map((val) => (
                        <button
                            key={val}
                            onClick={() => handleAmountClick(val)}
                            className={`py-4 rounded-md border font-bold text-lg transition-all ${
                                amount === val && customAmount === ''
                                ? 'border-[#238636] bg-[#238636]/10 text-[#238636]' 
                                : 'border-[#30363d] bg-[#161b22] hover:border-[#8b949e]'
                            }`}
                        >
                            ${val}
                        </button>
                    ))}
                </div>
                
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b949e]">$</span>
                    <input 
                        type="number" 
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomChange}
                        className={`w-full bg-[#161b22] border rounded-md py-4 pl-8 pr-4 text-white outline-none focus:border-[#1f6feb] transition-colors ${
                            customAmount ? 'border-[#1f6feb]' : 'border-[#30363d]'
                        }`}
                    />
                </div>
            </div>

            {/* 2. Payment Details (Mock) */}
            <form onSubmit={handlePayment}>
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span className="bg-[#1f6feb] w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Payment Details
                </h3>

                <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase text-[#8b949e] mb-2">Cardholder Name</label>
                        <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-[#58a6ff] outline-none" placeholder="Pratham Raj" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase text-[#8b949e] mb-2">Card Number</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={20} />
                            <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#58a6ff] outline-none" placeholder="0000 0000 0000 0000" required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold uppercase text-[#8b949e] mb-2">Expiration</label>
                            <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-[#58a6ff] outline-none" placeholder="MM / YY" required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold uppercase text-[#8b949e] mb-2">CVC</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={16} />
                                <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#58a6ff] outline-none" placeholder="123" required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-[#8b949e] text-sm">
                    <ShieldCheck size={16} className="text-[#238636]" />
                    <span>Payments are secure and encrypted.</span>
                </div>

                <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full mt-8 bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Processing...' : `Confirm Contribution of $${amount}`}
                </button>
            </form>
          </div>

          {/* RIGHT COLUMN: SUMMARY CARD */}
          <div className="hidden md:block">
            <div className="sticky top-24">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#8b949e] mb-4">Summary</h3>
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                    {/* Tiny visual of the abstract */}
                    <div className="h-2 bg-linear-to-r from-blue-500 to-purple-600"></div>
                    
                    <div className="p-6">
                        <h4 className="font-serif text-lg text-white mb-2 leading-tight">
                            {paper.title}
                        </h4>
                        <div className="text-sm text-[#8b949e] mb-6">
                            by <span className="text-[#c9d1d9]">{paper.researcher}</span>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-[#30363d]">
                            <span className="text-[#c9d1d9]">Your contribution</span>
                            <span className="text-white font-mono font-bold">${amount}.00</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-[#30363d]">
                            <span className="text-[#c9d1d9]">Platform fee (0%)</span>
                            <span className="text-[#238636] font-mono font-bold">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-b border-[#30363d]">
                            <span className="font-bold text-white">Total</span>
                            <span className="text-xl font-bold text-white font-mono">${amount}.00</span>
                        </div>

                        <div className="mt-6 p-3 bg-[#1f6feb]/10 border border-[#1f6feb]/20 rounded text-sm text-[#58a6ff] flex gap-2">
                            <CheckCircle2 className="shrink-0" size={18} />
                            <span>You will receive a funding certificate and quarterly updates from the researcher.</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FundProject;