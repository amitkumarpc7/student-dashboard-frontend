import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeSwitch";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-4 transition-colors duration-200">
      <div className="flex justify-between items-center">
        {/* Left Section - Logo */}
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          <Link to="/">School Dashboard</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center">
            {user && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Transactions
                </Link>
                <Link
                  to="/details"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  By School
                </Link>
                <Link
                  to="/check"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Check Status
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-auto text-gray-900 dark:text-white"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="flex flex-col mt-2 md:hidden gap-2">
          {user && (
            <>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Transactions
              </Link>
              <Link
                to="/details"
                onClick={() => setOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                By School
              </Link>
              <Link
                to="/check"
                onClick={() => setOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Check Status
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
