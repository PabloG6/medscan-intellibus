export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="text-2xl font-semibold text-black">
              MedScan AI
            </a>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <a href="/#features" className="hover:text-black transition-colors">Features</a>
            <a href="/about" className="hover:text-black transition-colors">About</a>
            <a href="/login" className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800">
              Login
            </a>
          </div>
          <a href="/login" className="md:hidden rounded-md border border-black px-4 py-2 text-black hover:bg-black hover:text-white">
            Login
          </a>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">About MedScan AI</h1>
            <p className="mb-4 text-xl text-slate-600 md:text-2xl">
              Pioneering the Future of Medical Diagnostics
            </p>
            <p className="mx-auto max-w-2xl text-lg text-slate-700">
              Founded by medical professionals and AI experts, MedScan AI is currently in its development stages. 
              We are dedicated to revolutionizing how medical scans are analyzed and interpreted, making healthcare 
              more efficient and accurate through a carefully planned three-level development approach.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">Our Mission</h2>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="mb-6 text-2xl font-semibold">Transforming Healthcare Through AI</h3>
                <p className="mb-4 text-slate-700">
                  At MedScan AI, we believe that technology should enhance human expertise, not replace it. 
                  Our mission is to empower medical professionals with intelligent tools that accelerate 
                  diagnosis while maintaining the highest standards of accuracy and patient care.
                </p>
                <p className="text-slate-700">
                  Currently in development, we're committed to reducing diagnostic delays, improving patient outcomes, 
                  and supporting healthcare professionals in their critical work of saving lives through a structured, 
                  research-driven approach.
                </p>
              </div>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="mb-2 text-4xl">🎯</div>
                  <p className="font-medium">Precision</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-4xl">⚡</div>
                  <p className="font-medium">Speed</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-4xl">🤝</div>
                  <p className="font-medium">Collaboration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy Section */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              Our Core Philosophy: Assisting, Not Replacing
            </h2>
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-lg text-slate-700">
                <strong>MedScan AI is designed to empower doctors, not replace them.</strong> Our technology serves as an 
                intelligent assistant that accelerates the diagnostic process, allowing medical professionals to see more 
                patients and save more lives.
              </p>
            </div>
            
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div className="border border-slate-200 rounded-lg p-6 text-center bg-white">
                <div className="mb-4 text-4xl">⚡</div>
                <h3 className="text-xl font-semibold mb-4">Accelerated Diagnostics</h3>
                <p className="text-slate-700">From 3 to 15 patients per day: While a doctor might traditionally review 3 patients' scans daily, our AI assistance aims to enable reviewing 15 patients in the same timeframe by rapidly highlighting areas of concern and providing preliminary analysis.</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-6 text-center bg-white">
                <div className="mb-4 text-4xl">⏰</div>
                <h3 className="text-xl font-semibold mb-4">Eliminating Dangerous Delays</h3>
                <p className="text-slate-700">Lives depend on speed: Patients often wait weeks for scan results while their conditions potentially worsen. Our goal is to reduce this critical gap between scanning and diagnosis, ensuring timely intervention when it matters most.</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-6 text-center bg-white">
                <div className="mb-4 text-4xl">📈</div>
                <h3 className="text-xl font-semibold mb-4">Increased Patient Throughput</h3>
                <p className="text-slate-700">More patients in, more patients helped: By streamlining the diagnostic workflow, we help healthcare systems reduce waiting lists and ensure that more patients receive the care they need without prolonged uncertainty.</p>
              </div>
            </div>

            <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-8 text-center">
              <h3 className="text-yellow-800 text-xl font-semibold mb-4">⚠️ The Reality We're Addressing</h3>
              <p className="text-yellow-700 font-medium mb-4">
                <strong>Every day, patients wait for critical diagnoses while their conditions potentially progress.</strong>
              </p>
              <p className="text-yellow-800">
                This isn't just an efficiency problem—it's a patient safety issue. When a potential cancer, pneumonia, 
                or brain hemorrhage goes undetected for weeks due to diagnostic backlogs, lives are at stake. 
                MedScan AI exists to bridge this gap between technology capability and clinical need.
              </p>
            </div>

            <div className="mt-12 text-center">
              <h3 className="mb-8 text-2xl font-semibold">The Doctor Remains Central</h3>
              <div className="mx-auto flex max-w-2xl items-center justify-center gap-4">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🤖</div>
                  <p className="font-medium">AI Analysis</p>
                  <p className="text-sm text-slate-600">Rapid preliminary screening</p>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">👨‍⚕️</div>
                  <p className="font-medium">Doctor Review</p>
                  <p className="text-sm text-slate-600">Expert clinical judgment</p>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">🏥</div>
                  <p className="font-medium">Patient Care</p>
                  <p className="text-sm text-slate-600">Timely treatment</p>
                </div>
              </div>
              <p className="mt-4 italic text-slate-600">
                AI provides the speed, doctors provide the expertise, patients receive faster care.
              </p>
            </div>
          </div>
        </section>

        {/* Development Roadmap Section */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">Development Roadmap</h2>
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-lg text-slate-700">
                MedScan AI is currently in its development stages with a clear three-level roadmap designed to 
                progressively advance medical AI diagnostics and contribute to the broader medical community.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Level 1 */}
              <div className="border-l-4 border-green-500 bg-white rounded-lg p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    1
                  </div>
                  <h3 className="text-green-600 text-xl font-semibold">Level 1: Current Stage</h3>
                </div>
                <p className="text-lg font-medium text-slate-600 mb-4">Pre-existing Model Integration</p>
                <p className="mb-4 text-slate-700">
                  <strong>Where we are now:</strong> Running inference on established, proven AI models and enhancing 
                  their output through Google's Gemini AI for improved interpretation and contextual analysis. 
                  This foundation allows us to provide immediate value while building our platform infrastructure.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Integration with validated medical AI models</li>
                  <li>• Gemini-enhanced result interpretation</li>
                  <li>• Real-time scan analysis pipeline</li>
                  <li>• Clinical workflow integration</li>
                </ul>
              </div>

              {/* Level 2 */}
              <div className="border-l-4 border-yellow-500 bg-white rounded-lg p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-black font-bold">
                    2
                  </div>
                  <h3 className="text-yellow-600 text-xl font-semibold">Level 2: Model Refinement</h3>
                </div>
                <p className="text-lg font-medium text-slate-600 mb-4">Enhanced Performance & Expansion</p>
                <p className="mb-4 text-slate-700">
                  <strong>Next phase:</strong> Refining and optimizing the models used in Level 1 based on clinical 
                  feedback and real-world performance data. We'll adjust functionality, improve accuracy, and expand 
                  our capabilities to include additional scan types and detection algorithms.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Model performance optimization and fine-tuning</li>
                  <li>• Expanded scan type support (MRI, CT, Ultrasound)</li>
                  <li>• Enhanced abnormality detection algorithms</li>
                  <li>• Improved user interface and workflow tools</li>
                  <li>• Advanced reporting and analytics features</li>
                </ul>
              </div>

              {/* Level 3 */}
              <div className="border-l-4 border-purple-500 bg-white rounded-lg p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white font-bold">
                    3
                  </div>
                  <h3 className="text-purple-600 text-xl font-semibold">Level 3: Innovation & Research</h3>
                </div>
                <p className="text-lg font-medium text-slate-600 mb-4">Original Model Development</p>
                <p className="mb-4 text-slate-700">
                  <strong>Future vision:</strong> Creating our own AI models from scratch using research and data 
                  collected from previous levels. This represents our commitment to advancing medical AI and 
                  potentially discovering new approaches to disease identification and diagnosis.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Custom AI model development from ground up</li>
                  <li>• Novel disease identification methodologies</li>
                  <li>• Research partnerships with medical institutions</li>
                  <li>• Educational tools for medical student training</li>
                  <li>• Open-source contributions to medical AI community</li>
                  <li>• Setting new standards for diagnostic accuracy</li>
                </ul>
              </div>
            </div>

            {/* Educational Impact */}
            <div className="mt-12 bg-slate-50 rounded-lg p-8 text-center">
              <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold mb-6">
                🎓 Educational Impact
              </h3>
              <p className="mb-6 text-slate-700">
                <strong>Beyond Level 3:</strong> Our ultimate goal is to contribute to medical education by providing 
                advanced training tools that can assist universities in training future doctors. By developing 
                cutting-edge diagnostic models, we aim to improve the overall standard of medical AI and create 
                educational resources that enhance medical learning and practice.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🏥</div>
                  <p className="font-medium">Clinical Excellence</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">🔬</div>
                  <p className="font-medium">Research Innovation</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">👨‍⚕️</div>
                  <p className="font-medium">Medical Education</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-black py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Learn More?</h2>
            <p className="mb-8 text-xl text-slate-300">
              Contact our team to see how MedScan AI can transform your diagnostic workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-slate-200 inline-block">
                Contact Us
              </a>
              <a href="/login" className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-black inline-block">
                Request Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">MedScan AI</h3>
              <p className="text-slate-600">Revolutionizing medical diagnostics through artificial intelligence.</p>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Quick Links</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="/" className="hover:text-black">Home</a></li>
                <li><a href="/about" className="hover:text-black">About</a></li>
                <li><a href="/contact" className="hover:text-black">Contact</a></li>
                <li><a href="/login" className="hover:text-black">Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="/contact" className="hover:text-black">Contact</a></li>
                <li><a href="#help" className="hover:text-black">Help Center</a></li>
                <li><a href="#privacy" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-slate-600">
            <p>&copy; 2025 MedScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}