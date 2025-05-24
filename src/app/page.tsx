"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Code,
  Star,
  Target,
  Users,
  TrendingUp,
  Award,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Zap,
  Globe,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useParticles } from "@/hooks/useParticles";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Typed Text Component
const TypedText: React.FC<{ texts: string[]; speed?: number }> = ({
  texts,
  speed = 100,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];

      if (isDeleting) {
        setCurrentText((prev) => prev.slice(0, -1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(fullText.slice(0, currentText.length + 1));
        if (currentText === fullText) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 1500);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, isPaused]);

  return (
    <span className="border-r-2 border-primary-400 animate-pulse">
      {currentText}
    </span>
  );
};

// Featured Project Card
const FeaturedProject: React.FC<{
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  delay?: number;
}> = ({ title, description, tags, image, link, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="relative overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={link}
        className="flex items-center text-primary-400 hover:text-primary-300 transition-colors text-sm"
      >
        <span>Ver Projeto</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  </motion.div>
);

// Skill Card Component
const SkillCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  level: number;
  delay?: number;
}> = ({ icon, title, description, level, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="text-3xl text-primary-400 mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>

    <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1, delay: delay + 0.3 }}
        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
      />
    </div>
    <div className="text-right text-xs text-gray-400">{level}%</div>
  </motion.div>
);

export default function HomePage() {
  const canvasRef = useParticles(80);
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.3 });
  const [projectsRef, projectsInView] = useIntersectionObserver({ threshold: 0.3 });
  const [skillsRef, skillsInView] = useIntersectionObserver({ threshold: 0.3 });
  const [statsRef, statsInView] = useIntersectionObserver({ threshold: 0.3 });

  const featuredProjects = [
    {
      title: "E-commerce Platform",
      description:
        "Plataforma completa de e-commerce com React, Node.js e PostgreSQL",
      tags: ["React", "Node.js", "PostgreSQL"],
      image: "/api/placeholder/800/600",
      link: "/projects/ecommerce-platform",
    },
    {
      title: "AI Chat Assistant",
      description:
        "Assistente de chat inteligente usando OpenAI GPT e React Native",
      tags: ["React Native", "OpenAI", "Firebase"],
      image: "/api/placeholder/800/600",
      link: "/projects/ai-chat-assistant",
    },
    {
      title: "Portfolio Dashboard",
      description: "Dashboard administrativo para gerenciamento de portfolio",
      tags: ["Next.js", "TypeScript", "MongoDB"],
      image: "/api/placeholder/800/600",
      link: "/projects/portfolio-dashboard",
    },
  ];

  const keySkills = [
    {
      icon: <Code />,
      title: "Frontend Development",
      description:
        "Criação de interfaces modernas e responsivas com React, Next.js e TypeScript",
      level: 95,
    },
    {
      icon: <Zap />,
      title: "Backend Development",
      description:
        "APIs robustas e escaláveis com Node.js, Express e bancos de dados relacionais/NoSQL",
      level: 90,
    },
    {
      icon: <Briefcase />,
      title: "Mobile Development",
      description:
        "Desenvolvimento de aplicativos mobile com React Native para iOS e Android",
      level: 85,
    },
    {
      icon: <Globe />,
      title: "DevOps & Cloud",
      description:
        "Implementação de CI/CD, Docker, e soluções em nuvem com AWS e Firebase",
      level: 80,
    },
  ];

  const stats = [
    {
      icon: <Target className="w-8 h-8" />,
      value: "50+",
      label: "Projetos Concluídos",
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "25+",
      label: "Clientes Satisfeitos",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "8+",
      label: "Certificações",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "5+",
      label: "Anos de Experiência",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-20 right-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Olá, eu sou{" "}
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Rafael Bispo
            </span>
            .
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Desenvolvedor full stack com experiência em tecnologias modernas e
            foco em inovação.
          </p>
          <p className="text-2xl md:text-3xl font-semibold mb-12">
            Eu <TypedText texts={["crio.", "desenvolvo.", "inovo."]} />
          </p>

          <Link
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 transition-colors font-semibold"
          >
            Ver Projetos
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </Link>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section
        ref={projectsRef}
        id="projects"
        className="relative max-w-7xl mx-auto py-20 px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={projectsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-5xl font-extrabold mb-12"
        >
          <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Projetos em Destaque
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <FeaturedProject key={index} {...project} delay={index * 0.2} />
          ))}
        </div>
      </section>

      {/* Key Skills Section */}
      <section
        ref={skillsRef}
        id="skills"
        className="relative py-20 px-6 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Habilidades Principais
              </span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Competências que me destacam e que aplico em projetos reais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keySkills.map((skill, index) => (
              <SkillCard key={index} {...skill} delay={index * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        id="stats"
        className="relative max-w-7xl mx-auto py-20 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Estatísticas
            </span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Alguns números que mostram minha experiência e dedicação.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map(({ icon, value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="text-primary-400 mb-3">{icon}</div>
              <div className="text-4xl font-extrabold">{value}</div>
              <div className="text-gray-400">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
