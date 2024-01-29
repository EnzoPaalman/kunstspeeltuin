const width = 640, height = 480,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

let video = null, isSetup = false;

Setup();
function Setup(){
    if (!isSetup){
        canvas.width = width;
        canvas.height = height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.backgroundColor = 'red';

        video = document.getElementById('camera');
        document.addEventListener('click', TakePhoto);

        navigator.mediaDevices
            .getUserMedia({video: true, audio: true})
            .then((stream)=>{
                video.srcObject = stream;
                video.play();
            }).catch((error)=>{
                console.error(`Error obtaining video stream:\n${error}`);
            });

        isSetup != isSetup
    }
}

function TakePhoto(){

    ctx.drawImage(video, 0, 0, width, height);
}

var port = null, writer = null, reader = null, str = "";

// add user-gesture
document.addEventListener('click', ()=>{
    console.log('clicked');
    RequestSerialIO();
});

async function RequestSerialIO(){
    port = await navigator.serial.requestPort();
    await port.open( {baudRate: 115200, dataBits: 8,
    stopBits: 1, parity:"none"});

    ReadUntilClosed();
    writer = port.writable.getWriter();
    console.log(port);
}

async function ReadUntilClosed(){
    while(port.readable){
        reader = port.readable.getReader();
        try{
            while(true) {
                const {value, done} = await reader.read();
                let newStr = "";
                for(let i = 0; i < value.length; i++) {
                    newStr += String.fromCharCode(value[i]);
                }
                newStr = newStr.trim();
                str += newStr;
                if (
                    str.lastIndexOf('<') != -1 &&
                    str.lastIndexOf('>') != -1 &&
                    str.lastIndexOf('<') < str.lastIndexOf('>')
                  ) {
                    let startInx = str.lastIndexOf('<');
                    let diff = str.lastIndexOf('>') - startInx;
                    str = str.substring(startInx + 1, diff);
                    console.log(str);
                    
                    if (str == "fotogemaakt") {
                        TakePhoto();
                      }
                      str = "";
                  }
            }
        } catch(error) {
            console.error(error);
        }
    }
}

async function WriteToSerial(txt) { 
    let arr = new Uint8Array(txt.length);
    for(let i = 0; i < txt.length; ++i) {
        arr[i] = txt.charCodeAt(i);
    }
    await writer.write(arr);

}