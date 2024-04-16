/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export default function TableLayout() {
  const [tableData, setTableData] = useState([]);
  const [inputData, setInputData] = useState("");
  const [id, setId] = useState(null);
  const [searchData, setSearchData] = useState("");

  const fetchData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    setTableData(data);
    console.log(data, "data");
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (id) => {
    const data = tableData.filter((item) => item.id !== id);
    setTableData(data);
  };
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setInputData(inputValue);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchData(e.target.value);
    const filtered = tableData.filter((item) =>
      item.username.toLowerCase().includes(searchValue)
    );

    setTableData(filtered);
  };

  const handleClickEdit = (id, item) => {
    setId(id);
    setInputData(item.username);
  };

  const handleClickAdd = (e) => {
    setInputData(e.target.value);
    const newId =
      tableData.length > 0
        ? Math.max(...tableData.map((item) => item.id)) + 1
        : 1;
    const newItem = {
      id: newId,
      username: inputData,
      email: "", // You can add additional fields if needed
      phone: "", // You can add additional fields if needed
    };
    setTableData([...tableData, newItem]);
  };
  const handleClickUpdate = () => {
    if (id !== null) {
      const updatedValue = tableData.map((item) =>
        item.id === id ? { ...item, username: inputData } : item
      );
      setTableData(updatedValue);
      setId(null);
      setInputData("");
    }
  };
  return (
    <div>
      <input
        value={searchData}
        onChange={handleSearch}
        className="border border-gray-400 px-4 py-2"
      />

      <table className="border-collapse ">
        <thead className="bg-gray-200">
          <tr className=" px-4 py-2">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Hex</th>
            <th className="px-4 py-2">RGB</th>

            <th className="px-4 py-2">HSL</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{item.username}</td>
              <td className="px-4 py-2">{item.email}</td>
              <td className="px-4 py-2">{item.phone}</td>
              <td className="px-4 py-2">{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
