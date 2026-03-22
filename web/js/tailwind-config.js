/** Configuration Tailwind CDN partagée — chargée après cdn.tailwindcss.com */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
            },
            colors: {
                surface: {
                    DEFAULT: '#0e0e10',
                    raised: '#18181b',
                    border: '#2f2f35',
                    muted: '#adadb8',
                    text: '#efeff1'
                },
                brand: {
                    DEFAULT: '#9146ff',
                    dim: '#772ce8',
                    soft: '#bf94ff',
                    glow: 'rgba(145, 70, 255, 0.35)'
                }
            },
            backgroundImage: {
                'hero-mesh':
                    'radial-gradient(ellipse 90% 60% at 50% -30%, rgba(145, 70, 255, 0.28), transparent 55%), radial-gradient(ellipse 50% 45% at 100% 10%, rgba(168, 85, 247, 0.12), transparent), radial-gradient(ellipse 40% 35% at 0% 20%, rgba(59, 130, 246, 0.08), transparent)'
            },
            boxShadow: {
                glow: '0 0 60px -15px rgba(145, 70, 255, 0.4)',
                card: '0 4px 24px rgba(0, 0, 0, 0.4)'
            }
        }
    }
};
