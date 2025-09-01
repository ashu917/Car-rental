import React from 'react';

const Title = ({title,  subTitle, align }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center mb-12
        ${align === 'left' ? 'md:items-start md:text-left' : ''}`}
    >
      <h1 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
        {/* User Dashboard */}{title}
      </h1>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
        {subTitle}
      </p>
    </div>
  );
};

export default Title;

