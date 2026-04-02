import { useState } from 'react';
import { ACADEMY_COURSES } from '@/data/funds';

const AcademyPage = () => {
  const [enrollModal, setEnrollModal] = useState<string | null>(null);
  const course = ACADEMY_COURSES.find(c => c.id === enrollModal);

  return (
    <div>
      <div className="mb-8">
        <div className="font-label text-[0.62rem] text-gold tracking-[0.25em] uppercase mb-2">Education</div>
        <h2 className="font-heading text-[1.8rem] font-light text-t1 mb-2">ASP Academy</h2>
        <p className="font-body text-[0.85rem] text-t3 leading-[1.7]">Institutional-grade investment education from fund managers and industry experts.</p>
      </div>
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        {ACADEMY_COURSES.map(c => (
          <div key={c.id} className="bg-s1 border border-b1 p-6 flex flex-col">
            <div className="font-heading text-[1rem] text-t1 mb-2">{c.title}</div>
            <p className="font-body text-[0.82rem] text-t3 leading-[1.7] mb-4 flex-1">{c.desc}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[1.2rem] text-gold">${c.price}</span>
              <span className="font-mono text-[0.68rem] text-t4">{c.duration}</span>
            </div>
            <button onClick={() => setEnrollModal(c.id)} className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-void bg-gold border-none py-3 cursor-pointer hover:bg-gold-bright transition-all min-h-[44px]">Enroll Now →</button>
          </div>
        ))}
      </div>

      {enrollModal && course && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={() => setEnrollModal(null)} />
          <div className="relative bg-void border border-b2 w-full max-w-[440px]">
            <div className="flex justify-between items-center py-4 px-6 border-b border-b1">
              <span className="font-label text-[0.72rem] text-gold tracking-[0.2em] uppercase">Enroll</span>
              <button onClick={() => setEnrollModal(null)} className="font-mono text-t3 text-lg bg-transparent border-none cursor-pointer hover:text-t1">✕</button>
            </div>
            <div className="p-6">
              <div className="font-heading text-[1.1rem] text-t1 mb-2">{course.title}</div>
              <div className="font-mono text-[1.6rem] text-gold mb-4">${course.price}</div>
              <p className="font-body text-[0.82rem] text-t3 leading-[1.7] mb-6">Payment processing coming soon. Your enrollment will be confirmed via email.</p>
              <button onClick={() => setEnrollModal(null)} className="w-full font-label text-[0.62rem] tracking-[0.12em] uppercase text-void bg-gold border-none py-3.5 cursor-pointer hover:bg-gold-bright transition-all min-h-[48px]">Confirm Enrollment — ${course.price}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyPage;
