from flask import Flask, request, jsonify
from config import app, db
from models import MenuItem, Order, OrderItem

@app.route("/menu_items", methods=["GET"])
def get_menu():
    menu_items = MenuItem.query.all()
    json_menu = [{"id": item.id, "name": item.name, "price": item.price} for item in menu_items]
    return jsonify({"menu": json_menu})

@app.route("/add_order", methods=["POST"])
def add_order():
    order_items = request.json.get("order_items")
    if not order_items:
        return jsonify({"message": "No order items provided"}), 400

    new_order = Order()
    db.session.add(new_order)
    db.session.commit()

    total_bill = 0
    for item_id, quantity in order_items.items():
        menu_item = MenuItem.query.get(item_id)
        if menu_item:
            order_item = OrderItem(menu_item_id=item_id, quantity=quantity, order_id=new_order.id)
            db.session.add(order_item)
            total_bill += menu_item.price * quantity

    db.session.commit()
    return jsonify({"message": "Order added successfully!", "total_bill": total_bill}), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
