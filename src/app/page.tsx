'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
// FIX: Removed 'Rocket' from the import list
import { ListTodo, BrainCircuit, Notebook, User, ArrowRight, Sparkles } from 'lucide-react'; 
import { useEffect, useState } from 'react'; // Import useEffect and useState

const featureCards = [
  {
    id: 1,
    title: "Full Stack API Basics",
    description: "Create and manage todos with a Next.js API route",
    icon: <ListTodo className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-500/10",
    href: "/todos"
  },
  {
    id: 2,
    title: "App Integration Mock",
    description: "Mock integration for NoteSync with Notion provider",
    icon: <Notebook className="w-6 h-6" />,
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-500/10",
    href: "/notesync"
  },
  {
    id: 3,
    title: "AI Integration",
    description: "Chat feature powered by OpenAI's language model",
    icon: <BrainCircuit className="w-6 h-6" />,
    color: "from-green-400 to-teal-500",
    bgColor: "bg-green-500/10",
    href: "/chat"
  },
  {
    id: 4,
    title: "Developer Mindset",
    description: "Share your thoughts and past experiences",
    icon: <User className="w-6 h-6" />,
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-500/10",
    href: "/developer-mindset"
  }
];

// Define a type for your particle properties
interface Particle {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  xOffset: number;
  yOffset: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // This code will only run on the client-side
    const generatedParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      xOffset: Math.random() * 100 - 50, // For motion.div animate x
      yOffset: Math.random() * 100 + 50 // For motion.div animate y
    }));
    setParticles(generatedParticles);
  }, []); // Empty dependency array means this runs once after initial render

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => ( // Use the state-managed particles
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, particle.yOffset],
              x: particle.xOffset
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: particle.delay
            }}
            className="absolute rounded-full bg-white/10"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <header className="container mx-auto py-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Intern Screening Test</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Intern Recruitment Drive
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI-integrated Full Stack Developer Screening Platform
            </p>
          </motion.div>
        </header>

        <main className="container mx-auto px-4 pb-20">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={card.href}>
                  <div className={`h-full p-6 rounded-2xl border border-white/10 backdrop-blur-sm ${card.bgColor} hover:bg-white/5 transition-all duration-300`}>
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${card.color}`}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-400 mb-4">{card.description}</p>
                    <div className="flex items-center text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                      Explore feature <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
}