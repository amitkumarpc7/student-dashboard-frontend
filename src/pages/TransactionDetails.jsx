import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import TransactionTable from "../components/TransactionTable";
import { fetchTransactionsBySchool } from "../api/transaction";
import { CheckCircle, XCircle, Copy, AlertCircle } from "lucide-react";
import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const TransactionDetails = () => {
  const [schoolId, setSchoolId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Payment callback state
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [collectRequestId, setCollectRequestId] = useState(null);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);

  // Handle payment callback from URL parameters
  // useEffect(() => {
  //   const status = searchParams.get("status");
  //   const requestId = searchParams.get("EdvironCollectRequestId");

  //   if (status && requestId) {
  //     setPaymentStatus(status);
  //     setCollectRequestId(requestId);
  //     setShowPaymentNotification(true);

  //     console.log(`Payment ${status} for transaction: ${requestId}`);

  //     // Clean up URL parameters after processing
  //     const cleanSearchParams = new URLSearchParams(searchParams);
  //     cleanSearchParams.delete("status");
  //     cleanSearchParams.delete("EdvironCollectRequestId");
  //     window.history.replaceState(
  //       {},
  //       "",
  //       `${window.location.pathname}?${cleanSearchParams}`
  //     );

  //     // Auto-hide notification after 8 seconds
  //     const timer = setTimeout(() => {
  //       setShowPaymentNotification(false);
  //     }, 8000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [searchParams]);

  const fetch = async () => {
    setLoading(true);
    try {
      const resp = await fetchTransactionsBySchool(schoolId);
      setData(resp.data || resp);
    } catch (err) {
      console.error("Error fetching by school", err);
    } finally {
      setLoading(false);
    }
  };
  const clearSearch = () => {
    setSchoolId("");
    setData([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-full mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Transaction Details
          </h1>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Input
              placeholder="Enter School ID (e.g.,65b0e6293e9f76a9694d84b4)"
              className="w-full sm:flex-1 max-w-md"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              size="large"
            />
            <Button
              type="primary"
              onClick={fetch}
              size="large"
              className="w-full sm:w-auto"
              loading={loading}
              icon={<SearchOutlined />}
            >
              Fetch Transactions
            </Button>
            <Button
              onClick={clearSearch}
              size="large"
              className="w-full sm:w-auto"
              disabled={loading}
              icon={<ReloadOutlined />}
            >
              Clear
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Enter a School ID to view all transactions for that school.</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {data.length === 0 && !loading ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              <div className="mb-4">
                {showPaymentNotification && paymentStatus === "SUCCESS" ? (
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-2" />
                ) : (
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {showPaymentNotification && paymentStatus === "SUCCESS"
                  ? "Payment Completed Successfully!"
                  : "No Transactions Found"}
              </h3>
              <p>
                {showPaymentNotification && paymentStatus === "SUCCESS"
                  ? "Enter a School ID above to view all transactions for that school."
                  : 'Enter a School ID and click "Fetch Transactions" to view transaction details.'}
              </p>
            </div>
          ) : (
            <TransactionTable
              loading={loading}
              data={data}
              pagination={{
                pageSize: 10,
                total: data.length,
                current: 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
