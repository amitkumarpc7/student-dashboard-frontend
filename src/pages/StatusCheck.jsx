import React, { useState } from "react";
import { Input, Button } from "antd";
import { checkStatus } from "../api/transaction";

const StatusCheck = () => {
  const [orderId, setOrderId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const resp = await checkStatus(orderId);
      setStatusData(resp);
    } catch (err) {
      console.error("Error checking status", err);
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Custom Order ID"
          className="w-full sm:w-1/2"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button type="primary" onClick={check} className="w-full sm:w-auto">
          Check Status
        </Button>
      </div>
      {statusData && (
        <div>
          <p>
            <strong>Status:</strong> {statusData.status}
          </p>
          <p>
            <strong>Collect ID:</strong> {statusData.collect_id}
          </p>
          <p>
            <strong>Order Amount:</strong> {statusData.order_amount}
          </p>
          <p>
            <strong>Transaction Amount:</strong> {statusData.transaction_amount}
          </p>
          <p>
            <strong>Payment Time:</strong> {statusData.payment_time}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;
