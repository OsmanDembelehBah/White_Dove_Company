'use client';
import { useApp } from '@/lib/store/app-store';
import { InventoryItem, SaleTransaction } from '@/lib/supabase/types';
import AddEditProductModal from '@/components/AddEditProductModal';
import ReceiptModal from '@/components/ReceiptModal';
import { 
  LayoutDashboard, 
  Plus, 
  RefreshCw, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Printer, 
  Download,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function ManagerDashboard() {
  const { 
    currentProfile, 
    inventory, 
    sales, 
    totalDailyRevenue, 
    totalDailyItemsSold, 
    activeSellersCount, 
    lowStockCount,
    deleteInventoryItem 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<InventoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'restock'>('add');
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<SaleTransaction | null>(null);

  // Categories list
  const categories = ['All Categories', ...Array.from(new Set(inventory.map((item) => item.category)))];

  // Filtered inventory table items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;

    let matchesFilter = true;
    if (filterMode === 'low_stock') {
      matchesFilter = item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold;
    } else if (filterMode === 'out_of_stock') {
      matchesFilter = item.stock_quantity === 0;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from inventory?`)) {
      await deleteInventoryItem(id);
    }
  };

  const exportSalesCSV = () => {
    const headers = ['Sale ID,Seller Name,Product Name,Quantity Sold,Rate per Unit,Total Price,Customer,Payment Method,Sold At\n'];
    const rows = sales.map((s) =>
      `"${s.id}","${s.seller_name}","${s.product_name}",${s.quantity_sold},${s.rate_per_unit},${s.total_price},"${s.customer_name}","${s.payment_method}","${s.sold_at}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `whitedove_sales_export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Executive Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F233D] via-[#122C4D] to-[#07101E] border border-whitedove-slate shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/30">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-heading text-white">Executive Manager Dashboard</h1>
              <span className="bg-blue-600/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-500/30">
                {currentProfile.full_name} (Manager)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              White Dove Electrical & Engineering • Real-Time Sales WebSocket Feed & Full Inventory Control
            </p>
          </div>
        </div>

        {/* Manager Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setModalMode('add');
              setModalProduct(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Stock Item</span>
          </button>

          <button
            onClick={exportSalesCSV}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-whitedove-slate/60 hover:bg-whitedove-slate text-slate-200 text-xs font-bold border border-whitedove-slate transition-colors"
            title="Export Sales History as CSV"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Analytics Tracker) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue Today */}
        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate space-y-3 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Revenue Today</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-400 font-heading">
              SLE {totalDailyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Live updated across all seller counters
            </p>
          </div>
        </div>

        {/* Total Items Sold Today */}
        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Items Sold Today</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white font-heading">
              {totalDailyItemsSold} <span className="text-xs font-normal text-slate-400">units</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {sales.length} logged sales transactions
            </p>
          </div>
        </div>

        {/* Active Sellers Count */}
        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Sellers</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white font-heading">
              {activeSellersCount} <span className="text-xs font-normal text-slate-400">sellers active</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Mohamed Bangura & Sorie Kamara
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-5 rounded-2xl border space-y-3 shadow-lg ${
          lowStockCount > 0 
            ? 'bg-amber-950/20 border-amber-500/50' 
            : 'bg-[#0F233D] border-whitedove-slate'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-300 font-heading">
              {lowStockCount} <span className="text-xs font-normal text-slate-400">products &lt; threshold</span>
            </p>
            <button
              onClick={() => setFilterMode('low_stock')}
              className="text-[11px] text-amber-400 hover:underline font-bold mt-1 inline-flex items-center"
            >
              <span>View Low-Stock Products</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Real-Time Live Sales Activity Feed Section */}
      <div className="p-6 rounded-3xl bg-[#0F233D] border border-whitedove-slate space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-whitedove-slate/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Supabase Real-Time Live Activity Feed</h3>
              <p className="text-xs text-slate-400">Instant WebSocket updates when sellers log transactions</p>
            </div>
          </div>

          <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
            Live Stream Active
          </span>
        </div>

        {/* Live Feed Cards */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="p-4 rounded-2xl bg-[#07101E] border border-whitedove-slate/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-amber-300 text-sm">{sale.seller_name}</span>
                    <span className="text-slate-400">sold</span>
                    <span className="font-bold text-white bg-whitedove-slate/60 px-2 py-0.5 rounded">
                      {sale.quantity_sold} x {sale.product_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Rate: SLE {sale.rate_per_unit.toLocaleString()} • Customer: {sale.customer_name} ({sale.payment_method})
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="text-base font-extrabold text-amber-400 font-heading">
                    SLE {sale.total_price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {new Date(sale.sold_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedReceiptSale(sale)}
                  className="p-2 rounded-lg bg-whitedove-slate/40 hover:bg-whitedove-slate text-amber-300 transition-colors"
                  title="Print Sale Voucher"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Inventory CRUD Management Table */}
      <div className="p-6 rounded-3xl bg-[#0F233D] border border-whitedove-slate space-y-5 shadow-xl">
        
        {/* Table Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-heading text-white">White Dove Electrical Stock Inventory</h3>
            <p className="text-xs text-slate-400">Full Inventory Management, Restock, Price Adjustments & Low Stock Thresholds</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter Tabs */}
            <div className="flex items-center bg-[#07101E] p-1 rounded-xl border border-whitedove-slate/60">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({inventory.length})
              </button>

              <button
                onClick={() => setFilterMode('low_stock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === 'low_stock' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Low Stock ({lowStockCount})
              </button>

              <button
                onClick={() => setFilterMode('out_of_stock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === 'out_of_stock' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Out of Stock ({inventory.filter((i) => i.stock_quantity === 0).length})
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inventory..."
                className="w-full pl-9 pr-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-whitedove-slate/60 bg-[#07101E]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0A182B] text-slate-400 uppercase text-[10px] tracking-wider border-b border-whitedove-slate/60">
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
                <th className="py-3.5 px-4 text-right">Unit Rate (SLE)</th>
                <th className="py-3.5 px-4 text-center">Status Indicator</th>
                <th className="py-3.5 px-4 text-right">Manager Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-whitedove-slate/40">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isOut = item.stock_quantity === 0;
                  const isLow = item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold;

                  return (
                    <tr key={item.id} className="hover:bg-whitedove-slate/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-sm">{item.product_name}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-whitedove-slate/60 text-slate-200 font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-sm">
                        <span className={isOut ? 'text-red-400' : isLow ? 'text-amber-300' : 'text-white'}>
                          {item.stock_quantity} units
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Thresh: {item.low_stock_threshold}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-amber-400 text-sm font-heading">
                        SLE {item.unit_price.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isOut
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {isOut ? (
                            <>
                              <XCircle className="w-3 h-3 mr-1 text-red-400" /> Out of Stock
                            </>
                          ) : isLow ? (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1 text-amber-300" /> Low Stock Warning
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" /> In Stock
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Quick Restock */}
                          <button
                            onClick={() => {
                              setModalMode('restock');
                              setModalProduct(item);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                            title="Quick Restock Item"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          {/* Edit Product */}
                          <button
                            onClick={() => {
                              setModalMode('edit');
                              setModalProduct(item);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition-colors"
                            title="Edit Product Details & Price"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id, item.product_name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Add / Edit / Restock Product Modal */}
      <AddEditProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        productToEdit={modalProduct}
        mode={modalMode}
      />

      {/* Printable Receipt Voucher */}
      <ReceiptModal
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />

    </div>
  );
}
