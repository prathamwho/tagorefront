import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, CheckCircle2, Info, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useProjectStore } from '../store/useProjectStore'; // <--- Import Store

const FundProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Get real data from Store instead of JSON
  const { getProjectById, selectedProject, isFetchingProjects } = useProjectStore();

  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Fetch project details on load
  useEffect(() => {
    getProjectById(id);
    window.scrollTo(0, 0);
  }, [id, getProjectById]);

  // 3. Loading State
  if (isFetchingProjects || !selectedProject) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1f6feb]" size={40} />
      </div>
    );
  }

  const paper = selectedProject;

  // Fee Logic
  const processingFee = (amount * 0.029) + 0.30;
  const netAmount = amount - processingFee;

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(val) && Number(val) > 0) {
        setAmount(Number(val));
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call (We will connect Razorpay here next)
    setTimeout(() => {
        alert(`Thank you! Successfully funded $${amount} to ${paper.researcherName}.`);
        setIsProcessing(false);
        navigate(`/project/${id}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <main className="max-w-275 mx-auto px-6 py-12">
        
        <Link to={`/project/${id}`} className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm">Cancel contribution</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          
          {/* ================= LEFT COLUMN: ACTION ZONE ================= */}
          <div>
            <h1 className="text-3xl font-serif text-white mb-2">Make a contribution</h1>
            <p className="text-[#8b949e] mb-8 text-sm">You're supporting open science. 100% of your fund goes directly to the research team.</p>

            {/* SELECT AMOUNT */}
            <div className="mb-10">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span className="bg-[#1f6feb] w-6 h-6 rounded-full flex items-center justify-center text-xs text-white">1</span>
                    Select Amount
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {[10, 50, 100].map((val) => (
                        <button
                            key={val}
                            type="button"
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
                
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b949e] group-focus-within:text-[#1f6feb] transition-colors">$</span>
                    <input 
                        type="number" 
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomChange}
                        min="1"
                        className={`w-full bg-[#161b22] border rounded-md py-4 pl-8 pr-4 text-white outline-none focus:border-[#1f6feb] transition-colors ${
                            customAmount ? 'border-[#1f6feb]' : 'border-[#30363d]'
                        }`}
                    />
                </div>
            </div>

            {/* PAYMENT FORM */}
            <form onSubmit={handlePayment}>
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span className="bg-[#1f6feb] w-6 h-6 rounded-full flex items-center justify-center text-xs text-white">2</span>
                    Payment Details
                </h3>

                <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
                    <div className="mb-5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-2">Cardholder Name</label>
                        <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-[#58a6ff] outline-none transition-colors" placeholder="e.g. Pratham Raj" required />
                    </div>

                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">Card Number</label>
                            <div className="flex gap-1.5 opacity-70">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 bg-white px-1 rounded-sm" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3 bg-white px-1 rounded-sm" alt="Mastercard" />
                            </div>
                        </div>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
                            <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#58a6ff] outline-none transition-colors font-mono" placeholder="0000 0000 0000 0000" maxLength={19} required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e] mb-2">Expiration</label>
                            <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-[#58a6ff] outline-none transition-colors text-center" placeholder="MM / YY" required />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">CVC</label>
                                <Info size={12} className="text-[#8b949e] cursor-help" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={16} />
                                <input type="password" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#58a6ff] outline-none transition-colors" placeholder="123" maxLength={4} required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4 px-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#0d1117] text-[#238636] focus:ring-0 focus:ring-offset-0" />
                        <span className="text-sm text-[#c9d1d9] group-hover:text-white transition-colors">
                            Securely save this card for future contributions
                        </span>
                    </label>
                </div>

                <div className="flex items-center gap-2 mt-8 mb-4 text-[#8b949e] text-xs justify-center">
                    <ShieldCheck size={14} className="text-[#238636]" />
                    <span>Payments are SSL encrypted and secured by Stripe.</span>
                </div>

                <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Processing Transaction...' : `Confirm Contribution of $${amount}`}
                </button>
            </form>
          </div>

          {/* ================= RIGHT COLUMN: SUMMARY (STICKY) ================= */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#8b949e] mb-4">Summary</h3>
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-xl">
                    <div className="h-1.5 bg-linear-to-r from-blue-500 to-purple-600"></div>
                    
                    <div className="p-6">
                        <h4 className="font-serif text-lg text-white mb-4 leading-tight">
                            {paper.title}
                        </h4>

                        <div className="flex items-center gap-3 mb-6 p-3 bg-[#0d1117] border border-[#30363d] rounded-md">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                {/* Use researcherName (Database field) */}
                                {paper.researcherName?.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#8b949e] uppercase tracking-wider font-bold">Research Lead</span>
                                {/* Use researcherName (Database field) */}
                                <span className="text-sm font-medium text-[#c9d1d9]">{paper.researcherName}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#c9d1d9]">Your contribution</span>
                                <span className="text-white font-mono font-bold">${amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#8b949e]">Platform fee (0%)</span>
                                <span className="text-[#238636] font-mono">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pb-3 border-b border-[#30363d]">
                                <span className="text-[#8b949e]">Processing fee (~2.9%)</span>
                                <span className="text-[#8b949e] font-mono">${processingFee.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-1">
                                <span className="font-bold text-white text-lg">Total</span>
                                <span className="text-xl font-bold text-white font-mono">${amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-[11px] text-right text-[#8b949e] mb-6 italic">
                             ~ ${netAmount.toFixed(2)} goes directly to the project.
                        </div>

                        <div className="p-3 bg-[#1f6feb]/10 border border-[#1f6feb]/20 rounded text-xs text-[#58a6ff] flex gap-2 leading-relaxed">
                            <CheckCircle2 className="shrink-0 mt-0.5" size={14} />
                            <span>You will receive a digital funding certificate and priority access to research updates.</span>
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