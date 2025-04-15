function LayoutPicker({ layout, setLayout }) {
    const options = ['1x4', '2x2'];
  
    return (
      <div className="flex justify-center gap-4 mb-4">
        {options.map((option) => (
          <button 
            key={option} 
            className={`px-4 py-2 border rounded ${layout === option ? 'bg-black text-white' : 'border-gray-300'}`}
            onClick={() => setLayout(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
  
  export default LayoutPicker;
  