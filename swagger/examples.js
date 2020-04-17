const path = require("path");
const { Router } = require("express");
const api = require("..");


const router = Router();

router.get("/search.xml", (req, res) => {
    console.log("HI");
    res.sendFile(getSrc("base", "examples", "search.xml"));
});

function getSrc(...paths) {
  return path.resolve(__dirname, "..", "src", ...arguments);
}

module.exports = router;