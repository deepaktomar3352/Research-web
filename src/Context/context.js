import { createContext, useState } from "react";

export const StatusContext = createContext(null);

const StatusProvider = ({ children }) => {
  const [paper_id, setPaperId] = useState(false);

  return (
    <StatusContext.Provider value={{ paper_id, setPaperId}}>
      {children}
    </StatusContext.Provider>
  );
};
export default StatusProvider;
