from flask import Flask, request
from hikes import HikeDB

app = Flask(__name__)
db=HikeDB("hikes_db.db")
print("db", db)

@app.route("/hikes/<int:hike_id>", methods=["OPTIONS"])
def handle_cors_options(hike_id):
    return "", 204, {
        "Access-Control-Allow-Origin": "*", #when we get into authentication we won't be able to use the star
        "Access-Control-Allow-Methods": "PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

@app.route("/hikes", methods=["GET"])
def retrieve_reviews():
    # Allow CORS
    db=HikeDB("hikes_db.db")
    print("db", db)
    reviews = db.getHikes()
    return reviews, {"Access-Control-Allow-Origin" : "*"}

@app.route("/hikes", methods=["POST"])
def create_review():
    print("The request data is: ", request.form)
    name = request.form["name"]
    location = request.form["location"]
    miles = request.form["miles"]
    rating = request.form["rating"]
    review = request.form["review"]
    picture = request.form["picture"]
    db = HikeDB("hikes_db.db")
    db.createHike(name, location, miles, rating, review, picture)
    return "Created", 201, {"Access-Control-Allow-Origin" : "*"}

@app.route("/hikes/<int:hike_id>", methods=["PUT"])
def update_hike(hike_id):
    print("update hike with ID", hike_id)
    db = HikeDB("hikes_db.db")
    hike = db.getHike(hike_id)
    if hike:
        name = request.form["name"]
        location = request.form["location"]
        miles = request.form["miles"]
        rating = request.form["rating"]
        review = request.form["review"]
        picture = request.form["picture"]
        db.updateHike(hike_id, name, location, miles, rating, review, picture)
        return "Updated", 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"Hike with {hike_id} not found", 404, {"Access-Control-Allow-Origin" : "*"}

@app.route("/hikes/<int:hike_id>", methods=["DELETE"])
def delete_hike(hike_id):
    print("deleting hike with ID", hike_id)
    db = HikeDB("hikes_db.db")
    hike = db.getHike(hike_id)
    if hike:
        db.deleteHike(hike_id)
        return "Deleted", 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"Hike with {hike_id} not found", 404, {"Access-Control-Allow-Origin" : "*"}

@app.route("/hikes/<int:hike_id>", methods=["GET"])
def retreive_hike(hike_id):
    db = HikeDB("hikes_db.db")
    hike = db.getHike(hike_id)
    if hike:
        return hike, 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"Hike with id {hike_id} not found", 404, {"Access-Control-Allow-Origin" : "*"}

def run():
    app.run(port=8080, host='0.0.0.0')
if __name__ == "__main__":
    run()