import React from "react";


export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      {/* Card */}
      <section className="w-full max-w-3xl rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 text-center">
        {/* Brand */}
        <div className="text-2xl font-semibold text-gray-900">VendorGuard</div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Confident Vendor Risk
          <br className="hidden sm:block" /> Management
        </h1>

        {/* Subcopy */}
        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-600">
          VendorGuard helps organizations evaluate, onboard, and monitor third‑party vendors with ease. Reduce
          risks, stay compliant, and build stronger business relationships.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <a
            href="mailto:info@vendorguards.com?subject=Early%20Access%20Request"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-white text-sm sm:text-base font-medium shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Join the Early Access Program
          </a>
        </div>

        {/* Footer strip */}
        <div className="mt-12 grid grid-cols-1 gap-3 text-sm text-gray-500 sm:grid-cols-3 sm:gap-6 items-center">
          <div className="flex items-center justify-center gap-2">
            <span className="opacity-70">Powered by</span>
            <span className="font-semibold text-gray-700">ORSERS</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="uppercase tracking-widest text-gray-700">Oracle</span>
            <span className="opacity-70">Partner</span>
          </div>
          <div className="flex items-center justify-center">
            <a href="mailto:info@vendorguards.com" className="hover:text-gray-700">info@vendorguards.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
