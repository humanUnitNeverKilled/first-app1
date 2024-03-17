# main.py
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

# Assuming you have a 'config.py' file that contains the 'db' object
from config import db

Base = declarative_base()

class MenuItem(Base):
    __tablename__ = 'menu_items'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)

class OrderItem(Base):
    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True)
    menu_item_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    order_id = Column(Integer, nullable=False)

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)

# Function to add a new menu item
def add_menu_item(session, name, price):
    new_item = MenuItem(name=name, price=price)
    session.add(new_item)
    session.commit()
    print("Menu item added successfully!")

# Function to display menu
def display_menu(session):
    items = session.query(MenuItem).all()
    if items:
        print("Menu:")
        for item in items:
            print(f"{item.id}. {item.name}: ${item.price}")
    else:
        print("Menu is empty.")

# Function to add an order
def add_order(session, order_items):
    new_order = Order()
    session.add(new_order)
    session.commit()

    total_bill = 0
    for item_id, quantity in order_items.items():
        menu_item = session.query(MenuItem).get(item_id)
        if menu_item:
            order_item = OrderItem(menu_item_id=item_id, quantity=quantity, order_id=new_order.id)
            session.add(order_item)
            total_bill += menu_item.price * quantity

    session.commit()
    print(f"Order added successfully! Total bill: ${total_bill:.2f}")

# Example usage
if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=db)

    # Create a session
    Session = sessionmaker(bind=db)
    session = Session()

    # Add menu items
    add_menu_item(session, "Coffee", 2.5)
    add_menu_item(session, "Tea", 2.0)
    add_menu_item(session, "Sandwich", 5.0)

    # Display menu
    display_menu(session)

    # Add an order
    order_items = {1: 2, 3: 1}  # Coffee x2, Sandwich x1
    add_order(session, order_items)

    # Close the session
    session.close()
