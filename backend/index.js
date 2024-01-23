const express = require('express');
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const mysql = require('mysql')
const app=express();
app.use(express.json());
const PORT= 4000;
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
 
const con=mysql.createConnection({
    user:'root',
    password:'',
    host: 'localhost',
    port:'3306',
    database: 'amazon'
})

con.connect((error)=>{
    if (error){
        console.log("Connection error");
    } else {
        console.log("Connection successfull..");
    }
})


const storage = multer.diskStorage({
    destination:function (req, file, cb) {
        cb(null, './Public/Images')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix)
    }
})

const upload = multer({storage: storage})

app.post('/categorypost',(req,res)=>{
    const data=req.body
    const sql='insert into category set ?'
    con.query(sql,data,(err,result)=>{
        if(err){
            console.log("data not posted");
            res.json(err)
        }else{
            console.log("data posted successfully");
            res.json(result)
        }
    })
})

app.get('/categoryget',(req,res)=>{
    const sql= 'select * from  category'
    con.query(sql,(err,result)=>{
        if (err){
            console.log("data not get");
            res.json(err)
        }else {
            console.log("data get successfull");
            res.json(result)
        }
    })
})



app.put('/categoryupdate/:cId',(req,res)=>{
 const data=req.body
 const cId=req.params.cId
 const sql='update category set ? where cId=?'
 con.query(sql,[data,cId],(err,result)=>{
    if (err){
        console.log("data not updated");
        res.json(err)
    }else {
        console.log("data updated");
        res.json(result);
    }
 })
})

app.delete('/categorydelete/:cId',(req,res)=>{
    const cId=req.params.cId
    const sql='delete from category where cId=?'
    con.query(sql,cId,(err,result)=>{
        if (err){
            console.log("data not deleted");
            res.json(err)
        }else{
            console.log("data delete successfully");
            res.json(result)
        }
    })
})


app.post('/productpost',upload.single('photo'),(req,res)=>{
    var fullUrl = req.protocol + "://" + req.get("host") +'/Public/Images/'
    const data={
        cId:req.body.cId,
        pName:req.body.pName,
        pPrice:req.body.pPrice,
        pImage:fullUrl+req.file.filename
    }
    const sql='insert into product set ?'
    con.query(sql,data,(err,result)=>{
        if(err){
            console.log("data not posted");
            res.json(err)
        }else{
            console.log("data posted successfully");
            res.json(result)
        }
    })
})


app.get('/productget',(req,res)=>{
    const sql= 'select * from  product'
    con.query(sql,(err,result)=>{
        if (err){
            console.log("data not get");
            res.json(err)
        }else {
            console.log("data get successfull");
            res.json(result)
        }
    })
})

app.get('/productSearch/cId', (req, res)=>{
    cId = req.query.cId;
    const sql = `SELECT * FROM product WHERE cId = ?`
    con.query(sql, [cId], (err, result)=>{
        if(err){
            console.log({err:"Data Not Search"});
            res.json(err)
        }else{
            console.log({result:"Data Search SuccessFully...."});
            res.json(result)
        }
    })
})

app.put('/productupdate/:cId',(req,res)=>{
    const data=req.body
    const cId=req.params.cId
    const sql='update product set ? where cId=?'
    con.query(sql,[data,cId],(err,result)=>{
       if (err){
           console.log("data not updated");
           res.json(err)
       }else {
           console.log("data updated");
           res.json(result);
       }
    })
   })

   app.delete('/productdelete/:cId',(req,res)=>{
    const cId=req.params.cId
    const sql='delete from product where cId=?'
    con.query(sql,cId,(err,result)=>{
        if (err){
            console.log("data not deleted");
            res.json(err)
        }else{
            console.log("data delete successfully");
            res.json(result)
        }
    })
})



app.listen(PORT , ()=>{
    console.log(`serving is running on ${PORT}`);
})