export default function errorHandler(error, req, res, next) {
    console.error(error.name);
  
    if (error.name === "CastError") {
      return res.status(400).json({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: error.message });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token expired" });
    } else if (error.message === "Not Found") {
      return res.status(404).json({ error: "Resource not found" });
    } 
  
    
    next(error);
  }