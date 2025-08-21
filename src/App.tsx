import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Code, Sparkles, Menu, X } from 'lucide-react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'ai', label: 'AI Tools', icon: Sparkles },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'power', label: 'Power', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-darker to-dark-gray">
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-accent">AI</span>
            </motion.div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-accent bg-accent/10 glow-border'
                        : 'text-gray-300 hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-accent transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div 
            className="md:hidden glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsMenuOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-accent bg-accent/10 glow-border'
                      : 'text-gray-300 hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to the
              <span className="text-accent block animate-glow">Future</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of AI-powered interfaces with our sleek, minimal design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: 'AI Models', value: '12', icon: Brain, color: 'from-accent to-accent-hover' },
              { title: 'Processing', value: '99.9%', icon: Zap, color: 'from-blue-500 to-purple-600' },
              { title: 'Accuracy', value: '98.5%', icon: Sparkles, color: 'from-green-500 to-emerald-600' },
              { title: 'Speed', value: '0.1ms', icon: Code, color: 'from-orange-500 to-red-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-accent">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Dive into the world of artificial intelligence with our cutting-edge tools and interfaces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-accent to-accent-hover text-black font-bold rounded-lg hover:scale-105 transition-transform duration-200 animate-float">
                Launch AI
              </button>
              <button className="px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent hover:text-black transition-all duration-200">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default App
