
const { exec } = require('child_process');

function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
   }
}

var os = new os_func();

const getPrediction = async(fileName) => {
    try{
        return (await os.execCommand(`python3 ./server/prediction_model/predict.py ${fileName}`)).replace(/(\r\n|\n|\r)/gm, "")
    }
    catch(e){
        console.log(e)
    }
}

exports.getPrediction = getPrediction;
