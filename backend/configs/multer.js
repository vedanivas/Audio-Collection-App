import multer from 'multer'

// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp'); // ensure this directory exists
  },
  filename: (req, file, cb) => {
    const id = file.originalname.slice(0, 36)
    const fileName = file.originalname.slice(37) 
    const name = fileName.split('.')
    cb(null, `${name[0]}/${id}.${name[1]}`)
  },
});

const upload = multer({ storage: storage });

export default upload;
