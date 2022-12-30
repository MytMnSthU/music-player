/**
 * This write.js read .lrc files from assets folder
 * and write as .json file to js folder
 * I'm doing these things bcz I don't want time in 
 * lrc file and don't want to edit physically. I just
 * only want lyric filename and lyric sentence so
 * I use nodejs as a tool to edit these files
 */

const { log } = require("console");
const fs = require("fs/promises");
const path = require("path");

const assetspath = path.resolve("assets");

async function getLrcFiles(pathname) {
   try {
      const LYRIC_DATA = [];

      const files = await fs.readdir(pathname);

      const lrcfiles = files.filter((file) => {
         const fileext = path.extname(assetspath + file);
         return fileext === ".lrc";
      });

      const filecontent = await Promise.all(
         lrcfiles.map((file) => {
            return fs.readFile(assetspath + "/" + file, "utf-8");
         })
      );

      const formatcontent = filecontent.map((content) => {
         const splittedcontent = content.split(/\n/);
         const removedTimeLyrics = splittedcontent.map((c) => {
            let indexOfCloseBracket = c.indexOf("]");
            let newS = c.slice(indexOfCloseBracket + 1, c.length);
            return newS;
         });
         return removedTimeLyrics;
      });
    //   log(formatcontent);

      // lrcfiles.forEach((file, idx) => {
      //    LYRIC_DATA.push({ [file]: formatcontent[idx] });
      // });

      for (let i = lrcfiles.length-1; i >= 0; i--) {
         LYRIC_DATA.push({ [lrcfiles[i]]: formatcontent[i] });
      }

    //   log(LYRIC_DATA);

      const LYRIC_DATA_JSON = JSON.stringify(LYRIC_DATA);

      const writeFileData = await fs.writeFile("js/data.json", LYRIC_DATA_JSON);
   } catch (e) {
      console.error(e);
   }
}

getLrcFiles(assetspath);
