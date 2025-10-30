/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#86975A",
        secondary: "#F4F1DE",
        accent: "#E07A5F",
        background: "#3D405B",
        grayText: "#919191",
        white: "#FAFAFA",
        black: "#424242",
      },
      boxShadow: {
        // existing shadow
        "sm-subtle": "0px 1.5px 5px rgba(0,0,0,0.25)",

        // new custom shadow you asked for
        soft: "0px 1px 2px rgba(0,0,0,0.1)", // 👈 your new one
      },
    },
  },
  plugins: [],
};
