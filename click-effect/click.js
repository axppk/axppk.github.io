/**
 * 鼠标点击和长按特效函数
 * 创建一个全屏canvas，实现点击和长按的粒子动画效果
 */
function clickEffect() {
    let balls = [];             // 存储所有粒子的数组
    let longPressed = false;    // 是否长按的标志
    let longPress;              // 长按定时器
    let multiplier = 0;         // 长按乘数，影响粒子大小和数量
    let width, height;          // canvas宽高
    let origin;                 // 原点位置
    let normal;                 // 法线向量
    let ctx;                    // canvas上下文
    
    // 粒子颜色数组
    const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
    
    // 创建全屏canvas元素并添加到页面
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
    
    // 创建鼠标指针元素
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);
  
    // 检查浏览器支持
    if (canvas.getContext && window.addEventListener) {
      ctx = canvas.getContext("2d");
      updateSize();
      window.addEventListener('resize', updateSize, false);
      loop();
      
      // 鼠标按下事件 - 点击或长按的开始
      window.addEventListener("mousedown", function(e) {
        // 点击时创建10-20个粒子
        pushBalls(randBetween(10, 20), e.clientX, e.clientY);
        document.body.classList.add("is-pressed");
        
        // 设置长按定时器(500ms) - 可调整长按检测时间
        longPress = setTimeout(function(){
          document.body.classList.add("is-longpress");
          longPressed = true;
        }, 500); // 长按检测时间 - 可调整持续时间
      }, false);
      
      // 鼠标释放事件 - 点击或长按的结束
      window.addEventListener("mouseup", function(e) {
        clearInterval(longPress);
        if (longPressed == true) {
          document.body.classList.remove("is-longpress");
          // 长按结束时创建更多粒子(50-100 + multiplier)
          pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
          longPressed = false;
        }
        document.body.classList.remove("is-pressed");
      }, false);
      
      // 鼠标移动事件 - 更新指针位置
      window.addEventListener("mousemove", function(e) {
        let x = e.clientX;
        let y = e.clientY;
        pointer.style.top = y + "px";
        pointer.style.left = x + "px";
      }, false);
    } else {
      console.log("canvas or addEventListener is unsupported!");
    }
  
    /**
     * 更新canvas尺寸，适应窗口变化
     */
    function updateSize() {
      // 高分辨率渲染
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(2, 2);
      
      width = window.innerWidth;
      height = window.innerHeight;
      origin = {
        x: width / 2,
        y: height / 2
      };
      normal = {
        x: width / 2,
        y: height / 2
      };
    }
    
    /**
     * 粒子类 - 表示特效中的单个粒子
     */
    class Ball {
      constructor(x = origin.x, y = origin.y) {
        this.x = x;                 // 粒子x坐标
        this.y = y;                 // 粒子y坐标
        this.angle = Math.PI * 2 * Math.random();  // 粒子发射角度
        
        // 粒子速度乘数 - 长按会产生更大更快的粒子
        if (longPressed == true) {
          this.multiplier = randBetween(10 + multiplier, 12 + multiplier);
        } else {
          this.multiplier = randBetween(6, 12);
        }
        
        // 粒子速度分量
        this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
        this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);


        
        // 粒子初始半径 - 可调整粒子大小
        this.r = randBetween(4, 6) + 2 * Math.random(); // 可调整粒子大小



        
        // 随机选择粒子颜色
        this.color = colours[Math.floor(Math.random() * colours.length)];
      }
      
      /**
       * 更新粒子位置和属性
       */
      update() {
        this.x += this.vx - normal.x;
        this.y += this.vy - normal.y;
        normal.x = -2 / window.innerWidth * Math.sin(this.angle);
        normal.y = -2 / window.innerHeight * Math.cos(this.angle);
        
        // 粒子半径减小 - 控制粒子消失速度(持续时间)
        this.r -= 0.3; // 可调整粒子消失速度(持续时间)
        
        // 速度衰减
        this.vx *= 0.9;
        this.vy *= 0.9;
      }
    }
  
    /**
     * 创建指定数量的粒子
     * @param {number} count - 粒子数量
     * @param {number} x - 起始x坐标
     * @param {number} y - 起始y坐标
     */
    function pushBalls(count = 1, x = origin.x, y = origin.y) {
      for (let i = 0; i < count; i++) {
        balls.push(new Ball(x, y));
      }
    }
  
    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} - 随机整数
     */
    function randBetween(min, max) {
      return Math.floor(Math.random() * max) + min;
    }
  
    /**
     * 动画循环 - 每一帧更新和绘制所有粒子
     */
    function loop() {
      // 清空画布
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制并更新所有粒子
      for (let i = 0; i < balls.length; i++) {
        let b = balls[i];
        if (b.r < 0) continue;
        
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
        ctx.fill();
        b.update();
      }
      
      // 长按乘数更新
      if (longPressed == true) {
        multiplier += 0.2;
      } else if (!longPressed && multiplier >= 0) {
        multiplier -= 0.4;
      }
      
      // 移除离开画布或半径小于0的粒子
      removeBall();
      
      // 请求下一帧动画
      requestAnimationFrame(loop);
    }
  
    /**
     * 移除超出边界或不可见的粒子
     */
    function removeBall() {
      for (let i = 0; i < balls.length; i++) {
        let b = balls[i];
        if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
          balls.splice(i, 1);
        }
      }
    }
  }
  
  // 调用特效函数
  clickEffect();