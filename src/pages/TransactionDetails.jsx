import React, { useState } from "react";
import { Input, Button } from "antd";
import TransactionTable from "../components/TransactionTable";
// import { fetchTransactionsBySchool } from "../api/transactions";

const TransactionDetails = () => {
  const [schoolId, setSchoolId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter School ID"
          className="w-full sm:w-1/2"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        />
        <Button type="primary" onClick={fetch} className="w-full sm:w-auto">
          Fetch
        </Button>
      </div>
      <TransactionTable
        loading={loading}
        data={data}
        pagination={{ pageSize: 10, total: data.length, current: 1 }}
      />
    </div>
  );
};

export default TransactionDetails;
