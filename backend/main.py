from flask import request,jsonify
from config import app, db
from model import Contact


@app.route("/contacts",methods=["GET"])
def get_contacts():
    contacts=Contact.query.all()
    json_contacts=list(map(lambda x:x.to_json(),contacts))
    return {"contacts":json_contacts}

@app.route("/add",methods=["POST"])
def add_contact():
    first_name=request.json.get("firstName")
    last_name=request.json.get("lastName")
    email=request.json.get("email")

    if not first_name or not last_name or not email:
        return {"error":"something is invalid"}
    
    new_contact=Contact(first_name=first_name,last_name=last_name,email=email)

    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return {"message":str(e)}
    
    return {"message":"sucess created"}

@app.route("/update/<int:id>", methods=["PATCH"])
def update_contact(id):
    contact=Contact.query.get(id)
    if not contact:
        return {"message":"user not found"}
    
    data=request.json

    contact.first_name=data.get("firstName",contact.first_name)
    contact.last_name=data.get("lastName",contact.last_name)
    contact.email=data.get("email",contact.email)

    db.session.commit()

    return {"message":"sucess updated"}
    
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_contact(id):
    contact=Contact.query.get(id)
    if not contact:
        return {"message":"user not found"}
    
    db.session.delete(contact)

    db.session.commit()

    return {"message":"sucess deleted"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)

