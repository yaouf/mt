import { useState } from "react";

const EditorsPicks = ({ editorsPicks, setEditorsPicks }) => {
  const [url, setUrl] = useState("");

  const handleAddPick = async () => {
    if (!url) {
      console.error("URL cannot be empty");
      return; 
    }

    try {
      const response = await fetch("/api/editors-picks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setEditorsPicks((prev) => [...prev, data]); 
        setUrl(""); 
      } else {
        console.error("Error adding editor's pick");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeletePick = async (url) => {
    try {
      const response = await fetch(`/api/editors-picks/delete`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      ;
  
      // Log the response to see if the deletion was successful
      console.log("Delete response:", response);
  
      if (response.ok) {
        // Filter out the deleted pick from the state
        setEditorsPicks(editorsPicks.filter(pick => pick.url !== url));
      } else {
        console.error('Failed to delete editor\'s pick');
      }
    } catch (error) {
      console.error('Error deleting editor\'s pick:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-8 py-2"> 
      <h2 className="text-2xl font-bold mb-4">Editor&apos;s Picks</h2>
      <table className="min-w-full border border-gray-300 mt-4"> 
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">URL</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {editorsPicks.map((pick, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <a href={pick.url} className="text-blue-500 hover:text-blue-700 underline break-all" target="_blank" rel="noopener noreferrer">{pick.url}</a>
              </td>
              <td className="py-2 px-4 border-b">
                <button 
                  onClick={() => handleDeletePick(pick.url)} 
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex my-4 w-full"> 
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
          placeholder="Enter article URL"
        />
      </div>
      <button 
        onClick={handleAddPick} 
        className="bg-blue-500 text-white px-4 py-2 rounded-md transition transform duration-200 hover:bg-blue-600 hover:scale-105" 
      >
        Add Editor&apos;s Pick
      </button>
    </div>
  );
};

export default EditorsPicks;
