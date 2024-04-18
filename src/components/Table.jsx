/* eslint-disable react/prop-types */
const Table = ({ filteredData }) => {
  return (
    <>
      <tr>
        <th className="px-4 py-2 flex items-center">Name</th>
        <th className="px-4 py-2">Hex</th>
        <th className="px-4 py-2">RGB</th>
        <th className="px-4 py-2">HSL</th>
      </tr>
      {filteredData?.map((item, index) => (
        <tr key={index}>
          <td className="px-4 py-2 flex items-center">
            <span
              className="inline-block mr-2 w-5 h-5 border text-left border-black"
              style={{ backgroundColor: item?.hex }}></span>
            <span>{item?.color}</span>
          </td>
          <td className="px-4 py-2">{item?.hex}</td>
          <td className="px-4 py-2">{item?.rgb}</td>
          <td className="px-4 py-2">{item?.hsl}</td>
        </tr>
      ))}
    </>
  );
};

export default Table;
