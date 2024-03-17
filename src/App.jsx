import { useState, useEffect } from 'react'
import MenuItemlist from './menuItem'
import './App.css'

function App() {
  const [menu, setMenu] = useState([])
  const [orderItems, setOrderItems] = useState({})
  const [totalBill, setTotalBill] = useState(0)

  useEffect(() => {
    // Fetch menu items from backend when component mounts
    fetchMenu()
  }, [])

  const fetchMenu = () => {
    fetch('http://localhost:5000/menu_items') // Adjust the URL as per your backend setup
      .then(response => response.json())
      .then(data => {
        setMenu(data.menu)
      })
      .catch(error => console.error('Error fetching menu:', error))
  }

  const handleOrder = () => {
    fetch('http://localhost:5000/add_order', { // Adjust the URL as per your backend setup
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_items: orderItems })
    })
      .then(response => response.json())
      .then(data => {
        setTotalBill(data.total_bill)
        setOrderItems({})
      })
      .catch(error => console.error('Error adding order:', error))
  }

  const addToOrder = (itemId) => {
    setOrderItems(prevOrderItems => {
      const updatedOrderItems = { ...prevOrderItems }
      updatedOrderItems[itemId] = (updatedOrderItems[itemId] || 0) + 1
      return updatedOrderItems
    })
  }

  const removeFromOrder = (itemId) => {
    setOrderItems(prevOrderItems => {
      const updatedOrderItems = { ...prevOrderItems }
      if (updatedOrderItems[itemId] && updatedOrderItems[itemId] > 0) {
        updatedOrderItems[itemId] -= 1
        if (updatedOrderItems[itemId] === 0) {
          delete updatedOrderItems[itemId]
        }
      }
      return updatedOrderItems
    })
  }

  return (
    <div className="App">
      <h1>Menu</h1>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => addToOrder(item.id)}>Add</button>
            <button onClick={() => removeFromOrder(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleOrder}>Place Order</button>
      {totalBill > 0 && <p>Total Bill: ${totalBill}</p>}
      <MenuItemlist menuItems={menu}/> {/* Render MenuItemlist component here */}
    </div>
  )
}

export default App
