module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Definir primary como una paleta de negros y grises
                'primary': {
                    50: '#f9fafb',   // Gris muy claro
                    100: '#f3f4f6',  // Gris claro
                    200: '#e5e7eb',  // Gris claro-medio
                    300: '#d1d5db',  // Gris medio
                    400: '#9ca3af',  // Gris medio-oscuro
                    500: '#6b7280',  // Gris oscuro
                    600: '#374151',  // Gris muy oscuro (principal)
                    700: '#1f2937',  // Casi negro
                    800: '#111827',  // Negro grisáceo
                    900: '#0f172a',  // Negro profundo
                },
            }
        },
    },
    plugins: [],
}
