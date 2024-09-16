import React from 'react';

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex  flex-grow">
      {children}
    </div>
  );
}

export default Content;
