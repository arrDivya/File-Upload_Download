var express	=	require("express");
var multer	=	require('multer');
var app	=	express();
const testFolder = './uploads';
const fs = require('fs');

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
   	callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.get('/imgDownload',function(req,res){
	 var id = req.query.fileName;	
	 console.log("File Name ::"+id);
     fs.readFile(testFolder +"/"+ id, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such file");    
            } else {
                //specify Content will be an attachment
                res.setHeader('Content-disposition', 'attachment; filename='+id);
                res.end(content);
            }
        });
});

app.get('/downloads',function(req,res){

	res.writeHead(200, { 'Content-Type': 'text/html' });

    var html = '<!DOCTYPE html><html><head><title>My Title</title></head><body>';
    html += '<ul>';
	fs.readdir(testFolder, (err, files) => {
		files.forEach(file => {
			html += '<li><a href="/imgDownload?fileName=' + file + '">' +file + '</a></li>';			
		});
		html += '</ul>';
		html += '</body></html>';
		res.end(html, 'utf-8');
	})
    
});

app.post('/api/photo',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
