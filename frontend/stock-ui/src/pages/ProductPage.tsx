import { useEffect, useState } from "react";
import axios from "axios";
import AddProductModal from "../components/product/AddProductModal";
import ProductTable from "../components/product/ProductTable";

export interface Product {
  id: number;
  itemName: string;
  weightValue: number;
  unit: string;
  quantity: number;
  type: {
    id: number;
    name: string;
  };
  note: string;
}

export interface StockType {
  id: number;
  name: string;
}

type SortOption =
  | ""
  | "weight-asc"
  | "weight-desc"
  | "quantity-asc"
  | "quantity-desc";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [stockTypes, setStockTypes] = useState<StockType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(
        "http://localhost:8080/api/stock-items"
      );
      setProducts(res.data);
    } catch (err) {
      console.error("โหลดสินค้าล้มเหลว", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axios.get<StockType[]>(
        "http://localhost:8080/api/stock-types"
      );
      setStockTypes(res.data);
    } catch (err) {
      console.error("โหลดประเภทล้มเหลว", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTypes();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedTypeId !== null) {
      filtered = filtered.filter((p) => p.type.id === selectedTypeId);
    }

    if (searchKeyword.trim()) {
      filtered = filtered.filter((p) =>
        p.itemName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (sortBy === "weight-asc") {
      filtered.sort((a, b) => a.weightValue - b.weightValue);
    } else if (sortBy === "weight-desc") {
      filtered.sort((a, b) => b.weightValue - a.weightValue);
    } else if (sortBy === "quantity-asc") {
      filtered.sort((a, b) => a.quantity - b.quantity);
    } else if (sortBy === "quantity-desc") {
      filtered.sort((a, b) => b.quantity - a.quantity);
    }

    setFilteredProducts(filtered);
  }, [products, selectedTypeId, searchKeyword, sortBy]);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/stock-items/${id}`);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">รายการสินค้า</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มสินค้า
        </button>
      </div>

      <div className="flex gap-4 flex-wrap mb-4">
        <input
          type="text"
          placeholder="ค้นหาชื่อสินค้า"
          className="border px-3 py-2 rounded w-60"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={selectedTypeId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedTypeId(value === "" ? null : Number(value));
          }}
        >
          <option value="">ทุกประเภท</option>
          {stockTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="">-- เรียงตาม --</option>
          <option value="weight-asc">น้ำหนัก (น้อย → มาก)</option>
          <option value="weight-desc">น้ำหนัก (มาก → น้อย)</option>
          <option value="quantity-asc">จำนวน (น้อย → มาก)</option>
          <option value="quantity-desc">จำนวน (มาก → น้อย)</option>
        </select>
      </div>

      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onProductAdded={fetchProducts}
        productToEdit={productToEdit}
      />
    </div>
  );
}
