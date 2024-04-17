import multer from 'multer'

// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp'); // ensure this directory exists
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(/[.-]/);
    cb(null, `${name[1]}/${name[0]}.${name[2]}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
