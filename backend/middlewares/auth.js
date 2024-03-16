import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(req.headers)

  if (!token) { 
    return res.status(401).json({ message: 'You are not authorised' });
  }

  try {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) { 
        return res.status(403).json({ message: 'Token is invalid, maybe it has expired.' });
      }
      
      req.user = decoded.user;
      next();
    });
  } catch (error) {
    console.error("JWT Verification Error: ", error);
    res.status(500).json({ message: "Error with server" });
  }
}