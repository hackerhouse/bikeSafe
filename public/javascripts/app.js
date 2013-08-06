
var bikeSafe = function(config) {
    var bikeSafe = {
        name: "saldfjasld"
    };
    
    return "sl";
};
var BikeSafe = BikeSafe || bikeSafe();


var Bike = function() {

    var bike = {
        serial: null,
        userId: null,
        photos: []
    };

    // Private Methods
    function init() {
        console.log("shit inited");
    }

    // Public Methods
    function addPhoto() {

    }

    function addSerial() {

    }

    function setId() {

    }

    function submitBike() {

    }

    return {
        addPhoto: addPhoto,
        addSerial: addSerial,
        setId: setId,
        submit: submitBike
    }
};

$(document).ready(function() {

    /*****************************
      Variables
     *****************************/
    var imgWidth = 180,
    imgHeight = 180,
    zindex = 0;
    dropZone = $('#drop_zone'),
    uploadBtn = $('#register'),

    /*****************************
      Events Handler
     *****************************/
    dropZone.on('dragover', function() {
        //add hover class when drag over
        dropZone.addClass('dragover');
        return false;
    });

    dropZone.on('dragleave', function() {
        //remove hover class when drag out
        dropZone.removeClass('dragover');
        return false;
    });

    dropZone.on('drop', function(e) {
        //prevent browser from open the file when drop off
        e.stopPropagation();
        e.preventDefault();
        dropZone.removeClass('dragover');

        // retrieve uploaded files data
        var files = e.originalEvent.dataTransfer.files;
        console.log(files);
        processFiles(files);

        return false;
    });

    // uploadBtn.on('click', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     var files = $(this)[0].files;
    //     processFiles(files);

    //     return false;
    // });

    /***************************** 
      utility funcitons 
     *****************************/  
    //Bytes to KiloBytes conversion
    function convertToKBytes(number) {
        return (number / 1024).toFixed(1);
    }

    function compareWidthHeight(width, height) {
        var diff = [];
        if(width > height) {
            diff[0] = width - height;
            diff[1] = 0;
        } else {
            diff[0] = 0;
            diff[1] = height - width;
        }
        return diff;
    }

    function dataURItoBlob(dataURI) {

        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        //Passing an ArrayBuffer to the Blob constructor appears to be deprecated, 
        //so convert ArrayBuffer to DataView
        var dataView = new DataView(ab);
        var blob = new Blob([dataView], {type: mimeString});

        return blob;
    }

    /***************************** 
      Process FileList 
     *****************************/  
    var processFiles = function(files) {
        if(files && typeof FileReader !== "undefined") {
            //process each files only if browser is supported
            console.log(files);
            for(var i=0; i<files.length; i++) {
                readFile(files[i]);
                console.log(files[i]);
            }
        } else {

        }
    }


    /***************************** 
      Read the File Object
     *****************************/  
    var readFile = function(file) {
        if( (/image/i).test(file.type) ) {
            //define FileReader object
            var reader = new FileReader();

            //init reader onload event handlers
            reader.onload = function(e) {   
                var image = $('<img/>')
                .load(function() {
                    //when image fully loaded
                    var newimageurl = getCanvasImage(this);
                    createPreview(file, newimageurl);
                    uploadToServer(file, dataURItoBlob(newimageurl));
                })
                .attr('src', e.target.result);  
            };

            //begin reader read operation
            reader.readAsDataURL(file);

            $('#err').text('');
        } else {
            //some message for wrong file format
            $('#err').text('*Selected file format not supported!');
        }
    }


    /***************************** 
      Get New Canvas Image URL
     *****************************/  
    var getCanvasImage = function(image) {
        //get selected effect
        var effect = $('input[name=effect]:checked').val();
        var croping = $('input[name=croping]:checked').val();

        //define canvas
        var canvas = document.createElement('canvas');
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        var ctx = canvas.getContext('2d');

        //default resize variable
        var diff = [0, 0];
        if(croping == 'crop') {
            //get resized width and height
            diff = compareWidthHeight(image.width, image.height);
        }

        //draw canvas image 
        ctx.drawImage(image, diff[0]/2, diff[1]/2, image.width-diff[0], image.height-diff[1], 0, 0, imgWidth, imgHeight);

        //apply effects if any                  
        if(effect == 'grayscale') {
            grayscale(ctx);
        } else if(effect == 'blurry') {
            blurry(ctx, image, diff);
        } else if(effect == 'sepia') {
            sepia(ctx);
        } else {}

        //convert canvas to jpeg url
        return canvas.toDataURL("image/jpeg");
    }


    /***************************** 
      Draw Image Preview
     *****************************/  
    var createPreview = function(file, newURL) {    
        //populate jQuery Template binding object
        var imageObj = {};
        imageObj.filePath = newURL;
        imageObj.fileName = file.name.substr(0, file.name.lastIndexOf('.')); //subtract file extension
        imageObj.fileOriSize = convertToKBytes(file.size);
        imageObj.fileUploadSize = convertToKBytes(dataURItoBlob(newURL).size); //convert new image URL to blob to get file.size

        //extend filename
        var effect = $('input[name=effect]:checked').val();         
        if(effect == 'grayscale') {
            imageObj.fileName += " (Grayscale)";
        } else if(effect == 'blurry') {
            imageObj.fileName += " (Blurry)";
        }           

        //append new image through jQuery Template
        var randvalue = Math.floor(Math.random()*31)-15;  //random number
        var src = imageObj.filePath;
        var img = $('<img class="bikePhoto">').attr('src', src).appendTo("#drop_zone")
        .hide()
        .css({
            'Transform': 'scale(1) rotate('+randvalue+'deg)',
            'msTransform': 'scale(1) rotate('+randvalue+'deg)',
            'MozTransform': 'scale(1) rotate('+randvalue+'deg)',
            'webkitTransform': 'scale(1) rotate('+randvalue+'deg)',
            'OTransform': 'scale(1) rotate('+randvalue+'deg)',
            'z-index': zindex++
        })
            .fadeIn();

            // if(isNaN(imageObj.fileUploadSize)) {
            //     $('.imageholder span').last().hide();
            // }
    }



    /****************************
      Upload Image to Server
     ****************************/
    var uploadToServer = function(oldFile, newFile) {
        // prepare FormData
        var formData = new FormData();  
        //we still have to use back old file
        //since new file doesn't contains original file data
        console.log("oldFile:");
        console.log(oldFile.name);
        formData.append('filename', oldFile.name);
        formData.append('filetype', oldFile.type);
        formData.append('file', newFile); 
        console.log(formData);

        //submit formData using $.ajax          
        $.ajax({
            url: '/bikes/photo',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log(data);
            }
        }); 
    }


    //file upload via original byte sequence
    var processFileInIE = function(file) {

        var imageObj = {};
        var extension = ['jpg', 'jpeg', 'gif', 'png'];
        var filepath = file.value;
        if (filepath) {
            //get file name
            var startIndex = (filepath.indexOf('\\') >= 0 ? filepath.lastIndexOf('\\') : filepath.lastIndexOf('/'));
            var filedetail = filepath.substring(startIndex);
            if (filedetail.indexOf('\\') === 0 || filedetail.indexOf('/') === 0) {
                filedetail = filedetail.substring(1);
            }
            var filename = filedetail.substr(0, filedetail.lastIndexOf('.'));
            var fileext = filedetail.slice(filedetail.lastIndexOf(".")+1).toLowerCase();

            //check file extension
            if($.inArray(fileext, extension) > -1) {
                //append using template
                $('#err').text('');
                imageObj.filepath = filepath;
                imageObj.filename = filename;
                var randvalue = Math.floor(Math.random()*31)-15;
                $("#imageTemplate").tmpl(imageObj).prependTo( "#result" )
                .hide()
                .css({
                    'Transform': 'scale(1) rotate('+randvalue+'deg)',
                    'msTransform': 'scale(1) rotate('+randvalue+'deg)',
                    'MozTransform': 'scale(1) rotate('+randvalue+'deg)',
                    'webkitTransform': 'scale(1) rotate('+randvalue+'deg)',
                    'oTransform': 'scale(1) rotate('+randvalue+'deg)',
                    'z-index': zindex++
                })
                    .show();
                    $('#result').find('figcaption span').hide();
            } else {
                $('#err').text('*Selected file format not supported!');
            }
        }
    }

    /****************************
      Browser compatible text
     ****************************/
    // if (typeof FileReader === "undefined") {
    //     //$('.extra').hide();
    //     $('#err').html('Hey! Your browser does not support <strong>HTML5 File API</strong> <br/>Try using Chrome or Firefox to have it works!');
    // } else if (!Modernizr.draganddrop) {
    //     $('#err').html('Ops! Look like your browser does not support <strong>Drag and Drop API</strong>! <br/>Still, you are able to use \'<em>Select Files</em>\' button to upload file =)');
    // } else {
    //     $('#err').text('');
    // }
});
