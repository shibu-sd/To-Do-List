const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser : true}, function(err){
    if (err) console.log(err);
    else console.log("Successfully connected to MongoDB");
});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name : "Eat Food"
});

const item2 = new Item({
    name : "Hit up gym"
});

const item3 = new Item({
    name : "Leetcode"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res){
    
    var today = new Date();
    
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };
    
    var day = today.toLocaleDateString("en-US", options);

    Item.find({}, function(err, foundItems){

        if (foundItems.length === 0)
        {
            Item.insertMany(defaultItems, function(err){
                if (err) console.log(err);
                else console.log("Sucessfully saved");
            })

            res.redirect("/");
        }
        else
        {
            res.render("list", {kindOfDay : day, newListItems : foundItems});
        }
    })

});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    
    const item = new Item({
        name : itemName
    });

    item.save();

    res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) console.log("Successfully deleted item");
        res.redirect("/");
    })
});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});