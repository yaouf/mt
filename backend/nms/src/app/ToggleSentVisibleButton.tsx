'use client';

export default function ToggleSentVisibleButton({ isSentVisible, setIsSentVisible }) {
  const handleToggle = () => {
    setIsSentVisible((currentValue) => !currentValue);
  };

  return (
    <button
      onClick={handleToggle}
      className={`text-white font-semibold px-4 py-2 rounded-md ml-auto mr-8 mb-4 transition transform duration-200 hover:scale-105 ${isSentVisible ? 'bg-gray-300' : 'bg-gray-500'}`}
    >
      {isSentVisible ? 'Hide Sent' : 'See Sent'}
    </button>
  );
}
