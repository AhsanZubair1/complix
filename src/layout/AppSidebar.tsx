import React from "react";
import { Link, useLocation } from "react-router";
import {
  CalenderIcon,
  TaskIcon,
  DocsIcon,
  CheckLineIcon,
  TableIcon,
  AiIcon,
  GridIcon,
  BreachIcon,
  SearchIcon,
  ObligationIcon,
  ChatIcon,
} from "../icons/index";
import { useSidebar } from "../context/SidebarContext";

const Sidebar: React.FC = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <GridIcon className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Compliance Calendar",
      icon: <CalenderIcon className="h-5 w-5" />,
      path: "/compliance-calendar",
    },
    {
      name: "Breaches",
      icon: <BreachIcon className="h-5 w-5" />,
      path: "/breaches",
    },
    {
      name: "Remediation Actions",
      icon: <TaskIcon className="h-5 w-5" />,
      path: "/remediation-actions",
    },
    {
      name: "Contracts",
      icon: <DocsIcon className="h-5 w-5" />,
      path: "/contracts",
    },
    {
      name: "Audit Assessment",
      icon: <SearchIcon className="h-5 w-5" />,
      path: "/audit-assessment",
    },
    {
      name: "Obligations",
      icon: <ObligationIcon className="h-5 w-5" />,
      path: "/obligations",
    },
    {
      name: "Tasks",
      icon: <TaskIcon className="h-5 w-5" />,
      path: "/tasks",
    },
    {
      name: "Registers",
      icon: <TableIcon className="h-5 w-5" />,
      path: "/registers",
    },
    {
      name: "AI Assistant",
      icon: <ChatIcon className="h-5 w-5" />,
      path: "/ai-assistant",
    },
  ];

  const handleMouseEnter = () => {
    if (!isExpanded) {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#C9CFD730] text-white">
      <div
        className={`bg-gray-900 border-r border-[#1D2939] transition-all duration-300 ease-in-out flex flex-col ${
          isExpanded ? "w-72" : "w-20"
        }`}
        onMouseEnter={handleMouseEnter}
      >
        <div className="p-4 flex items-center justify-between">
          {isExpanded && (
            <h1 className="font-bold text-3xl">
              compli<span className="text-4xl font-bold text-[#2905f1]">X</span>
            </h1>
          )}
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          <h2
            className={`px-4 text-xs font-medium uppercase tracking-wider text-gray-400 ${
              !isExpanded && "hidden"
            }`}
          >
            Menu
          </h2>
          <nav className="mt-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium hover:bg-gray-800 group ${
                      !isExpanded ? "justify-center" : ""
                    } ${
                      location.pathname === item.path
                        ? "bg-gray-800 text-white"
                        : "text-gray-300"
                    }`}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      <span className={`ml-3 ${!isExpanded && "hidden"}`}>
                        {item.name}
                      </span>
                    </span>
                    {!isExpanded && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md text-sm text-white opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
