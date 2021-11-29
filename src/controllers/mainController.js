const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const precioFinal = (descuento, precio) => {
  return (precio / 100) * descuento;
};

const controller = {
/*filtro el Json para separar los productos en dos secciones*/
index: (req, res) => {
    res.render("index", {
    visitado: products.filter((producto) => producto.category === "visited"),
    oferta: products.filter((producto) => producto.category === "in-sale"),
	products,//json
    toThousand,
    precioFinal//precio con descuento
    })
},
search: (req, res) => {
    let resultado = products.filter(producto => producto.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim()))
    return  res.render('results',{
        products,
        resultado,
        busqueda: req.query.keywords
    })
},
};

module.exports = controller;