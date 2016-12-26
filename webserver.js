'use strict'
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpeg',
    '.png' : 'image/png'
}

function webserver(req, res) {
    
    //Compute the route
    //-----------------
    let baseURI = url.parse(req.url);
    let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);

    //Check if file exist
    //-------------------
    fs.access(filepath, fs.F_OK | fs.R_OK, error => {
        if(!error) {
            fs.readFile(filepath, (err, data) => {
                if(!err){
                    let contentType = mimes[path.extname(filepath)];
                    res.writeHead(200, {'content-type' : contentType});
                    res.end(data, 'utf-8');
                }else{
                    console.log('Couldn t read file', error);
                    res.writeHead(500);
                    res.end('Could read the file !');                   
                }
            });
        }else{
            console.log('Couldn t found : ', error);
            res.writeHead(404);
            res.end('Content not found ! ');
        }
    });

}

http.createServer(webserver).listen(3000, () => console.log('Server started !'));
