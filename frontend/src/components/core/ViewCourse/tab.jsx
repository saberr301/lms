import React from "react";

export function Tab({ children }) {
  return <div className="tab-content">{children}</div>;
}

export function Tabs({ children, activeTab, onTabChange }) {
  // Extrait les valeurs et labels des onglets enfants
  const tabs = React.Children.toArray(children).map((child) => ({
    label: child.props.label,
    value: child.props.value,
  }));

  return (
    <div className="w-full">
      <div className="flex border-b border-richblack-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.value
                ? "border-b-2 border-yellow-50 text-yellow-50"
                : "text-richblack-300 hover:text-richblack-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panels">
        {React.Children.toArray(children).map((child) => {
          if (child.props.value === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}
