import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/Filterbar";
import TransactionTable from "../components/TransactionTable";
import { fetchTransactions } from "../api/transaction";
import { Search, Filter, Download, Copy, ChevronDown } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState(() => {
    const v = searchParams.get("status");
    return v ? v.split(",") : [];
  });
  const [schoolFilter, setSchoolFilter] = useState(() => {
    const v = searchParams.get("school_id");
    return v ? v.split(",") : [];
  });
  const [searchText, setSearchText] = useState(
    () => searchParams.get("search") || ""
  );
  const [dateRange, setDateRange] = useState(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");
    return start && end ? [start, end] : [];
  });
  const [pagination, setPagination] = useState({
    current: Number(searchParams.get("page") || 1),
    pageSize: Number(searchParams.get("limit") || 10),
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: searchParams.get("sort") || "payment_time",
    order: searchParams.get("order") || "desc",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        status: statusFilter,
        school_id: schoolFilter,
        search: searchText,
        sort: sorter.field,
        order: sorter.order === "ascend" ? "asc" : "desc",
        start_date: dateRange?.[0] || undefined,
        end_date: dateRange?.[1] || undefined,
      };
      const resp = await fetchTransactions(params);
      setData(resp.data);
      setPagination((prev) => ({ ...prev, total: resp.total }));
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Sr.No",
      "Institute Name",
      "Date & Time",
      "Order ID",
      "Edviron Order ID",
      "Order Amt",
      "Transaction Amt",
      "Payment Method",
      "Status",
      "Student Name",
      "Student ID",
      "Phone No.",
      "Vendor Amount",
      "Gateway",
      "Capture Status",
    ];
    const rows = data.map((r, idx) => [
      pagination.pageSize * (pagination.current - 1) + idx + 1,
      r.institute_name || r.school_name || r.school_id || "N/A",
      r.payment_time || "",
      r.order_id || "N/A",
      r.edviron_order_id || r.collect_id || "N/A",
      r.order_amount || "",
      r.transaction_amount || "",
      r.payment_method || "NA",
      r.status || "NA",
      r.student_name || "",
      r.student_id || "",
      r.phone || "0000000000",
      r.vendor_amount || "NA",
      r.gateway || "",
      r.capture_status || "NA",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "failed":
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  useEffect(() => {
    // persist to URL
    const params = new URLSearchParams();
    if (statusFilter.length) params.set("status", statusFilter.join(","));
    if (schoolFilter.length) params.set("school_id", schoolFilter.join(","));
    if (searchText) params.set("search", searchText);
    if (dateRange?.length === 2) {
      params.set("start_date", dateRange[0]);
      params.set("end_date", dateRange[1]);
    }
    params.set("page", String(pagination.current));
    params.set("limit", String(pagination.pageSize));
    params.set("sort", sorter.field);
    params.set("order", sorter.order);
    setSearchParams(params, { replace: true });

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    statusFilter,
    schoolFilter,
    searchText,
    pagination.current,
    pagination.pageSize,
    sorter,
    dateRange,
  ]);

  const handleTableChange = (pag, filters, sorterObj) => {
    setPagination({
      current: pag.current,
      pageSize: pag.pageSize,
      total: pagination.total,
    });
    if (sorterObj.field) {
      setSorter({ field: sorterObj.field, order: sorterObj.order || "desc" });
    }
  };

  const onFilterChange = (sts, schools, search, range) => {
    setStatusFilter(sts);
    setSchoolFilter(schools);
    setSearchText(search);
    setDateRange(range || []);
    setPagination((prev) => ({ ...prev, current: 1 })); // reset to page 1 on filter change
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6 transition-colors duration-200">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-lightGray dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-4 lg:p-6 transition-colors duration-200 ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              History
            </h1>
            <button
              onClick={exportCSV}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Enhanced Filter Section */}
          <div className="mt-6 space-y-4">
            {/* Main Filter Row */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              {/* Left side - Search and Filter By */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-xs">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search Order Id..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Filter By Dropdown */}
                <div className="relative">
                  <select className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] text-gray-900 dark:text-white">
                    <option>Filter By</option>
                    <option>Institute</option>
                    <option>Student</option>
                    <option>Amount</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Right side - Date, Status, All Filter */}
              <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
                {/* Date Filter */}
                <div className="relative">
                  <input
                    type="date"
                    placeholder="Date"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter.join(",")}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value ? e.target.value.split(",") : []
                      )
                    }
                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] text-gray-900 dark:text-white"
                  >
                    <option value="">Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>

                {/* All Filter Dropdown */}
                <div className="relative">
                  <select className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] text-gray-900 dark:text-white">
                    <option>All Filter</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 lg:hidden text-gray-900 dark:text-white"
                >
                  <Filter size={16} />
                  More
                </button>
              </div>
            </div>

            {/* Advanced FilterBar Integration - Mobile Only */}
            <div className={`${showFilters ? "block" : "hidden"} lg:hidden`}>
              <FilterBar
                statusFilter={statusFilter}
                schoolFilter={schoolFilter}
                searchText={searchText}
                dateRange={dateRange}
                onFilterChange={onFilterChange}
              />
            </div>
          </div>

          {/* Rows per page */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  current: 1,
                }))
              }
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={16}>16</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Sr.No
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Institute Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Edviron Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Order Amt
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Transaction Amt
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Payment Method
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Student Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Student ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Phone No.
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Vendor Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Gateway
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Capture Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {data.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                          {pagination.pageSize * (pagination.current - 1) +
                            index +
                            1}
                        </td>
                        <td className="py-3 px-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                          {row.institute_name ||
                            row.school_name ||
                            row.school_id ||
                            "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {row.payment_time || ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            {row.order_id || "N/A"}
                            {row.order_id && row.order_id !== "N/A" && (
                              <Copy
                                size={14}
                                className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                                onClick={() => copyToClipboard(row.order_id)}
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">
                              {row.edviron_order_id || row.collect_id || "N/A"}
                            </span>
                            {(row.edviron_order_id || row.collect_id) && (
                              <Copy
                                size={14}
                                className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                                onClick={() =>
                                  copyToClipboard(
                                    row.edviron_order_id || row.collect_id
                                  )
                                }
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                          ₹{row.order_amount || "0"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                          ₹{row.transaction_amount || "0"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.payment_method || "NA"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              row.status
                            )}`}
                          >
                            {row.status || "NA"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                          {row.student_name || ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {row.student_id || ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.phone || "0000000000"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.vendor_amount || "NA"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.gateway || ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.capture_status || "NA"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Showing {data.length} results
                  </div>
                  <div className="space-y-4">
                    {data.map((row, index) => (
                      <div
                        key={row.id || index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-blue-600 dark:text-blue-400">
                              {row.institute_name ||
                                row.school_name ||
                                row.school_id ||
                                "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {row.payment_time || ""}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              row.status
                            )}`}
                          >
                            {row.status || "NA"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Order Amount:
                            </span>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              ₹{row.order_amount || "0"}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Transaction Amount:
                            </span>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              ₹{row.transaction_amount || "0"}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Student:
                            </span>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {row.student_name || ""}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Student ID:
                            </span>
                            <div className="font-medium text-blue-600 dark:text-blue-400">
                              {row.student_id || ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Edviron Order ID:
                          </span>
                          <div className="font-mono text-xs break-all text-gray-900 dark:text-gray-100">
                            {row.edviron_order_id || row.collect_id || "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Keep the original TransactionTable component for pagination */}
          <div className="hidden">
            <TransactionTable
              loading={loading}
              data={data}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </div>
        </div>

        {/* Custom Pagination Controls */}
        {!loading && data.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-6 p-4 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.current * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current: Math.max(1, prev.current - 1),
                    }))
                  }
                  disabled={pagination.current === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                  {pagination.current}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current: prev.current + 1,
                    }))
                  }
                  disabled={
                    pagination.current * pagination.pageSize >= pagination.total
                  }
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
