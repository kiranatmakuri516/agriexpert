const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
mongoose.connect("mongodb://localhost:27017/hackathon");

const user_schema = new mongoose.Schema({
    name: String,
    phone: String,
    mail: String,
    lang: String,
    pass: String
});

const expert_schema = new mongoose.Schema({
    name: String,
    phone: String,
    mail: String,
    lang: String,
    pass: String
});

const User = mongoose.model('User', user_schema);
const Expert = mongoose.model('Expert', expert_schema);

const app = express();
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function(req, res) {
    res.render("land");
})
app.get("/login", function(req, res) {
    res.render("login");
});


app.post("/loginuser", function(req, res) {
    const a = req.body.mail;
    const b = req.body.pass;
    console.log(req.body);

    User.findOne({ mail: a, pass: b }, function(err, data) {
        if (err) console.log("Error came");
        else if (data) {
            console.log("loginuser");
            localStorage.setItem("user", data);
            res.redirect("/dashboard");
        } else res.redirect("/login");
    });
});

app.post("/login", function(req, res) {
    const a = req.body.mail;
    const b = req.body.pass;
    console.log(req.body);
    RegisterModule.findOne({ mail: a, password: b }, function(err, data) {
        if (err) console.log("Error came");
        else if (data) {
            localStorage.setItem("user", data);
            res.redirect("/");
        } else res.redirect("/login");
    });

});

app.post("/loginexpert", function(req, res) {
    const a = req.body.mail;
    const b = req.body.pass;
    console.log(req.body);

    Expert.findOne({ mail: a, pass: b }, function(err, data) {
        if (err) console.log("Error came");
        else if (data) {
            console.log("loginexpert");
            localStorage.setItem("expert", data);
            res.redirect("dashboard");
        } else res.redirect("login");
    });

});

app.get("/en", function(req, res) {
    a = "en";
    localStorage.setItem("lang", a);
    res.redirect("/login");
});
app.get("/te", function(req, res) {
    a = "te";
    localStorage.setItem("lang", a);
    res.redirect("/login");
});
app.get("/hi", function(req, res) {
    a = "hi";
    localStorage.setItem("lang", a);
    res.redirect("/login");
});


app.get("/logout", function(req, res) {
    localStorage.clear();
    res.redirect("/login");
});
app.get("/signup", function(req, res) {
    res.render("signup");
});

app.post("/signupuser", function(req, res) {
    var a = req.body.name;
    var b = req.body.mail;
    var c = req.body.phone;
    var d = req.body.pass;
    var e = "te";
    var data = new User({
        name: a,
        mail: b,
        phone: c,
        pass: d,
        lang: e
    });
    data.save();
    res.redirect("/login");
});

app.post("/signupexpert", function(req, res) {
    var a = req.body.name;
    var b = req.body.mail;
    var c = req.body.phone;
    var d = req.body.pass;
    var e = "es";
    var data = new Expert({
        name: a,
        mail: b,
        phone: c,
        pass: d,
        lang: e
    });
    data.save();
    res.redirect("/login");
});

app.get("/dashboard", function(req, res) {
    res.render("dashboard", { ans: "a" });
});

app.get("/weather", function(req, res) {
    res.render("weather", { data: "hi" });
});
app.post("/weather", function(req, res) {
    const apiKey = "ec9b79c4c63c06534a519841060b102c";
    const city = req.body.city;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey;
    https.get(url, (response) => {
        response.on("data", (data) => {
            data = JSON.parse(data);
            console.log(data);
            res.render("weather", { data: data });
        })
    })
});


app.post("/chatgpt", function(req, res) {

    var que = req.body.text;

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const chapGPT = async(prompt) => {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        var ans = response["data"]["choices"][0]["message"]["content"];

        res.render("dashboard", { ans: ans });
        // console.log(response["data"]["choices"][0]["message"]["content"]);

    };

    chapGPT(que)


});


app.get("/interact", function(req, res) {
    res.render("interact");
});


app.get("/languages", function(req, res) {

    res.render("languages")
});



app.get("/call", function(req, res) {
    var a = localStorage.getItem("lang");
    Expert.find({ lang: a }, function(err, data) {
        if (err) console.log("Error came");
        else res.render("call", { data: data });
    });
});

app.post("/call", function(req, res) {
    var a = req.body.lang;
    Expert.find({ lang: a }, function(err, data) {
        if (err) console.log("Error came");
        else res.render("call", { data: data });
    });
})

app.listen(5000, function() {
    console.log("server started at 5000 port");
});