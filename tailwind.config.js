import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{jsx,tsx}",
    ],

    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'Figtree',
                    ...defaultTheme.fontFamily.sans
                ],
    			display: [
    				'Poppins',
                    ...defaultTheme.fontFamily.sans
                ],
    			mono: [
    				'JetBrains Mono',
                    ...defaultTheme.fontFamily.mono
                ]
    		},
    		colors: {
    			primary: {
    				'50': '#f0f5ff',
    				'100': '#e0eaff',
    				'200': '#c7d9ff',
    				'300': '#a4beff',
    				'400': '#789bff',
    				'500': '#4f74ff',
    				'600': '#2f4ef0',
    				'700': '#2542db',
    				'800': '#213ab0',
    				'900': '#20348a',
    				'950': '#162154',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'50': '#f0f8ff',
    				'100': '#e0f0fe',
    				'200': '#bae2fd',
    				'300': '#7dcdfd',
    				'400': '#36b3fa',
    				'500': '#0c98eb',
    				'600': '#017ac8',
    				'700': '#0262a2',
    				'800': '#065286',
    				'900': '#0a4570',
    				'950': '#072d4a',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		animation: {
    			float: 'float 6s ease-in-out infinite',
    			blob: 'blob 10s infinite alternate',
    			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    			bounce: 'bounce 1.5s infinite',
    			spin: 'spin 3s linear infinite',
    			ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
    			fadeIn: 'fadeIn 0.5s ease-in-out',
    			slideUp: 'slideUp 0.5s ease-out',
    			slideDown: 'slideDown 0.5s ease-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		keyframes: {
    			float: {
    				'0%': {
    					transform: 'translateY(0px)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				},
    				'100%': {
    					transform: 'translateY(0px)'
    				}
    			},
    			blob: {
    				'0%': {
    					transform: 'scale(1) translate(0, 0)'
    				},
    				'33%': {
    					transform: 'scale(1.1) translate(20px, -10px)'
    				},
    				'66%': {
    					transform: 'scale(0.9) translate(-10px, 15px)'
    				},
    				'100%': {
    					transform: 'scale(1) translate(0, 0)'
    				}
    			},
    			fadeIn: {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			slideUp: {
    				'0%': {
    					transform: 'translateY(20px)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			slideDown: {
    				'0%': {
    					transform: 'translateY(-20px)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
    		},
    		boxShadow: {
    			subtle: '0 2px 10px rgba(0, 0, 0, 0.05)',
    			card: '0 4px 12px rgba(0, 0, 0, 0.08)',
    			elevated: '0 8px 24px rgba(0, 0, 0, 0.12)',
    			outline: '0 0 0 2px rgba(66, 153, 225, 0.5)',
    			button: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    			'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
    		},
    		borderRadius: {
    			'4xl': '2rem',
    			'5xl': '2.5rem',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		spacing: {
    			'128': '32rem',
    			'144': '36rem'
    		},
    		typography: '(theme) => ({\\r\\n                DEFAULT: {\\r\\n                    css: {\\r\\n                        color: theme("colors.gray.800"),\\r\\n                        a: {\\r\\n                            color: theme("colors.primary.700"),\\r\\n                            "&:hover": {\\r\\n                                color: theme("colors.primary.600"),\\r\\n                            },\\r\\n                        },\\r\\n                    },\\r\\n                },\\r\\n            })',
    		transitionProperty: {
    			height: 'height',
    			spacing: 'margin, padding'
    		},
    		zIndex: {
    			'60': '60',
    			'70': '70',
    			'80': '80',
    			'90': '90',
    			'100': '100'
    		}
    	}
    },

    plugins: [
        forms,
        typography,
        aspectRatio,
        function ({ addUtilities, theme, addComponents, addBase }) {
            // Custom utilities
            const newUtilities = {
                // Animation delay utilities
                ".animation-delay-100": { "animation-delay": "100ms" },
                ".animation-delay-200": { "animation-delay": "200ms" },
                ".animation-delay-300": { "animation-delay": "300ms" },
                ".animation-delay-500": { "animation-delay": "500ms" },
                ".animation-delay-1000": { "animation-delay": "1000ms" },
                ".animation-delay-2000": { "animation-delay": "2000ms" },

                // Text shadow utilities
                ".text-shadow-sm": {
                    "text-shadow": "0 1px 2px rgba(0, 0, 0, 0.1)",
                },
                ".text-shadow": {
                    "text-shadow": "0 2px 4px rgba(0, 0, 0, 0.15)",
                },
                ".text-shadow-lg": {
                    "text-shadow": "0 4px 8px rgba(0, 0, 0, 0.15)",
                },
                ".text-shadow-none": { "text-shadow": "none" },

                // Hide scrollbar but keep functionality
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },

                // Gradient text
                ".text-gradient-primary": {
                    "background-clip": "text",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-image": `linear-gradient(to right, ${theme(
                        "colors.primary.600"
                    )}, ${theme("colors.secondary.500")})`,
                },

                // Hover card effect
                ".card-hover": {
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        "box-shadow": theme("boxShadow.elevated"),
                    },
                },
            };

            // Custom components
            const components = {
                ".glass-card": {
                    background: "rgba(255, 255, 255, 0.8)",
                    "backdrop-filter": "blur(10px)",
                    "border-radius": theme("borderRadius.lg"),
                    border: `1px solid rgba(255, 255, 255, 0.18)`,
                    "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                },

                ".btn-primary": {
                    padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
                    "border-radius": theme("borderRadius.md"),
                    "background-image": `linear-gradient(to right, ${theme(
                        "colors.primary.600"
                    )}, ${theme("colors.primary.700")})`,
                    color: theme("colors.white"),
                    "font-weight": theme("fontWeight.medium"),
                    transition: "all 0.2s",
                    "&:hover": {
                        "box-shadow": "0 4px 12px rgba(79, 116, 255, 0.3)",
                        transform: "translateY(-1px)",
                    },
                },
            };

            addUtilities(newUtilities);
            addComponents(components);

            // Base styles
            addBase({
                html: {
                    "-webkit-font-smoothing": "antialiased",
                    "-moz-osx-font-smoothing": "grayscale",
                },
            });
        },
        require("tailwindcss-animate"),
    ],

    // Enable dark mode
    darkMode: ["class", "class"],

    // Add future mode for compatibility with upcoming Tailwind versions
    future: {
        hoverOnlyWhenSupported: true,
    },
};
