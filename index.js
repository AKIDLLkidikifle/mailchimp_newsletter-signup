const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended : true}));


app.get("/", function(req, res){
    res.sendFile(__dirname+ "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const secondName = req.body.sname;
    const email = req.body.email;


    
    const data ={
        members: [
          {
           email_address: email,
           status: "subscribed",
           merge_fields: {
             FNAME: firstName,
             LNAME: secondName,
           }
          }
        ]
    }

    // dc server prefix 
    // to find you api key go to your profile-->account&billing-->extras-->apikey
    // to find you audience id go to your account-->audience-->allcontacts-->settings-->audience name and defaults
    
    const jsonData = JSON.stringify(data);
    const url = "https://<dc>.api.mailchimp.com/3.0/lists/<your audience id>";

    const options={
        method: "POST",
        auth: "name:<your api key>"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/sucess.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", function(data){
            console.log(response);
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure.html", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port number  3000");
})

