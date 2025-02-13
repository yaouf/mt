import React, { useEffect, useState } from "react";
import { Device } from "../../pages/api/types/types";

interface DeviceTableProps {}

const DeviceTable: React.FC<DeviceTableProps> = ({}) => {
  const [search, setSearch] = useState("");
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const DEVICES_PER_PAGE = 30;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `/api/devices/index?page=${currentPage}&perPage=${DEVICES_PER_PAGE}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`
        );
        const data = await response.json();
        setDevices(data.devices);
        setDeviceCount(parseInt(data.totalDevices));
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, [currentPage,search]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    
    <div className="container mx-auto p-5 mt-14">
      <h1 className="text-2xl font-bold mb-4">Device List</h1>
      <input
        type="text"
        placeholder="Expo Push Token"
        className="border border-gray-300 p-2 rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b text-left">Device Type</th>
            <th className="py-2 px-4 border-b text-center">Breaking News</th>
            <th className="py-2 px-4 border-b text-center">University News</th>
            <th className="py-2 px-4 border-b text-center">Metro</th>
            <th className="py-2 px-4 border-b text-center">Opinions</th>
            <th className="py-2 px-4 border-b text-center">Arts and Culture</th>
            <th className="py-2 px-4 border-b text-center">Sports</th>
            <th className="py-2 px-4 border-b text-center">
              Science and Research
            </th>
            <th className="py-2 px-4 border-b text-left">Expo Push Token</th>
            <th className="py-2 px-4 border-b text-left">Date Created</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.expo_push_token}>
              <td className="py-2 px-4 border-b text-left">
                {device.device_type}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Breaking News"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["University News"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Metro"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Opinions"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Arts and Culture"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Sports"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {device["Science and Research"] ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b text-left">
                {device.expo_push_token}
              </td>
              <td className="py-2 px-4 border-b text-left">{device.date_created}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {Array.from(
          { length: Math.ceil(deviceCount / DEVICES_PER_PAGE) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default DeviceTable;
