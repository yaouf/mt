interface DeviceCountsProps {
  deviceCount: number;
  ntfEnabled: string;
  metroCount: string;
  breakingCount: string;
  universityCount: string;
  sportsCount: string;
  artsAndCultureCount: string;
  scienceAndResearchCount: string;
  opinionsCount: string;
}

export default function DeviceCounts({
  deviceCount,
  ntfEnabled,
  metroCount,
  breakingCount,
  universityCount,
  sportsCount,
  artsAndCultureCount,
  scienceAndResearchCount,
  opinionsCount,
}: DeviceCountsProps) {
  return (
    <div className="flex justify-center py-3">
      <div className="w-full max-w-3xl p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Notifications by Type
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-md font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-md font-semibold text-gray-700">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Total Devices
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {deviceCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Notifications Enabled
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {ntfEnabled}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Metro
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {metroCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Breaking News
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {breakingCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  University News
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {universityCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Sports
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {sportsCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Arts & Culture
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {artsAndCultureCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Science & Research
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {scienceAndResearchCount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-md font-medium text-gray-800">
                  Opinions
                </td>
                <td className="px-6 py-4 text-md text-gray-700 text-right">
                  {opinionsCount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
