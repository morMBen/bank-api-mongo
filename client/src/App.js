import './App.css';
import api from './api/api';
import React, { useEffect, useState } from 'react';

function App() {
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get('clients');
      console.log(data);
    };
    fetchData();
  })

  const handleSubmit = async () => {
    await api.post('clients', { name: value })
  }

  return (
    <div className="App">
      <input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type='text'
      ></input>
      <button
        onClick={handleSubmit}
      >Submit</button>

    </div>
  );
}

export default App;
