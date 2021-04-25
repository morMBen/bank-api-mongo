import './App.css';
import api from './api/api';
import React, { useEffect, useState } from 'react';

function App() {
  const [inputvalue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [text1, setText1] = useState('Account number')
  const [text2, setText2] = useState('Amount')
  const [text3, setText3] = useState(null)
  const [selector, setSelector] = useState('deposit money');


  const handleSubmit = async () => {
    try {
      switch (selector) {
        case ('deposit money'):
          const op1 = await api.patch(`accounts/deposit/${inputvalue1}`, { deposit: inputValue2 })
          console.log(op1.data)
          break;
        case ('Withraw money'):
          const op2 = await api.patch(`accounts/withraw/${inputvalue1}`, { amount: inputValue2 })
          console.log(op2.data)
          break;
        case ('Update credit'):
          const op3 = await api.patch(`accounts/credit/${inputvalue1}`, { credit: inputValue2 })
          console.log(op3.data)
          break;
        case ('Add client'):
          const op4 = await api.post('clients', { _id: inputvalue1, name: inputValue2 })
          console.log(op4.data)
          break;
        case ('Add account'):
          const op5 = await api.post(`accounts/${inputvalue1}`, { cash: inputValue2, credit: inputValue3 })
          console.log(op5.data)
          break;
        case ('Transfer money'):
          const op6 = await api.patch(`transfer`, { from: inputvalue1, to: inputValue2, amount: inputValue3 })
          console.log(op6.data)
          break;
        default: console.log('')
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAll = async (collection) => {
    const data = await api.get(collection)
    console.log(data.data);
  }

  const handleSelectors = (e) => {
    setSelector(e.target.value)
    if (e.target.value === 'Add client') {
      setText1('Client id')
      setText2('Name')
      setText3(null)
    }
    else if (e.target.value === 'Add account') {
      setText1('Client id')
      setText2('Cash')
      setText3('credit')
    }
    else if (e.target.value === 'Transfer money') {
      setText1('From account number')
      setText2('To account number')
      setText3('Amount')
    }
    else {
      setText1('Account number')
      setText2('Amount')
      setText3(null)
    }
  }
  return (
    <div className="App">
      <h1>Bank Api</h1>
      <div>
        <h3>The results at the inspect</h3>
        <div>
          {text1}
          <input
            onChange={(e) => setInputValue1(e.target.value)}
            value={inputvalue1}
            type='text'
          ></input>
        </div>
        <div>
          {text2}
          <input
            onChange={(e) => setInputValue2(e.target.value)}
            value={inputValue2}
            type='text'
          ></input>
        </div>
        {text3 && <div>
          {text3}
          <input
            onChange={(e) => setInputValue3(e.target.value)}
            value={inputValue3}
            type='text'
          ></input>
        </div>}
        <select
          value={selector}
          onChange={handleSelectors}
        >
          <option>deposit money</option>
          <option>Withraw money</option>
          <option>Update credit</option>
          <option>Add client</option>
          <option>Add account</option>
          <option>Transfer money</option>
        </select>
        <button
          onClick={handleSubmit}
        >Submit</button>
      </div>
      <br />
      <button onClick={() => fetchAll('clients')}>Fetch all clients</button>
      <button onClick={() => fetchAll('transactions')}>Fetch all transactions</button>
      <button onClick={() => fetchAll('accounts')}>Fetch all accounts </button>
    </div >
  );
}

export default App;
