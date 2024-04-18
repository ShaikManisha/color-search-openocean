/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Table from "./Table";

const TableLayout = () => {
  const [tableData, setTableData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json"
      );

      if (!res.ok) {
        throw new Error("Failed to fetch colors");
      }

      const data = await res.json();
      const formattedData = data.colors.map((item) => ({
        ...item,
        rgb: hexToRgb(item.hex),
        hsl: rgbToHsl(hexToRgb(item.hex)),
      }));
      setTableData(formattedData);
      setFilteredData(formattedData); // Initialize filteredData with original data
    } catch (error) {
      setFetchError(true);
      console.error("Error fetching colors:", error);
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHsl = (rgb) => {
    const [r, g, b] = rgb
      .substring(4, rgb.length - 1)
      .split(",")
      .map((c) => parseInt(c.trim()));

    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;

    const cmin = Math.min(normR, normG, normB);
    const cmax = Math.max(normR, normG, normB);
    const delta = cmax - cmin;

    let h = 0,
      s = 0,
      l = 0;

    if (delta === 0) {
      h = 0;
    } else if (cmax === normR) {
      h = ((normG - normB) / delta) % 6;
    } else if (cmax === normG) {
      h = (normB - normR) / delta + 2;
    } else {
      h = (normR - normG) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchData(searchValue);

    const filtered = searchValue
      ? tableData.filter(
          (item) =>
            item.color.toLowerCase().includes(searchValue) ||
            item.hex.toLowerCase().includes(searchValue) ||
            item.rgb.toLowerCase().includes(searchValue)
        )
      : tableData;

    setFilteredData(filtered);

    if (filtered.length > 0) {
      setSuccess("Valid color");
      setError("");
    } else {
      setError("Color not found in the list");
      setSuccess("");
    }
  };

  const retryFetchColors = () => {
    setFetchError(false);
    fetchData();
  };

  return (
    <>
      <h1 className="flex justify-center items-center font-bold text-xl">
        Color Search Tool
      </h1>
      <label
        htmlFor="color"
        className="block text-sm font-medium leading-6 text-gray-900">
        Color
      </label>
      <input
        type="text"
        placeholder="Enter Color"
        className="border border-gray-400 rounded-md px-4 mr-3 py-2"
        value={searchData}
        onChange={handleSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e);
          }
        }}
      />

      <input
        type="color"
        id="color"
        className="border border-gray-400 rounded-md px-4 py-3"
        value={searchData}
        onChange={handleSearch}
      />

      {error && !success && <p>{error}</p>}
      {success && <p>{success}</p>}
      {fetchError ? (
        <div>
          <p>Error fetching colors. Please retry.</p>
          <button onClick={retryFetchColors}>Retry</button>
        </div>
      ) : filteredData.length > 0 ? (
        <>
          {searchData === "" ? (
            <h1>All Colors</h1>
          ) : (
            <h1>Results for `{searchData}`</h1>
          )}
          <table className="border-collapse mt-4">
            <thead className="bg-gray-200">
              <tr className="px-4 py-2">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Hex</th>
                <th className="px-4 py-2">RGB</th>
                <th className="px-4 py-2">HSL</th>
              </tr>
            </thead>
            <tbody>
              <Table filteredData={filteredData} />
            </tbody>
          </table>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default TableLayout;
