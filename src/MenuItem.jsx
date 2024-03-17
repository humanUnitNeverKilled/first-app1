import React from "react";

const MenuItemList = ({ menuItems, deleteMenuItem, updateCallback }) => {
    return (
        <div>
            <h2>Menu Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>
                                <button onClick={() => deleteMenuItem(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuItemList;
