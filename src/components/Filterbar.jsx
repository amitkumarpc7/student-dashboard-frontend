import React from "react";
import { Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const FilterBar = ({
  statusFilter,
  schoolFilter,
  searchText,
  dateRange,
  onFilterChange,
}) => {
  const onDateChange = (dates, dateStrings) => {
    const [start, end] = dateStrings || [];
    onFilterChange(
      statusFilter,
      schoolFilter,
      searchText,
      start && end ? [start, end] : []
    );
  };
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="w-full sm:w-1/3 md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Status
        </label>
        <Select
          mode="multiple"
          placeholder="Select Status"
          className="w-full"
          value={statusFilter}
          onChange={(val) => onFilterChange(val, schoolFilter, searchText)}
        >
          <Option value="success">Success</Option>
          <Option value="pending">Pending</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      <div className="w-full sm:w-1/3 md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by School
        </label>
        <Select
          mode="multiple"
          placeholder="Select School"
          className="w-full"
          value={schoolFilter}
          onChange={(val) => onFilterChange(statusFilter, val, searchText)}
        >
          {/* You could fetch school list or get from API */}
          <Option value="65b0e6293e9f76a9694d84b4">DefaultSchool</Option>
        </Select>
      </div>

      <div className="w-full sm:w-1/3 md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search
        </label>
        <Input
          placeholder="Search Custom Order ID"
          className="w-full"
          value={searchText}
          onChange={(e) =>
            onFilterChange(statusFilter, schoolFilter, e.target.value)
          }
        />
      </div>

      <div className="w-full sm:w-1/3 md:w-1/4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <DatePicker.RangePicker
          className="w-full"
          value={
            dateRange && dateRange.length === 2
              ? [
                  dateRange[0] && dayjs(dateRange[0]),
                  dateRange[1] && dayjs(dateRange[1]),
                ]
              : null
          }
          onChange={onDateChange}
          allowEmpty={[true, true]}
        />
      </div>
    </div>
  );
};

export default FilterBar;
