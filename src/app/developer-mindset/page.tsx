'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
// Add ArrowRight to the import statement
import { ArrowLeft, ArrowRight } from 'lucide-react'; 

export default function DeveloperMindsetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="container mx-auto max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-8 space-y-8">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 mb-4">
            Developer Mindset
          </h1>
          <p className="text-lg text-gray-300">
            My thoughts and approach to development.
          </p>
        </motion.header>

        {/* Questions and Answers */}
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 bg-white/10 rounded-lg shadow-inner"
          >
            <h2 className="text-2xl font-semibold mb-3 text-white/90">
              1. What's the most exciting tool/stack you’ve explored recently?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The most exciting thing I've looked into recently is **`shadcn/ui`**. It's not a regular UI library, but more like a collection of ready-to-use components for React. What's cool is that you get the actual code for these components, not just a pre-built library. This means you have full control over how they look and work, and you can easily change them using Tailwind CSS. It helps build nice-looking UIs very fast, but still lets you customize everything perfectly.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 bg-white/10 rounded-lg shadow-inner"
          >
            <h2 className="text-2xl font-semibold mb-3 text-white/90">
              2. Describe how you approach debugging when stuck.
            </h2>
            <p className="text-gray-300 leading-relaxed">
              When I get stuck with a bug, I usually follow these steps:
              <ol className="list-decimal list-inside pl-4 mt-2 space-y-1">
                <li>
                  **Understand the Problem:** I first read any error messages carefully and try to understand what went wrong.
                </li>
                <li>
                  **Make it Happen Again:** I try to make the bug appear consistently. If it only happens sometimes, I look for what might be causing it.
                </li>
                <li>
                  **Break it Down:** I divide the problem into smaller parts. Is it the front end or the back end? Is it an API call or something visual? I use `console.log` a lot to see what's happening at different stages of the code.
                </li>
                <li>
                  **Isolate the Issue:** I try to find the exact part of the code causing the problem. Sometimes I remove other parts of the code temporarily to do this.
                </li>
                <li>
                  **Check My Assumptions:** I think about whether I might have misunderstood how a part of the code or a tool works. I re-read documentation if needed.
                </li>
                <li>
                  **Search for Help:** I use Google or Stack Overflow to search for the error message or similar problems.
                </li>
                <li>
                  **Explain it Out Loud:** I find that explaining the problem to myself, or even to an object (like a "rubber duck"), often helps me see the solution clearly.
                </li>
                <li>
                  **Take a Break:** If I'm really stuck and frustrated, I step away for a bit. A short break often helps me come back with a fresh mind and find the answer.
                </li>
              </ol>
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 bg-white/10 rounded-lg shadow-inner"
          >
            <h2 className="text-2xl font-semibold mb-3 text-white/90">
              3. Share a link to one past project (GitHub/CodeSandbox/etc) you’re proud of (if any).
            </h2>
            <p className="text-gray-300">
              I'm proud of a small web application I built for managing personal tasks. It was built using Next.js and a simple JSON server.
              <br />
              {/* IMPORTANT: REPLACE THE LINK BELOW WITH YOUR ACTUAL PROJECT LINK */}
              <Link href="https://github.com/YourUsername/YourAwesomeProject" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center mt-2">
                https://github.com/YourUsername/YourAwesomeProject <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <br />
              <span className="text-sm text-gray-400 italic">
                (Brief description: This project is a simple task management app demonstrating CRUD operations and basic UI/UX principles.)
              </span>
            </p>
          </motion.section>
        </div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center pt-8"
        >
          <Link href="/">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-medium shadow-lg hover:shadow-cyan-400/50 transform hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Homepage
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}