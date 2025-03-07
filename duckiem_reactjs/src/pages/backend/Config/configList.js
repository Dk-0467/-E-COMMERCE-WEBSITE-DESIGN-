import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa'; 
import ConfigService from '../../../services/ConfigServices';
import { Link } from 'react-router-dom';

const ConfigList = () => {
  const [configs, setConfigs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [configsPerPage] = useState(5);

  useEffect(() => {
    (async () => {
      const result = await ConfigService.index();
      setConfigs(result.config);
    })();
  }, []);

  const indexOfLastConfig = currentPage * configsPerPage;
  const indexOfFirstConfig = indexOfLastConfig - configsPerPage;
  const currentConfigs = configs.slice(indexOfFirstConfig, indexOfLastConfig);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(configs.length / configsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-3xl font-bold text-gray-800">Config List</h1>     
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Site Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Phones</th>
              <th className="border p-3 text-left">Address</th>
              <th className="border p-3 text-left">Hotline</th>
              <th className="border p-3 text-center">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentConfigs.map((config, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="border p-3 text-gray-700">{config.id}</td>
                <td className="border p-3">{config.site_name}</td>
                <td className="border p-3">{config.email}</td>
                <td className="border p-3">{config.phones}</td>
                <td className="border p-3">{config.address}</td>
                <td className="border p-3">{config.hotline}</td>
                <td className="border p-3 text-center">
                  <span className={`py-1 px-3 rounded-full text-sm ${config.status === 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {config.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="border p-3 text-center">
                  <Link to={`/admin/edit_config/${config.id}`}>
                    <button className="bg-blue-500 py-1 px-2 mx-0.5 text-white rounded-md hover:bg-blue-600 transition duration-300">
                      <FaEdit className="text-sm" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 space-x-1">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-lg transition duration-300 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfigList;
