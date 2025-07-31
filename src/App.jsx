import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MessageModal = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const borderColor = isSuccess ? "border-green-700" : "border-red-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-xl z-[9999] text-white font-semibold flex items-center justify-between gap-4 ${bgColor} border-2 ${borderColor}`}
    >
      <p>{message}</p>
      <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
};
const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setStatusMessage(null); 

    try {
      const response = await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatusMessage({ message: result.message, type: "success" });
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      } else {
        setStatusMessage({ message: result.error || "Something went wrong.", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage({ message: "Network error. Please try again later.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 text-left"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence>
        {statusMessage && (
          <MessageModal
            message={statusMessage.message}
            type={statusMessage.type}
            onClose={() => setStatusMessage(null)}
          />
        )}
      </AnimatePresence>

      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
        <label htmlFor="name" className="text-gray-400">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
        <label htmlFor="email" className="text-gray-400">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
        <label htmlFor="message" className="text-gray-400">Your Message</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors"
        ></textarea>
      </motion.div>
      <motion.div className="flex gap-4 mt-4" variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
        <button
          type="submit"
          disabled={isSubmitting} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-base font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-base font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </motion.div>
    </motion.form>
  );
};


function App() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showMain, setShowMain] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const fullText = "{hello world}";
  const modifiedText = "{hello user}";

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          let backspaceIndex = fullText.length;
          const backspaceInterval = setInterval(() => {
            if (backspaceIndex > "{hello ".length) {
              setTypedText(fullText.slice(0, backspaceIndex - 1));
              backspaceIndex--;
            } else {
              clearInterval(backspaceInterval);
              let newIndex = "{hello ".length;
              const typeUserInterval = setInterval(() => {
                setTypedText(modifiedText.slice(0, newIndex + 1));
                newIndex++;
                if (newIndex === modifiedText.length) {
                  clearInterval(typeUserInterval);
                  setTimeout(() => {
                    setLoading(false);
                    setTimeout(() => {
                      setShowMain(true);
                    }, 300);
                  }, 1500);
                }
              }, 100);
            }
          }, 100);
        }, 1000);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const popOutVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const projects = [
    {
      title: "Simple Data Analyst Agent",
      description: "A Streamlit based AI agent that can analyze and answer from uploaded files using LLaMA-4 model. ",
      tech: ["Python", "Streamlit", "Pandas", "Seaborn", "Pytesseract", "TogetherAPI", "Easyocr"],
      link: "https://github.com/VishalSrikanth16/Simple-Data-Analyst-Agent"
    },
    {
      title: "Intelliresume",
      description: "An intelligent AI powered web application that analyzes your resume against a job description to Extract relevant skills, Score your resume based on ATS principles, Generate personalized improvement suggestions.",
      tech: ["Python", "Streamlit", "PyMuPDF", "NLTK", "Cohere API", "FuzzyWuzzy"],
      link: "https://github.com/VishalSrikanth16/IntelliResume"
    },
    {
      title: "Vibe Vision",
      description: "a music player that uses face recognition to detect users' emotions and personalize song recommendations.",
      tech: ["React", "Node.js", "MongoDB", "Javascript", "TailwindCSS"],
      link: "http://vibe_vision.app"
    },
    {
      title: "Chatbot using FuseJS",
      description: "Collaborative project management tool with real-time updates and team chat features.",
      tech: ["Fuse.js", "MongoDB", "TailwindCSS", "Javascript", "Node.js"],
      link: "http://chat_bot.app"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans scroll-smooth">
      {loading && (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-white text-2xl md:text-4xl font-mono z-[9999]">
          <span className="animate-pulse">
            {typedText.includes("user") ? (
              <>
                {typedText.split("user")[0]}
                <span className="text-blue-400">user</span>
                {typedText.split("user")[1]}
              </>
            ) : (
              typedText
            )}
          </span>
        </div>
      )}

      {showMain && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <header
            className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-center items-center transition-all duration-500 ease-in-out border-b border-white/15 ${
              scrolled ? "bg-black/30 backdrop-blur-md shadow-md" : "bg-black"
            }`}
          >
            <div className="flex items-center justify-between w-full max-w-6xl">
              <h1 className="text-2xl font-bold text-white">
                Vishal <span style={{ color: "rgb(45 180 180)" }}>Srikanth</span>
              </h1>

              <nav className="hidden md:flex space-x-6 text-white text-lg font-medium">
                <a href="#home" className="hover:text-blue-400 transition">Home</a>
                <a href="#about" className="hover:text-blue-400 transition">About</a>
                <a href="#projects" className="hover:text-blue-400 transition">Projects</a>
                <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
              </nav>

              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <nav className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md md:hidden flex flex-col items-center space-y-4 py-4">
                <a href="#home" className="hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#about" className="hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#projects" className="hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>Projects</a>
                <a href="#contact" className="hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>Contact</a>
              </nav>
            )}
          </header>

          <div id="home" className="h-20" />

          {/* Home Section */}
          <motion.section
            className="px-6 py-32 text-center bg-black text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInVariants}
          >
            <motion.h1 className="text-4xl md:text-5xl font-bold mb-4" variants={itemFadeInVariants}>
              <span
                style={{
                  backgroundImage: 'linear-gradient(to right, rgb(42, 129, 254), rgb(0, 210, 242))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Hi, I'm  Vishal Srikanth
              </span>
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8" variants={itemFadeInVariants}>
              I'm a Full Stack and AI Developer with hands on experience building scalable web and software applications.
              I craft responsive interfaces using <span className="text-blue-400">React</span>, <span className="text-blue-400">Node</span>, <span className="text-blue-400">StreamLit</span>, and <span className="text-blue-400">TailwindCSS</span>,
              with <span className="text-blue-400">SQL</span>,  and <span className="text-blue-400">MongoDB</span> for backend.
              In the AI domain, I've built emotion based recommendation systems, OCR-powered mobile apps, voice assistants, and multi-agent AI workflows using
              <span className="text-blue-400"> Python</span>, <span className="text-blue-400">Transformers</span>, and <span className="text-blue-400">GANs</span> delivering smart, end to end solutions across web, mobile, and backend platforms.
            </motion.p>
            <motion.div className="flex justify-center gap-6" variants={itemFadeInVariants}>
              <a
                href="#about"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Learn More
              </a>
              <a
                href="#contact"
                className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.section>

          {/* About Section */}
          <motion.section
            id="about"
            className="px-6 py-20 bg-black text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInVariants}
          >
            <motion.div className="max-w-4xl mx-auto text-center border border-white/10 p-10 rounded-2xl" variants={itemFadeInVariants}>
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-10" style={{ color: 'rgb(45 180 180)' }} variants={itemFadeInVariants}>About Me</motion.h2>
              <motion.p className="text-lg text-gray-300 mb-12" variants={itemFadeInVariants}>
                Passionate developer with expertise in building scalable web applications and creating innovative solutions.
              </motion.p>

              <motion.div
                className="border border-white/10 rounded-xl p-8 mb-12"
                variants={popOutVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Frontend</h3>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {["React", "Framer Motion", "TailwindCSS"].map(skill => (
                        <motion.span
                          key={skill}
                          className="bg-[#0A0E1C] text-[rgb(45,180,180)] px-4 py-1.5 rounded-full text-sm font-medium"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgb(59, 130, 246)",
                            color: "white",
                            transition: { duration: 0.1 }
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Backend</h3>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {["Python", "MongoDB", "SQL", "Docker", "Node.js", "Javascript", "FastAPI"].map(skill => (
                        <motion.span
                          key={skill}
                          className="bg-[#0A0E1C] text-[rgb(45,180,180)] px-4 py-1.5 rounded-full text-sm font-medium"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgb(59, 130, 246)",
                            color: "white",
                            transition: { duration: 0.1 }
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  className="border border-white/10 rounded-xl p-6 text-left"
                  variants={popOutVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-xl font-semibold mb-4">🎓 Education</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    <li><strong>Diploma in Computer Science</strong> - PSB Polytechnic College (2020–2023)</li>
                    <li>Relevant Coursework: Software Development, Web Development</li>
                  </ul>
                </motion.div>

                <motion.div
                  className="border border-white/10 rounded-xl p-6 text-left"
                  variants={popOutVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-xl font-semibold mb-4">💼 Internship Experience</h3>
                  <p className="text-gray-300">
                    <strong>Project Intern at Octanet Services pvt ltd.</strong><br/>
                    <em>(Jan 2025 – Feb 2025)</em><br/>
                    Developed and optimized scripts to automate repetitive tasks, integrated third party APIs. Improved application performance and optimized database queries.
                  </p>
                </motion.div>

                <motion.div
                  className="border border-white/10 rounded-xl p-6 text-left"
                  variants={popOutVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-xl font-semibold mb-4">🎓 Education</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    <li><strong>Btech in Computer Science</strong> - Hindustan Institute of Technology and Science (2023–2026)</li>
                    <li>Relevant Coursework: Data Structures, Software Engineering</li>
                  </ul>
                </motion.div>

                <motion.div
                  className="border border-white/10 rounded-xl p-6 text-left"
                  variants={popOutVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-xl font-semibold mb-4">💼 Internship Experience</h3>
                  <p className="text-gray-300">
                    <strong>Project Intern at Null Class pvt ltd.</strong><br/>
                    <em>(May 2024 – Jun 2024)</em><br/>
                    Worked on developing a dynamic Streaming website, implementing core features such as video uploads, streaming, user authentication, and responsive design.
                    Focusing on front end technologies like HTML, CSS, and JavaScript alongside back end frameworks.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.section>

          {/* Projects Section */}
          <section id="projects" className="px-6 py-20 bg-black text-white">
            <motion.div
              className="max-w-6xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInVariants}
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-10" style={{ color: 'rgb(45 180 180)' }} variants={itemFadeInVariants}>Featured Projects</motion.h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    className="border border-white/10 rounded-xl p-6 text-left"
                    variants={popOutVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (
                        <motion.span
                          key={i}
                          className="bg-[#0A0E1C] text-[rgb(45,180,180)] px-4 py-1.5 rounded-full text-sm font-medium"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgb(59, 130, 246)",
                            color: "white",
                            transition: { duration: 0.1 }
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(45,180,180)] font-medium inline-flex items-center"
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      View Project <span className="ml-1">→</span>
                    </motion.a>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <motion.div
                  className="border border-white/10 rounded-xl p-6 text-left max-w-2xl w-full"
                  variants={popOutVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-xl font-bold mb-2 text-white">HSN Code Validator</h3>
                  <p className="text-gray-300 mb-4">This project is an AI powered agent built using ADK that provides quick information about HSN (Harmonized System of Nomenclature) codes.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Python", "GoogleADK"].map((tech, i) => (
                      <motion.span
                        key={i}
                        className="bg-[#0A0E1C] text-[rgb(45,180,180)] px-4 py-1.5 rounded-full text-sm font-medium"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgb(59, 130, 246)",
                          color: "white",
                          transition: { duration: 0.1 }
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <motion.a
                    href="https://github.com/VishalSrikanth16/HSN_Code_Validator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[rgb(45,180,180)] font-medium inline-flex items-center"
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    View Project <span className="ml-1">→</span>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="px-6 py-20 bg-black text-white">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInVariants}
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-10" style={{ color: 'rgb(45 180 180)' }} variants={itemFadeInVariants}>Contact Me</motion.h2>
              <motion.p className="text-lg text-gray-300 mb-8" variants={itemFadeInVariants}>
                Want to collaborate or have a question? Feel free to reach out!
              </motion.p>

              <AnimatePresence mode="wait">
                {showContactForm ? (
                  <ContactForm key="contact-form" onClose={() => setShowContactForm(false)} />
                ) : (
                  <motion.button
                    key="send-email-button"
                    onClick={() => setShowContactForm(true)}
                    className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgb(37, 99, 235)",
                      transition: { duration: 0.2 }
                    }}
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    transition={{ duration: 0.3 }}
                  >
                    Send Email
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </section>
        </motion.div>
      )}
    </div>
  );
}

export default App;


// meow
