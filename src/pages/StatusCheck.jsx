import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  Statistic,
  Tag,
  Descriptions,
  Space,
  Alert,
  Spin,
  Row,
  Col,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  TransactionOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { checkStatus } from "../api/transaction";

const { Title } = Typography;

const StatusCheck = () => {
  const [orderId, setOrderId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const check = async () => {
    if (!orderId.trim()) {
      setError("Please enter a Custom Order ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await checkStatus(orderId);
      setStatusData(resp);
    } catch (err) {
      console.error("Error checking status", err);
      setError(
        "Failed to fetch transaction status. Please check the Order ID and try again."
      );
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "orange",
      success: "green",
      failed: "red",
      completed: "blue",
      processing: "purple",
    };
    return statusColors[status?.toLowerCase()] || "default";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      check();
    }
  };

  const clearSearch = () => {
    setOrderId("");
    setStatusData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <Card className="border-0 shadow-sm mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Transaction Status Check
          </h1>
        </Card>

        {/* Search Section */}
        <Card className="border-0 shadow-sm mb-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Input
              placeholder="Enter Custom Order ID"
              className="w-full sm:flex-1 max-w-md"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              size="large"
            />
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="primary"
                onClick={check}
                size="large"
                className="w-full sm:w-auto"
                loading={loading}
                icon={<SearchOutlined />}
              >
                Check Status
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
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mt-4"
              closable
              onClose={() => setError(null)}
            />
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>
              Enter a Custom Order ID to view detailed transaction information.
            </p>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="border-0 shadow-sm">
          {loading ? (
            <div className="p-10 text-center">
              <Spin size="large" className="mb-4" />
              <Title
                level={4}
                className="text-gray-600 dark:text-gray-400 mb-2"
              >
                Fetching Transaction Details
              </Title>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we retrieve the transaction information...
              </p>
            </div>
          ) : statusData ? (
            <div className="p-0">
              {/* Status Overview Cards */}
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                  <Card className="h-full border-0 shadow-sm">
                    <Statistic
                      title="Status"
                      value={statusData.status}
                      prefix={
                        <Tag
                          color={getStatusColor(statusData.status)}
                          className="text-sm"
                        >
                          {statusData.status.toUpperCase()}
                        </Tag>
                      }
                      valueStyle={{ fontSize: "16px" }}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card className="h-full border-0 shadow-sm">
                    <Statistic
                      title="Order Amount"
                      value={statusData.order_amount}
                      prefix={<DollarOutlined className="text-green-500" />}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="₹"
                    />
                  </Card>
                </Col>

                {statusData.transaction_amount && (
                  <Col xs={24} sm={8}>
                    <Card className="h-full border-0 shadow-sm">
                      <Statistic
                        title="Transaction Amount"
                        value={statusData.transaction_amount}
                        prefix={<DollarOutlined className="text-red-500" />}
                        valueStyle={{ color: "#cf1322" }}
                        suffix="₹"
                      />
                    </Card>
                  </Col>
                )}
              </Row>

              {/* Transaction Details */}
              <Card
                title={
                  <span className="text-lg font-semibold">
                    Transaction Details
                  </span>
                }
                className="border-0 shadow-sm"
              >
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2 }}
                  size="middle"
                >
                  <Descriptions.Item label="Custom Order ID" span={2}>
                    <Tag
                      color="blue"
                      className="text-sm"
                    >
                      {statusData.custom_order_id}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Collect ID">
                    <code className="px-2 py-1 rounded text-sm">
                      {statusData.collect_id}
                    </code>
                  </Descriptions.Item>

                  <Descriptions.Item label="Order ID">
                    <code className="px-2 py-1 rounded text-sm">
                      {statusData.order_id}
                    </code>
                  </Descriptions.Item>

                  <Descriptions.Item label="Payment Mode">
                    <Tag color="purple" className="text-sm">
                      {statusData.payment_mode || "N/A"}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Payment Time" span={2}>
                    <Space>
                      
                      <span>
                        {statusData.payment_time
                          ? new Date(statusData.payment_time).toLocaleString()
                          : "N/A"}
                      </span>
                    </Space>
                  </Descriptions.Item>

                  {/* Student Information */}
                  {statusData.student_name && (
                    <>
                      <Descriptions.Item label="Student Name">
                        {statusData.student_name}
                      </Descriptions.Item>

                      <Descriptions.Item label="Student ID">
                        {statusData.student_id}
                      </Descriptions.Item>

                      {statusData.phone && (
                        <Descriptions.Item label="Phone">
                          {statusData.phone}
                        </Descriptions.Item>
                      )}
                    </>
                  )}

                  {statusData.school_id && (
                    <Descriptions.Item label="School ID">
                      <Tag color="green" className="text-sm">
                        {statusData.school_id}
                      </Tag>
                    </Descriptions.Item>
                  )}

                  {statusData.gateway && (
                    <Descriptions.Item label="Payment Gateway">
                      <Tag color="orange" className="text-sm">
                        {statusData.gateway}
                      </Tag>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </div>
          ) : (
            <div className="p-10 text-center">
              <TransactionOutlined className="text-4xl mb-4 text-gray-400" />
              <Title level={4} className="mb-2">
                No Transaction Selected
              </Title>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a Custom Order ID above to check transaction status
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StatusCheck;
