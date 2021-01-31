var express=require("express");
var app=express()
var bodyParser=require("body-parser");
var request=require("request");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public/'));
//app starts here

app.get("/",function(req,res){
    res.render("login");
})
app.get("/home",function(req,res){
    res.render("Home");
})
app.get("/search",function(req,res){
    res.render("search");
})
app.get("/analysis",function(req,res){
     
     var fat=0;
     var carb=0;
     var prot=0;
     var vit=0;
     var min=0;
     data["hits"].forEach(function(dish){ 
                var name = dish["recipe"]["label"] ;
                var cal= dish["recipe"]["calories"];
                var fa=dish["recipe"]["totalNutrients"]["FAT"]["quantity"];
                var car=dish["recipe"]["totalNutrients"]["CHOCDF"]["quantity"];
                var pro=dish["recipe"]["totalNutrients"]["PROCNT"]["quantity"];
                var vA=dish["recipe"]["totalNutrients"]["VITA_RAE"]["quantity"];
                var vC=dish["recipe"]["totalNutrients"]["VITC"]["quantity"];
                var calc=dish["recipe"]["totalNutrients"]["CA"]["quantity"];
                var pot=dish["recipe"]["totalNutrients"]["K"]["quantity"];
                var mg=dish["recipe"]["totalNutrients"]["MG"]["quantity"];
                
                var object ={title:name,calories:cal,fat:fa,carb:car,protein:pro,vitA:vA,vitC:vC,cal:calc,pott:pot,mag:mg}
                
                fat=fat+fa;carb=carb+car;prot=prot+pro;vit=vit+vA+vC;min=min+calc+pot+mg;

     })
     var obj={fat:fat,carb:carb,prot:prot,vit:vit,min:min}
     fat=fat*1000;prot=prot*1000;carb=carb*1000;
     res.render("analysis",{fat:fat,carb:carb,prot:prot,vit:vit,min:min});
})

app.get("/results",function(req,res){
    var from = Math.floor((Math.random() * 40) + 1);
    var to= from + 3;
    var like= req.query.like;
    var cal=req.query.cal;
    var calmax= parseInt(cal)+100;
    console.log(calmax);
    var calmin=parseInt(cal)-100;
    console.log(calmin); 
    var health=req.query.health;
    console.log(health);
    var diet=req.query.diet;
    console.log(diet);
    if(health == undefined){health=""};
    if(diet==undefined){diet=""};
    var strh="&health="+health;
    var strd="&diet="+diet;
    if(health !== undefined && Array.isArray(health))
    {
        var strh=""
        health.forEach(function(condn){
            strh=strh+"&health="+condn;
        })
    }
    if(diet !== undefined && Array.isArray(diet))
    {
        var strd=""
        diet.forEach(function(condn){
            strd=strd+"&diet="+condn;
        })
    }
    if(Array.isArray(health) || Array.isArray(diet) || strh == "&health="+health || strd == "&diet="+diet){
        var url="https://api.edamam.com/search?q="+ like +"&app_id=1e6b8c9c&app_key=bdcb524fe79e816d582ee57eb5b7867d&from="+from+"&to="+to+"&calories="+cal+strh+strd;
        if(strh == "&health=" && strd !== "&diet="){var url="https://api.edamam.com/search?q="+ like +"&app_id=1e6b8c9c&app_key=bdcb524fe79e816d582ee57eb5b7867d&from="+from+"&to="+to+"&calories="+cal+strd; }
        if(strd == "&diet=" && strh !== "&health="){var url="https://api.edamam.com/search?q="+ like +"&app_id=1e6b8c9c&app_key=bdcb524fe79e816d582ee57eb5b7867d&from="+from+"&to="+to+"&calories="+cal+strh;}
        if(strd == "&diet=" && strh == "&health="){var url="https://api.edamam.com/search?q="+ like +"&app_id=1e6b8c9c&app_key=bdcb524fe79e816d582ee57eb5b7867d&from="+from+"&to="+to+"&calories="+cal;}
    }
    
    console.log(url);
    request(url,function(error,response,body){
        if(!error && response.statusCode== 200){
             data = JSON.parse(body);
            //res.send(data);
            res.render("results",{data:data});
        }
        else{
            console.log("error");
            res.send("Cannot find such combination!! try a different one :)");
        }
    })
})
app.get("/covid19",function(req,res){
    res.render("covid19");
})

app.listen(process.env.PORT , '0.0.0.0',function(){
    console.log("Diet Plan");
})