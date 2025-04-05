import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { useCallback, useState } from 'react';
import { EditorPick } from '../../pages/api/types/types';

// TODO: having EditorsPick and EditorsPicks is confusing.
const EditorsPicks = ({ editorsPicks, setEditorsPicks, token }) => {
  const [url, setUrl] = useState('');
  const [startindex, setStartIndex] = useState<number | null>(null);

  const sortedEditorsPicks = [...editorsPicks].sort((a, b) => a.rank - b.rank);

  const handleAddPick = async () => {
    if (!url) {
      console.error('URL cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/editors-picks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setEditorsPicks((prev) => [...prev, data]);
        setUrl('');
      } else {
        console.error("Error adding editor's pick");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeletePick = async (url) => {
    try {
      const response = await fetch(`/api/editors-picks/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      // Log the response to see if the deletion was successful
      console.log('Delete response:', response);

      if (response.ok) {
        // Find and delete the pick from the state
        const deletedPickIndex = editorsPicks.findIndex((pick) => pick.url === url);
        const updatedPicks = editorsPicks.filter((pick) => pick.url !== url);

        // Update the ranks of the remaining picks
        const newPicksWithUpdatedRanks = updatedPicks.map((pick, index) => {
          // If the pick's rank is above the deleted pick's rank, decrease the rank
          return {
            ...pick,
            rank: index < deletedPickIndex ? pick.rank : pick.rank - 1,
          };
        });

        // Set the new state
        setEditorsPicks(newPicksWithUpdatedRanks);
      } else {
        console.error("Failed to delete editor's pick");
      }
    } catch (error) {
      console.error("Error deleting editor's pick:", error);
    }
  };

  function handleDragOver(event: React.DragEvent<HTMLTableRowElement>): void {
    event.preventDefault();
  }

  function handleDragStart(index: number): void {
    setStartIndex(index);
  }

  function handleDrop(index: any): void {
    if (index == null || index === startindex) {
      return;
    }
    const newPicks = [...editorsPicks];
    if (startindex !== null) {
      [newPicks[startindex], newPicks[index]] = [newPicks[index], newPicks[startindex]];
      setEditorsPicks(newPicks);
      updateRanks(newPicks);
    }
    setStartIndex(null);
  }

  const updateRanks = async (newPicks: EditorPick[]) => {
    try {
      // Update ranks on the server
      const response = await fetch('/api/editors-picks/update-ranks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          newPicks.map((pick, index) => ({
            ...pick,
            rank: index + 1,
          }))
        ),
      });
      console.log('Update ranks response:', response);

      if (!response.ok) {
        console.error('Failed to update ranks');
      }
    } catch (error) {
      console.error('Error updating ranks:', error);
    }
  };

  const fetchLatestPicks = useCallback(async () => {
    try {
      const response = await fetch('/api/editors-picks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEditorsPicks(data);
      }
    } catch (error) {
      console.error('Error fetching latest picks:', error);
    }
  }, [setEditorsPicks, token]);

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editorsPicks.length - 1)
    ) {
      return;
    }

    const newPicks = [...editorsPicks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    [newPicks[index], newPicks[swapIndex]] = [newPicks[swapIndex], newPicks[index]];
    setEditorsPicks(newPicks);

    // First update the ranks
    await updateRanks(newPicks);

    // Then refresh the list after a short delay
    setTimeout(() => {
      fetchLatestPicks();
    }, 500); // 500ms delay
  };

  return (
    <div className="container mx-auto px-8 py-2">
      <h2 className="text-2xl font-bold mb-4">Editor&apos;s Picks</h2>
      <table className="min-w-full border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">URL</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEditorsPicks.map((pick, index) => (
            <tr
              key={index}
              draggable="true"
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="hover:bg-gray-50 transition-transform duration-200 ease-in-out"
            >
              <td className="py-2 px-4 border-b text-gray-600">
                <div className="flex items-center gap-3">
                  <span>{pick.rank}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className={`h-5 w-5 ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <ArrowUpIcon />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === editorsPicks.length - 1}
                      className={`h-5 w-5 ${
                        index === editorsPicks.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <ArrowDownIcon />
                    </button>
                  </div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <a
                  href={pick.url}
                  className="text-blue-500 hover:text-blue-700 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pick.url}
                </a>
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
