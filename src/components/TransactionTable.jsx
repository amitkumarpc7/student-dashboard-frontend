import React from "react";
import { Table, Tag } from "antd";

const TransactionTable = ({ loading, data, onChange, pagination }) => {
  const columns = [
    {
      title: "Sr.No",
      dataIndex: "sr_no",
      render: (_v, _r, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Institute Name",
      dataIndex: "institute_name",
      render: (_v, r) =>
        r.institute_name ||
        r.school_name ||
        r.school_id ||
        "Edviron",
      sorter: true,
      ellipsis: true,
      width: 180,
    },
    {
      title: "Date & Time",
      dataIndex: "payment_time",
       render: (_v, r) => {
    if (!r.payment_time) return "N/A";
    const date = new Date(r.payment_time);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  },
      sorter: true,
      width: 180,
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (_v, r) => r.custom_order_id || "N/A",
      sorter: true,
      width: 120,
    },
    {
      title: "Edviron Order ID",
      dataIndex: "edviron_order_id",
      render: (_v, r) => r.edviron_order_id || r.collect_id || "N/A",
      sorter: true,
      width: 200,
    },
    {
      title: "Order Amt",
      dataIndex: "order_amount",
      sorter: true,
      align: "right",
      width: 110,
    },
    {
      title: "Transaction Amt",
      dataIndex: "transaction_amount",
      sorter: true,
      align: "right",
      width: 140,
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      render: (v) => v || "NA",
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: (status) => (
        <Tag
          color={
            status === "Success"
              ? "green"
              : status === "Failed"
              ? "red"
              : "orange"
          }
        >
          {status || "NA"}
        </Tag>
      ),
      width: 110,
    },
    {
      title: "Student Name",
      dataIndex: "student_name",
      render: (_v, r) => r.orderInfo?.student_info?.name || "N/A",
      width: 140,
    },
    {
      title: "Student ID",
      dataIndex: "student_id",
      render: (_v, r) => r.orderInfo?.student_info?._id || "N/A",
      width: 120,
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      render: (v) => v || "0000000000",
      width: 140,
    },
    {
      title: "Vendor Amount",
      dataIndex: "vendor_amount",
      render: (v) => v || "NA",
      align: "right",
      width: 140,
    },
    { title: "Gateway", dataIndex: "gateway", sorter: true, width: 120 },
    {
      title: "Capture Status",
      dataIndex: "capture_status",
      render: (v) => v || "NA",
      width: 150,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        rowKey="collect_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ ...pagination, showSizeChanger: true }}
        onChange={onChange}
        scroll={{ x: "max-content" }}
        size="small"
      />
    </div>
  );
};

export default TransactionTable;
