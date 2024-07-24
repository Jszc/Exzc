function init() {

  if (canvas) {
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.font = '12px sans-serif';
    draw();
    rAFSetInterval(run, 50);
  }
}

const draw = () => {
  // 初始化
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;

  // 开始节点
  ctx.beginPath();
  ctx.arc(300, 125, 25, Math.PI / 2, (Math.PI * 3) / 2, false); // 左边框
  ctx.lineTo(350, 100);
  ctx.arc(350, 125, 25, (Math.PI * 3) / 2, (Math.PI * 5) / 2, false); // 右边框
  ctx.lineTo(300, 150);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#82b366';
  ctx.stroke();
  ctx.fillStyle = '#d5e8d4';
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillText('开始', 312, 130);

  drawMiddleBlock();

  // 结束节点
  ctx.beginPath();
  ctx.arc(300, 375, 25, Math.PI / 2, (Math.PI * 3) / 2, false); // 左边框
  ctx.lineTo(350, 350);
  ctx.arc(350, 375, 25, (Math.PI * 3) / 2, (Math.PI * 5) / 2, false); // 右边框
  ctx.lineTo(300, 400);
  ctx.strokeStyle = '#82b366';
  ctx.stroke();
  ctx.fillStyle = '#d5e8d4';
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillText('结束', 312, 380);

  // 线条1
  ctx.beginPath();
  ctx.moveTo(325, 150);
  ctx.lineTo(325, 223);
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = -offset;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#000';
  ctx.stroke();
  // 箭头1
  ctx.beginPath();
  ctx.moveTo(320, 215);
  ctx.lineTo(325, 218);
  ctx.lineTo(330, 215);
  ctx.lineTo(325, 225);
  ctx.fill();

  // 线条2
  ctx.beginPath();
  ctx.moveTo(325, 275);
  ctx.lineTo(325, 348);
  ctx.stroke();
  // 箭头 2
  ctx.beginPath();
  ctx.moveTo(320, 340);
  ctx.lineTo(325, 343);
  ctx.lineTo(330, 340);
  ctx.lineTo(325, 350);
  ctx.fill();
};

const drawArrow = () => {
  ctx.beginPath();
  ctx.moveTo(320, 340);
  ctx.lineTo(325, 343);
  ctx.lineTo(330, 340);
  ctx.lineTo(325, 350);
  ctx.fill();
}

const drawArrowLine = () => {
  ctx.beginPath();
  ctx.moveTo(325, 275);
  ctx.lineTo(325, 348);
  ctx.stroke();
}

function getOrder(item, { maxX, maxY }) {
  let checkOrder = '';

  if (item[0] === maxX) checkOrder += 'r'
  else checkOrder += 'l';
  if (item[1] === maxY) checkOrder += 't'
  else checkOrder += 'b';

  return checkOrder;
}

const drawMiddleBlock = (blockCoordinate = [[280, 230], [370, 230], [370, 270], [280, 270]]) => {
  // 中间节点
  ctx.beginPath();
  // const order = { lb: 1, lt: 2, rb: 3, rt: 4 };

  const { orderObj } = blockCoordinate.reduce((pre, cur) => {
    let { maxX, maxY, orderObj } = pre;
    const curMaxX = cur[0] > maxX ? cur[0] : maxX;
    const curMaxY = cur[1] > maxY ? cur[1] : maxY;

    const loopCheck = (unassignedItem) => {
      const checkOrder = getOrder(unassignedItem, { maxX: curMaxX, maxY: curMaxY });

      if (orderObj[checkOrder]) {
        let copyItem;
        copyItem = orderObj[checkOrder];
        orderObj[checkOrder] = cur;

        loopCheck(copyItem)
      } else {
        orderObj[checkOrder] = unassignedItem;
      }
    }

    loopCheck(cur);

    return {
      orderObj,
      maxX: curMaxX,
      maxY: curMaxY,
    }
  }, { orderObj: {}, maxX: 0, maxY: 0 });

  console.log(blockCoordinate, 'orderObj', orderObj);

  [orderObj.lb, orderObj.rb, orderObj.rt, orderObj.lt].forEach((item, idx) => {
    const [x, y] = item;
    const fourKey = { 1: Math.PI / 2, 4: Math.PI, 2: Math.PI / 2, 3: (Math.PI * 3) / 2 }[idx + 1];
    const fiveKey = { 1: Math.PI, 4: (Math.PI * 3) / 2, 2: Math.PI / 2, 3: Math.PI * 2 }[idx + 1];
    // const lineType = { lb: Math.PI, lt: [x, y], rb: Math.PI / 2, rt: Math.PI * 2 }[key];

    ctx.arc(x, y, 5, 0, 0, false);
    // ctx.lineTo(x, y);
  })

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#6c8ebf';
  ctx.stroke();
  ctx.fillStyle = '#dae8fc';
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillText('中间节点', 300, 254);
}

const run = () => {
  offset++;
  if (offset > 1000) {
    offset = 0;
  }
  drawAnimateLine();
};

const drawAnimateLine = () => {
  // 清空线条
  ctx.clearRect(324, 150, 2, 67);
  ctx.clearRect(324, 275, 2, 67);

  // 绘制线条1
  ctx.beginPath();
  ctx.moveTo(325, 150);
  ctx.lineTo(325, 223);
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = -offset;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#000';
  ctx.stroke();

  // 绘制线条2
  ctx.beginPath();
  ctx.moveTo(325, 275);
  ctx.lineTo(325, 348);
  ctx.stroke();
};

const drawOne = {
  config: {
    strokeRect: () => [10, 10, 100, 50],
    fillText: 'Hello, World!',
    fillStyle: "#5cd5fb"
  }
}

const conditionText = `开始补卡，提交补卡申请。判断有无项目，无项目则部门经理审批，审批通过则提交申请，审批不通过则退回。有项目则项目经理审批, 审批通过则部门经理审批，审批不通过则退回。`

const dealText = (conditionText, dealResult = {}) => {
  const getDealItemIndex = conditionText.indexOf('。');
  const { allProcess = [], processItem = [] } = dealResult;


  if(getDealItemIndex === -1) return dealResult;
  else {
    const dealItem = conditionText.slice(0, getDealItemIndex);
    const dealItemText = conditionText.slice(getDealItemIndex + 1, conditionText.length);
    return dealText(dealItemText, {
      allProcess: [...allProcess, ...dealItem.split('，')],
      processItem: [...processItem, dealItem]
    });
  }

}

console.log(dealText(conditionText), 'conditionText')