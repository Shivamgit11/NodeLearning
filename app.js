const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
      let messages = data ? data.split("\n") : ["No messages yet."];

      res.write("<html>");
      res.write("<head><title>Enter Message</title></head>");
      res.write("<body>");
      res.write(`<form action="/message" method="POST">
                  <input type="text" name="message" />
                  <button type="submit">Send</button>
                </form>`);
      res.write("<h2>Previous Messages:</h2><ul>");
      messages.forEach((msg) => {
        if (msg.trim()) res.write(`<li>${msg}</li>`);
      });
      res.write("</ul>");
      res.write("</body>");
      res.write("</html>");
      return res.end();
    });
  } 
  
  else if (url === "/message" && method === "POST") {
    const body = [];
    
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      fs.appendFile("message.txt", message + "\n", (err) => {
        if (err) {
          console.log(err);
        }
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } 
  
  else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write("<body><h1>Hello From My Node.js Server</h1></body>");
    res.write("</html>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
