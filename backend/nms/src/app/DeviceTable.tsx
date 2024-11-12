import React, { useEffect, useState } from 'react';
import { Device } from '../../pages/api/types/types';

interface DeviceTableProps {
    deviceCount: number; 
  }


  const DeviceTable: React.FC<DeviceTableProps> = ({ deviceCount }) => {
const [devices, setDevices] = useState<Device[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const DEVICES_PER_PAGE = 30;

  
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`/api/devices/index?page=${currentPage}&perPage=${DEVICES_PER_PAGE}`);        
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    
    <div className="container mx-auto p-5 mt-14">
      <h1 className="text-2xl font-bold mb-4">Device List</h1>
      <input type="text" placeholder="Expo Push Token" className="border border-gray-300 p-2 rounded-md" value = {search}
      onChange={(e) => setSearch(e.target.value)}/>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b text-left">Device Type</th>
            <th className="py-2 px-4 border-b text-center">Breaking News</th>
            <th className="py-2 px-4 border-b text-center">University News</th>
            <th className="py-2 px-4 border-b text-center">Metro</th>
            <th className="py-2 px-4 border-b text-left">Expo Push Token</th>
            <th className="py-2 px-4 border-b text-left">Date created</th>

          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.expoPushToken}>
              <td className="py-2 px-4 border-b text-left">{device.deviceType}</td>
              <td className="py-2 px-4 border-b text-center">{device["Breaking News"] ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b text-center">{device["University News"] ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b text-center">{device["Metro"] ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b text-left">{device.expoPushToken}</td>
              <td className="py-2 px-4 border-b text-left">{device.dateCreated}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {Array.from({ length: Math.ceil(deviceCount / DEVICES_PER_PAGE) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeviceTable;
