module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'border-red-500', 'border-orange-500', 'border-yellow-500',
    'border-green-500', 'border-blue-500', 'border-purple-500',
    'border-pink-500', 'border-black',
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
    'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'
  ],  
  theme: { extend: {} },
  plugins: [],
};
