/** @type {import('tailwindcss').Config} */
export default {
    content: [ "./src/views/*.html" ],
    plugins: [ import("@tailwindcss/forms") ]
};