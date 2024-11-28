/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
    	extend: {
    		maxWidth: {
    			container: '1440px'
    		},
    		screens: {
    			xs: '320px',
    			sm: '375px',
    			sml: '500px',
    			md: '667px',
    			mdl: '768px',
    			lg: '960px',
    			lgl: '1024px',
    			xl: '1280px'
    		},
    		fontFamily: {
    			bodyFont: ["DM Sans", "sans-serif"],
    			titleFont: ["Poppins", "sans-serif"]
    		},
    		colors: {
    			primeColor: '#262626',
    			lightText: '#6D6D6D',
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		boxShadow: {
    			testShadow: '0px 0px 54px -13px rgba(0,0,0,0.7)'
    		}
    	}
    },
	plugins: [require("tailwind-scrollbar")],
  };
  