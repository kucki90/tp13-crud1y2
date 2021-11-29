const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const precioFinal = (descuento, precio) => {
  return (descuento * precio) / 100;
};
const guardar = (products) => {
  fs.writeFileSync(productsFilePath,
    JSON.stringify(products, null, 2),
    "utf-8");
}; //escribo el json
const controller = {
  // Root - Show all products
  index: (req, res) => {
    return res.render("products", {
      products, //json
      toThousand,
      precioFinal, //precio con descuento
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let detalle = products.find((detalle) => detalle.id === +req.params.id);
    return res.render("detail", {
      products, //json
      toThousand,
      precioFinal, //precio con descuento
      detalle, //producto filtrado por id
    });
  },

  // Create - Form to create
  create: (req, res) => {
    return res.render("product-create-form", {
      products, //json
    });
  },

  // Create -  Method to store
  store: (req, res) => {
    const { name, price, discount, category, description } = req.body;
    let product = {
      id: products[products.length - 1].id + 1, //al largo del array le resto 1, pasa sacar el id y despues le sumo
      name,
      description,
      price: +price,
      discount:+discount,//porque lo que recibo es string
      image: "default-image.png",
      category,
    }; //con las propiedades a guardar
    products.push(product);
    guardar(products);
    res.redirect("/products");
  },

  // Update - Form to edit
  edit: (req, res) => {
    let producto = products.find((producto) => producto.id === +req.params.id);
    res.render("product-edit-form", {
      producto,
    });
  },

  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, category, description } = req.body;

    products.forEach(product => {
      if (product.id === +req.params.id) {
        product.id=+req.params.id;
        product.name = name;
        product.price = +price;
        product.discount = +discount;
        product.category = category;
        product.description = description;
      }
    });
guardar(products);

return res.redirect("/products");
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
  products.forEach(product=>{
    if(product.id===+req.params.id){
      let eliminar=products.indexOf(product);
      products.splice(eliminar,1);
    }
  });
  guardar(products);
  return res.redirect('/products')
  },
};

module.exports = controller;