var pdf = new PDFAnnotate("pdf-container", "estimate-page.pdf", {
  onPageUpdated(page, oldData, newData) {
    console.log(page, oldData, newData);
  },
  ready() {
    console.log("Plugin initialized successfully");
  },
  scale: 1.5,
  pageImageCompression: "MEDIUM", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
});

function changeActiveTool(event) {
    var element = $(event.target).hasClass("tool-button")
      ? $(event.target)
      : $(event.target).parents(".tool-button").first();
    $(".tool-button.active").removeClass("active");
    $(element).addClass("active");
}

function enableSelector(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableSelector();
}

function enablePencil(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enablePencil();
}

function enableAddText(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddText();
}

function enableAddArrow(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.enableAddArrow();
}

function addImage(event) {
    event.preventDefault();
    pdf.addImageToCanvas()
}

function enableRectangle(event) {
    event.preventDefault();
    changeActiveTool(event);
    pdf.setColor('rgba(255, 0, 0, 0.3)');
    pdf.setBorderColor('blue');
    pdf.enableRectangle();
}

function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

function ImageInfo(page, dataURL, top, left) {
    this.page = page;
    this.dataURL = dataURL;
    this.top = top;
    this.left = left
}

function savePDF() {

    var imagesInfo = pdf.getImagesInfo();
    console.log(imagesInfo);

    var images = []

    imagesInfo.forEach(function(imageInfo, index) {
        console.log(`Image ${index + 1}:`);
        console.log(`  Page: ${imageInfo.page}`);
        console.log(`  Data URL: ${imageInfo.dataURL}`);
        console.log(`  Position: Left - ${imageInfo.position.left}, Top - ${imageInfo.position.top}`);
        console.log(`  Scale: ScaleX - ${imageInfo.position.scaleX}, ScaleY - ${imageInfo.position.scaleY}`);
        var imagew = new ImageInfo(imageInfo.page, imageInfo.dataURL, imageInfo.position.top, imageInfo.position.left)
        images.push(imagew)
        
    });


    fetch('api/Images', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(images)
    })
    .then(response => response.json())
    .then(data => {
        pdf.savePdf('sample.pdf');
        alert('Ảnh đã được lưu thành công!');
        console.log(data);
    })
    .catch(error => {
        console.error('Lỗi: ', error);
    });
}

function clearPage() {
    pdf.clearActivePage();
}

function showPdfData() {
    var string = pdf.serializePdf();
    $('#dataModal .modal-body pre').first().text(string);
    PR.prettyPrint();
    $('#dataModal').modal('show');
}

$(function () {
    $('.color-tool').click(function () {
        $('.color-tool.active').removeClass('active');
        $(this).addClass('active');
        color = $(this).get(0).style.backgroundColor;
        pdf.setColor(color);
    });

    $('#brush-size').change(function () {
        var width = $(this).val();
        pdf.setBrushSize(width);
    });

    $('#font-size').change(function () {
        var font_size = $(this).val();
        pdf.setFontSize(font_size);
    });
});
