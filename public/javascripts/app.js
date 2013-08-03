function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    var files = evt.originalEvent.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    console.log(files);
}

function handleDragOver(evt) {
    evt.stopPropagation();
}

// Setup the dnd listeners.
var dropZone = $('#drop_zone');
dropZone.on('dragover', handleDragOver);
dropZone.on('drop', handleFileSelect);

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
   //retrieve uploaded files data
   // var files = e.originalEvent.dataTransfer.files;
   // processFiles(files);
   return false;
});
