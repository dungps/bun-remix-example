import type { Config } from "tailwindcss"

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {}
    },
    plugins: [require("kutty")]
} satisfies Config
