import React from 'react';
import SalaryTable from './SalaryTable.js'; // Ensure the path to SalaryTable is correct

function App() {
  return (
    <div className="App">
      <h1>ML Engineer Salaries</h1>
      {/* Ensure SalaryTable is correctly self-closed */}
      <SalaryTable /> 
    </div>
  );
}

export default App;
