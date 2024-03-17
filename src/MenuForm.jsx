import { useState } from "react";

const MenuForm = ({ existingMenuItem = {}, updateCallback }) => {
    const [name, setName] = useState(existingMenuItem.name || "");
    const [price, setPrice] = useState(existingMenuItem.price || "");

    const updating = Object.entries(existingMenuItem).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name,
            price
        };
        const url = "http://localhost:5000/" + (updating ? `update_menu_item/${existingMenuItem.id}` : "create_menu_item"); // Adjust the URL as per your backend setup
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default MenuForm;
