'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start bg-gray-50 text-gray-900">
      {/* HERO */}
      <section className="w-full relative flex flex-col items-center justify-center text-center py-12 px-4 bg-white text-gray-900">
        <div className="max-w-6xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            AgentFlow.ai
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto text-gray-700">
            Build, manage & embed custom AI chatbots and agents for your website — one powerful platform, endless possibilities.
          </p>
          <Image
            src="/assets/main.png"
            alt="AgentFlow Hero"
            width={1200}
            height={600}
            className="rounded-xl shadow-xl border border-gray-200"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full max-w-7xl py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gray-50 text-gray-900">
        {[
          {
            title: 'Custom AI Agents',
            desc: 'Create tailored AI agents for support, sales or engagement — no code needed.',
            img: '/assets/feature1.png',
          },
          {
            title: 'One Script Embed',
            desc: 'Add your chatbot to any website with one lightweight script.',
            img: '/assets/feature2.png',
          },
          {
            title: 'Insights & Analytics',
            desc: 'Understand conversations & optimize your AI for better results.',
            img: '/assets/feature3.png',
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <Image
              src={feature.img}
              alt={feature.title}
              width={400}
              height={300}
              className="rounded-lg mb-4 shadow-sm border border-gray-100"
            />
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full bg-gray-100 py-24 px-6 flex flex-col md:flex-row items-center justify-center gap-12 text-gray-900">
        <Image
          src="/assets/howitworks.png"
          alt="How AgentFlow Works"
          width={500}
          height={400}
          className="rounded-lg shadow-lg border border-gray-200"
        />
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            How It Works
          </h2>
          <ol className="text-gray-700 space-y-2 list-decimal list-inside">
            <li>Sign up & create your AI chatbot in minutes.</li>
            <li>Train with your data or use smart templates.</li>
            <li>Embed with a single script anywhere.</li>
            <li>Track usage & improve performance.</li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-6 bg-838383 text-white text-center" style={{ backgroundColor: '#838383' }}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Start building with AgentFlow.ai
        </h2>
        <p className="mb-8 text-lg text-indigo-100">
          Your all-in-one solution for smart, custom AI chatbots — no coding required.
        </p>
        <button className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold shadow-md hover:bg-gray-100 hover:text-indigo-800 transition">
          Get Started Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 text-gray-400 text-sm bg-gray-900">
        © {new Date().getFullYear()} AgentFlow.ai — All rights reserved.
      </footer>
    </main>
  )
}