/** utility function used to convert a file (typically an uploaded file) into a Data URI format. A Data URI embeds file data directly into a URI using base64 encoding, which is useful for uploading images or files to remote services, like cloud storage or APIs. */

// Data Uri parser is a package that help to convert file or image into data uri
import DataUriParser from "datauri/parser.js";
// inbuilt node module package help to extract extension of file
import path from "path";

const getDataUri = (file) =>{
    const parser = new DataUriParser();
    // extract extension of file including . like .png
    const extName= path.extname(file.originalname).toString();
    // return data uri of file to store at cloud
    return parser.format(extName, file.buffer);
}

export default getDataUri;