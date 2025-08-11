export default function CustomerSearch({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">ค้นหาลูกค้า</h2>
      <input
        type="text"
        placeholder="ชื่อ หรือ เลขบัตรประชาชน"
        className="w-full border px-3 py-2 rounded mb-3"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">
        🔍 ค้นหา
      </button>
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">
        ➕ ลงทะเบียนลูกค้า
      </button>
    </div>
  );
}
