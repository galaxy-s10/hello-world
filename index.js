const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

/**
 * ["2020-01-01","2020-05-01"]
 */
function getRangeTime(begin, end) {
  function format(val) {
    var s = "";
    var mouth =
      val.getMonth() + 1 >= 10
        ? val.getMonth() + 1
        : "0" + (val.getMonth() + 1);
    var day = val.getDate() >= 10 ? val.getDate() : "0" + val.getDate();
    s += val.getFullYear() + "-";
    s += mouth + "-";
    s += day;
    return s;
  }

  var arr = [];
  var beginArr = begin.split("-");
  var beginDate = new Date(
    `${beginArr[0]}/${beginArr[1]}/${beginArr[2]} 00:00:00`
  );
  var beginTimestamp = beginDate.getTime() - 24 * 60 * 60 * 1000;

  var endArr = end.split("-");
  var endDate = new Date(`${endArr[0]}/${endArr[1]}/${endArr[2]} 00:00:00`);
  var endTimestamp = endDate.getTime() - 24 * 60 * 60 * 1000;

  for (var k = beginTimestamp; k <= endTimestamp; ) {
    k = k + 24 * 60 * 60 * 1000;
    arr.push(format(new Date(parseInt(k))));
  }
  return arr;
}

const allTime = getRangeTime("1999-05-07", "1999-12-31");

let content = "";
const cmd = (time) => {
  let str = `
    git add .
    export GIT_AUTHOR_DATE="${time}T12:00:00+00:00"
    export GIT_COMMITTER_DATE="${time}T12:00:00+00:00"
    git commit -m ${time}
      `;
  return str;
};

const promiseTask = async (element) => {
  const { stdout, stderr } = await exec(cmd(element));
  console.log("stdout:", stdout);
  console.error("stderr:", stderr);
};

const wrapFn = async () => {
  for (let index = 0; index < allTime.length; index++) {
    const element = allTime[index];
    content = content + element + "\n";
    fs.writeFileSync("./hello.txt", content);
    await promiseTask(element);
  }
};
wrapFn();
