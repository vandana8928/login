const bodyParser = require("body-parser");
const express = require("express");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, './public/css')));
app.use(express.static(path.join(__dirname, './public/image')));
const port = 5674
// To set the package to get view files 
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
//require("./database/db")

mongoose.connect("mongodb://localhost:27017/logDB");
//require("./database/db")
const dataSchema = {
    name: {
        type: String,

    },
    lname: {
        type: String,

    },
    email: {
        type: String,

    },
    pass: {

        type: Number,

    },
    cpass: {
        type: Number,

    },
    gender: {
        type: String,

    },
    mobile: {
        type: Number,

    },
    date: {
        type: String,
    },
    select: {
        type: String,
    },
}
const Data = mongoose.model("Data", dataSchema);

module.exports = Data;

const itemSchema = {
    name:
    {
        type: String,
    },

}
const Item = mongoose.model("Item", itemSchema);

app.get('/item', (req, res) => {

    res.render("item")
})


app.post('/list', async (req, res) => {


    const itemdata = new Item({
        name: req.body.name,
    })
    const items = await itemdata.save();
    console.log(items)
    res.render("item")



})


app.get('/register', (req, res) => {

    res.render("register")

})
app.get('/index', (req, res) => {

    res.render("index")

})

app.post("/resg", async (req, res) => {
    // res.send("hi vandu")
    console.log("hello i am here")
    try {

        const pass = req.body.pass;
        const cpass = req.body.cpass;
        console.log("hello i am here")

        if (pass == cpass) {
            const loginData = new Data({
                name: req.body.name,
                lname: req.body.lname,
                email: req.body.email,
                pass: req.body.pass,
                cpass: req.body.cpass,
                mobile: req.body.mobile,
                gender: req.body.gender,
                date: req.body.date,
                select: req.body.select,



            })
            const dated = await loginData.save();
            console.log(dated)
            res.render("datasave")

        }
        else {
            res.render("fail")
        }


    }
    catch (error) {
        res.status(400).send(error)
    }
});




app.get('/login', (req, res) => {
    res.render("login")
})
//login check
app.post('/log', async (req, res) => {


    try {

        const email = req.body.email;
        const pass = req.body.pass;


        const useremail = await Data.findOne({ email: email })
        console.log(useremail)

        if (useremail.pass == pass) {
            res.render("logindata", { data: useremail });

        }
        else {
            res.send("invalid login detail");
        }

        //res.render("home",{data:useremail}) )

    }
    catch (error) {
        res.status(400).send("invalid login detail trr")
    }
})
//FETCH DATABASE ALL DATAS
//update function 


app.get('/viewlist', (req, res) => {
    Data.find({}, function (err, datas) {
        res.render("viewlist", { data: datas });
    })
})
//DELETE ID//

app.get('/:id', (req, res) => {
    Data.findById(req.params.id, (err, datas) => {
        if (!err) {
            res.render("register", {
                data: datas
            });
        }
    });
});
//DELETE DATA
app.get('/delete/:id', async (req, res) => {
    Data.findByIdAndRemove(req.params.id, function (err, datas) {

        if (!err) {
            Data.find({}, function (err, datas) {
                res.render("viewlist", { data: datas })

            })
        }

        else { console.log('Error in employee delete :' + err); }


    })
})


app.listen(port, () => {
    console.log("server is running on port :" + port)
})
