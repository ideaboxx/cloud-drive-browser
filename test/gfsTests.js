const GdriveFS = require("../gdrive-fs");
const fs = require("fs");
const path = require("path");

const gfs = new GdriveFS({
    keyFile: require("../masterKey.json"),
    indexDrive: "svcaccnt-0",
    debug: true,
});

async function main() {
    console.log("Create directory:");
    let resp = await gfs.createDirectory("gfs:/", "test");
    console.log(resp);
    if (resp.status != GdriveFS.OK) throw "Directory creation failed";

    console.log("upload file:");
    const streamIn = fs.createReadStream(__dirname + "/gfsTests.js");
    resp = await gfs.uploadFile("gfs:/test", streamIn, "sample.js");
    console.log(resp);
    if (resp.status != GdriveFS.OK) throw "file upload failed";

    console.log("download file:");
    const streamOut = fs.createWriteStream(__dirname + "/sample.out");
    resp = await gfs.downloadFile("gfs:/test/sample.js");
    resp.data.pipe(streamOut);
    if (resp.status != GdriveFS.OK) throw "Directory creation failed";

    console.log("delete file:");
    resp = await gfs.deleteFile("gfs:/test/sample.js");
    console.log(resp);
    if (resp.status != GdriveFS.OK) throw "File deletion failed";

    console.log("delete directory:");
    resp = await gfs.deleteDirectory("gfs:/test");
    console.log(resp);
    if (resp.status != GdriveFS.OK) throw "Directory deletion failed";
}

//main();

/*
gfs.createDirectory("gfs:/","hello").then(async()=>{
    console.log(await gfs.createDirectory("gfs:/hello","world"))
    //await gfs.move("gfs:/hello", "gfs:/hello")
})*/

gfs.list("gfs:/", true).then(console.log);

//gfs.deleteDirectory("gfs:/", true).then(console.log)
//gfs.createDirectory("gfs:/hello", 'sample');

//gfs.move("gfs:/hello/world", "gfs:/").then(console.log)

//console.log(path.join("gfs:/home",'/'))

//gfs._listAllFiles().then(console.log);
//gfs._deleteAllFiles().then(console.log);