const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config()


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());



//  
console.log(process.env.DB_NAME);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9ncf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error', err)
  const blogCollection = client.db("blogsContain").collection("blogs");
  console.log("database successfully done")

  app.post('/addBlogs', (req, res) => {
    const newProduct = req.body;
    blogCollection.insertOne(newProduct)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

app.get('/getBlogs', (req, res) => {
  blogCollection.find()
  .toArray((err, blogs) => {
    res.send(blogs)
  });
})


app.get('/getCertainBlog/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  // console.log(id);
  blogCollection.find({_id: id})
  .toArray((err, blog) => {
    console.log(blog[0]);
    res.send(blog[0])
  })
  })


  app.delete('/deleteBlog/:id', (req, res) =>{

    const id = ObjectID(req.params.id);
    console.log('delete text', id);
    blogCollection.deleteOne({_id: id})
    .then((err, documents) => res.send({
      success: true
    }))
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!, This is server side application')
})

app.listen(process.env.PORT || 7000, () => {
  console.log("http://localhost:7000")
})