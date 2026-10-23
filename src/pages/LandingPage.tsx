import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Database,
} from 'lucide-react';
import brightconeEmblem from '../assets/brightcone-emblem.png';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#E3F0FF] selection:text-[#0B6FDB]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#06101F] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={brightconeEmblem} 
              alt="Brightcone Logo" 
              className="h-9 w-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-white font-heading">
              brightcone<span className="text-[#0BA6CC]">.ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/signin"
              className="text-sm font-semibold text-slate-700 hover:text-[#0B6FDB] px-3 sm:px-4 py-2 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0B6FDB] hover:bg-[#095bc2] px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md hover:translate-y-[-1px]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(#0B6FDB_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3F0FF] text-[#0B6FDB] text-xs font-semibold uppercase tracking-wider mb-6 border border-[#0B6FDB]/20">
            <Zap className="w-3.5 h-3.5 text-[#12C2A2]" />
            Powered by Rust, Loco.rs & PostgreSQL
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B2641] tracking-tight leading-tight max-w-4xl mx-auto">
            Everything about people, recruitment, and performance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B6FDB] via-[#0BA6CC] to-[#12C2A2]">
              one modern portal
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Brightcone HR Portal combines enterprise employee directories, end-to-end recruitment pipelines, and real-time performance goal tracking into a secure full-stack platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-[#0B2641] hover:bg-[#071B2F] px-8 py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg hover:translate-y-[-1px]"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 text-[#12C2A2]" />
            </Link>
            <Link
              to="/signin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-8 py-3.5 rounded-xl shadow-xs transition-all hover:border-slate-300"
            >
              Explore Live Demo
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-bold text-[#0B2641]">100%</p>
              <p className="text-xs text-slate-500 font-medium">Rust + SeaORM Backend</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-bold text-[#0B6FDB]">5 Stages</p>
              <p className="text-xs text-slate-500 font-medium">Visual Hiring Pipeline</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-bold text-[#12C2A2]">Sub-millisecond</p>
              <p className="text-xs text-slate-500 font-medium">PostgreSQL Query Times</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-bold text-[#0B2641]">RBAC</p>
              <p className="text-xs text-slate-500 font-medium">Role-Based Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0B2641] tracking-tight">
              Built specifically for modern workforce operations
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Streamline your HR workflows with dedicated modules for managing employee records, candidate pipelines, and quarterly review cycles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Employees */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B6FDB] flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2641]">Employee Directory</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Manage complete employee records, job titles, department assignments, reporting lines, grades, locations, and real-time statuses.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Instant search by name, ID, or department
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    CSV bulk import & structured export
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Detailed slide-over profile drawer
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link to="/employees" className="text-sm font-semibold text-[#0B6FDB] hover:text-[#095bc2] inline-flex items-center gap-1.5">
                  View directory <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Recruitment */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#12C2A2] flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2641]">Recruitment Pipeline</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Post open roles, manage candidate sourcing, schedule panel interviews, and transition applicants through five clear hiring stages.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Interactive Kanban candidate boards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Quick "Post a Job" modal with referral bonus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Interview scheduling & panel assignments
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link to="/recruitment" className="text-sm font-semibold text-[#0B6FDB] hover:text-[#095bc2] inline-flex items-center gap-1.5">
                  Explore pipeline <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Performance */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2641]">Goals & Performance</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Align team members with target milestones, track goal percentage progress, and run structured quarterly performance reviews.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Real-time progress sliders and completion states
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Review cycles with ratings and strengths
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12C2A2]" />
                    Role-protected confidential feedback
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link to="/performance" className="text-sm font-semibold text-[#0B6FDB] hover:text-[#095bc2] inline-flex items-center gap-1.5">
                  Track goals <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Security Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0B2641] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <span className="text-xs font-semibold text-[#12C2A2] uppercase tracking-wider">
                Enterprise Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">
                Engineering excellence at every layer of the stack
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Brightcone HR is built with a resilient Rust Loco backend, SeaORM transactional integrity, and a strict TypeScript frontend. Every endpoint validates permissions on the server before modifying records.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-[#12C2A2]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Argon2 Password Hashing</h4>
                    <p className="text-xs text-slate-300 mt-1">State-of-the-art cryptographic password security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-[#0BA6CC]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">PostgreSQL & SeaORM</h4>
                    <p className="text-xs text-slate-300 mt-1">Transactional status migrations & foreign-key consistency.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-blue-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Strict Role Separation</h4>
                    <p className="text-xs text-slate-300 mt-1">Dedicated ADMIN, HR_MANAGER, RECRUITER and EMPLOYEE views.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#06101F] text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <img 
              src={brightconeEmblem} 
              alt="Brightcone" 
              className="h-7 w-auto object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-white font-heading">
              brightcone<span className="text-[#0BA6CC]">.ai</span>
            </span>
            <span className="text-xs text-slate-400 sm:ml-2">© 2026 Brightcone, Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
            <Link to="/signin" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/recruitment" className="hover:text-white transition-colors">Portal Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
