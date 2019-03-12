const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');



let app = express();
let port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

app.get('/home',(req,res)=>{
    res.render('home',{active_home:true});
});
app.get('/about',(req,res)=>{
    res.render('about',{active_about:true});
});
app.get('/findSurgeon',(req,res)=>{
    res.render('surgeon',{active_surg:true});
});
app.get('/meetings',(req,res)=>{
    res.render('meeting',{active_meet:true});
});
app.get('/rhinoplasty',(req,res)=>{
    res.render('rhinoplasty',{active_rhin:true});
});
app.get('/links',(req,res)=>{
    res.render('links',{active_link:true});
});
app.get('/officalJournal',(req,res)=>{
    res.render('journal',{active_offical:true});
});
app.get('/register',(req,res)=>{
    res.render('register',{active_sign:true});
});


app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});