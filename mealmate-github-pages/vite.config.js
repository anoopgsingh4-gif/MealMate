import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: set base to your repo name, e.g. "/mealmate/"
export default defineConfig({
  plugins: [react()],
  base: "/mealmate/" // <-- change if your repo has a different name
});
