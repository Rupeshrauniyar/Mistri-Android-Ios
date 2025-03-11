import React from "react";

/**
 * PageHeader component for consistent page headers
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 */
const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="xl:mt-2">
      <h4 className="text-4xl font-black">{title}</h4>
      {subtitle && <p className="text-lg w-[90%] xl:block text-indexColor">{subtitle}</p>}
    </div>
  );
};

export default PageHeader; 