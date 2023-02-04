import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());



// function to filter image
  app.get("/filteredimage", async (req, res) => {
    const { image_url }: { image_url?: string } = req.query;
    if (!image_url) {
    return res.status(400).send("Error: The image URL is required");
    }
    
    else {
   filterImageFromURL(image_url).then(imagePath => {
    return res.status(200).sendFile(imagePath, error =>{
      if (!error) { let filesList: string[] = [imagePath];
        deleteLocalFiles(filesList);
      }
    });

   }).catch(() => {
    return res.status(422).send("Error: Processing the image failed")
   })

  }
  });



    
    
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();