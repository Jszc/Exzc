const getWidth = (str = "", fz = 12) => {
  const calcWidth = str.length * fz + 32;
  return calcWidth > 66 ? calcWidth : 66;
};

const defaultConfig = {
  x: 20,
  y: 160,
  getWidth: getWidth,
  height: 45,
  radius: 16,
  fontSize: 14,
  rect: {}
};

function drawRhombus(ctx, params) {
  const { x, y, fillText } = params;
  const width = getWidth(fillText) / 2;
  const middleX = x + width;


  ctx.beginPath();
  ctx.moveTo(middleX, y + width); // 顶点
  ctx.lineTo(x + width * 2, y); // 右点
  ctx.lineTo(middleX, y - width); // 底点
  ctx.lineTo(x, y); // 左点
  ctx.closePath(); // 创建闭合路径
  ctx.fillStyle = "blue"; // 填充颜色
  ctx.strokeStyle = "black"; // 线条颜色

  ctx.fill(); // 填充菱形
  ctx.fillStyle = "white"; // 填充颜色
  ctx.fillText(fillText, x + width / 2 - 6, y + 6);
  ctx.stroke(); // 绘制线条

  return {
    point: {
      top: { x: middleX, y: y + width, type: "commonSite" },
      bottom: { x: middleX, y: y - width, type: "commonSite" },
      left: { x: x, y: y, type: "inSite" },
      right: { x: middleX * 2, y: y, type: "outSite" }
    },
    type: 'rhombus',
    ...params
  };
}

function drawReact(ctx, params) {
  const { x, y, width, height, radius, fillText} = params;
  if (!ctx) return;
  // 起始点
  const middleX = x + width;
  const middleY = y + height;

  ctx.beginPath();

  ctx.moveTo(x + radius, y);
  ctx.lineTo(middleX - radius, y);
  ctx.quadraticCurveTo(middleX, y, middleX, y + radius); // 右上圆角
  ctx.lineTo(middleX, middleY - radius);
  ctx.quadraticCurveTo(middleX, middleY, middleX - radius, middleY); // 右下圆角
  ctx.lineTo(x + radius, middleY);
  ctx.quadraticCurveTo(x, middleY, x, middleY - radius); // 左下圆角
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y); // 左上圆角
  // ctx.stroke();

  if (fillText) {
    ctx.fillText(fillText, x + 16, (2 * middleY) / 2 + 4);
  }
  ctx.strokeStyle = "black";

  // console.log({ x, y, width, height, radius, fillText }, "drawRoundedRect");

  ctx.stroke(); // 绘制

  return {
    point: {
      top: { x: middleX / 2, y: middleY, type: "commonSite" },
      bottom: { x: middleX / 2, y: y, type: "commonSite" },
      left: { x, y: middleY / 2, type: "inSite" },
      right: { x: x + width, y: middleY / 2, type: "outSite" }
    },
    type: 'react',
    ...params
  }
}

function drawLine(ctx, { start = [0, 0], end = [0, 0]}) {
  ctx.beginPath(); // 开始一个新的路径
  ctx.moveTo(...start); // 设置线的起点
  ctx.lineTo(...end); // 设置线的终点
  ctx.stroke(); // 绘制线
}

function middleWare(func, prerequisite) {
  let executeNum = 0,
    drawXWidth = {
      0: defaultConfig.x ?? 20,
      1: defaultConfig.x ?? 20
    },
    drawedItem = [];

  return (ctx, params) => {
    let result = null;
    const width = getWidth(params?.fillText ?? "");
    const height = defaultConfig?.height ?? 66;
    const offsetX = /^0+$/.test(params?.iid) ? 2 * width : width / 2;
    const offsetY = /^0+$/.test(params?.iid) ? 0 : 2.5 * height;
    const x = drawXWidth[params?.iid.length];
    const y = params?.y + offsetY;

    drawXWidth[params?.iid.length + 1] =
      drawXWidth[params?.iid.length] + width + offsetX;

    return new Promise((resolve, reject) => {
      if (prerequisite) {
        if (params?.nextCondition) {
          console.log(x, y, drawXWidth[params?.iid.length], params);
          result = prerequisite(ctx, {
            ...params,
            x: x + 1.3 * width,
            y: y + height / 2,
            fillText: params?.nextCondition
          });

          drawedItem.push(result);

        }
        if (result === false) reject();
      }
      ctx.beginPath();

      resolve(result);
    })
      .then((result) => {
        console.log(result, "drawXWidth", params);
        const outPoint = func(ctx, { ...params, x, y, width, height });

        drawedItem.push(outPoint);
        const rhombuArr = [];
        const getLine = 
        drawedItem.reduce((pre, cur) => {
          if (cur.type === 'rhombus') {
            rhombuArr.push(cur) 
            return pre;
          }
          else {
            const curRhombu = rhombuArr.find(it => it.iid === cur.iid);
            if(curRhombu) {
              return [...pre, cur, curRhombu]
            }

            return [...pre, cur]
          };
        }, [])
        .reduce((pre, cur) => {
          if(cur && pre?.length > 1) {
            return [...pre,  pre[pre.length - 1],  cur]
          }
          return [...pre, cur]
        }, []);
        console.log(getLine, 'drawedItem', drawedItem)
        
// drawLine(ctx); // 调用函数以绘制线

      })
      .finally(() => {
        ctx.closePath();
        executeNum++;
      });
  };
}

const exportObj = {
  drawReact: middleWare(drawReact, drawRhombus),
  drawRhombus: middleWare(drawRhombus)
};

export default exportObj;
