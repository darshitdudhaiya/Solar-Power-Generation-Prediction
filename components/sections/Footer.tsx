import { Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative text-gray-400 px-4 sm:px-12 py-10 overflow-hidden">
            {/* Optional glow / background accent */}

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0 border-b border-gray-700 py-5">
                {/* Left: Motto */}
                <div className="text-center sm:text-left">
                    <p className="text-lg font-semibold text-white">Stay Solar Smart</p>
                    <p className="mt-1 text-sm">Accurate solar power predictions AI + real data.</p>
                </div>

                {/* Center: Links */}
                {/* <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-8 text-sm">
                    <a href="/docs" className="hover:text-white transition">Docs</a>
                    <a href="/help" className="hover:text-white transition">Help Center</a>
                    <a href="/terms" className="hover:text-white transition">Terms</a>
                    <a href="/privacy" className="hover:text-white transition">Privacy</a>
                </div> */}

                {/* Right: Socials */}
                <div className="flex space-x-4">
                    <a href="https://github.com/YourRepo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        <Github size={24} />
                    </a>
                    <a href="https://twitter.com/YourHandle" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        <Twitter size={24} />
                    </a>
                    <a href="https://linkedin.com/in/YourProfile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        <Linkedin size={24} />
                    </a>
                </div>
            </div>
            <div className="relative z-10 mt-8 text-center text-xs text-gray-400 py-2">
                © 2025 YourToolName · Built with ❤️ by Darshit · Powered by AI & Solar Data
            </div>
        </footer>
    )
}
