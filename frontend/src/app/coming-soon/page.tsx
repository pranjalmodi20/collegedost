'use client';

import Link from 'next/link';
import { FaArrowLeft, FaHardHat } from 'react-icons/fa';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#83beb2]/10 flex items-center justify-center">
            <FaHardHat className="text-[#83beb2] text-4xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 font-poppins">
          Coming Soon
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We&apos;re working hard to bring this page to you. Stay tuned for updates!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#83beb2] text-white font-semibold rounded-lg hover:bg-[#72b0a3] transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
