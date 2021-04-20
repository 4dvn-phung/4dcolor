window.Picker = (function () {
  class Picker {
    constructor(
      target,
      {
        width = 280,
        height = 280,
        pickerCircle = { x: 10, y: 10, size: 6 },
        colors = [], // List [[x,y]]
        hsl = 0,
      } = {}
    ) {
      this.target = target;
      this.hsl = hsl;
      this.colors = colors;
      this.width = width;
      // this.alpha = alpha;
      this.height = height;
      this.target.width = width;
      this.target.height = height;
      //Get context
      this.context = this.target.getContext('2d');
      //Circle
      this.pickerCircle = pickerCircle;
      this.listenForEvents();
    }

    draw() {
      this.build();
    }

    drawColorsPoint() {
      //Circle
      this.colors.forEach((colorXY) => {
        if (Array.isArray(colorXY)) {
          this.drawCircle({ x: colorXY[0], y: colorXY[1], size: 1 });
        }
      });
    }

    drawCircle({ x, y, size }) {
      this.context.beginPath();
      this.context.arc(x, y, size + 2, 0, Math.PI * 2);
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 2;
      this.context.stroke();

      this.context.beginPath();
      this.context.arc(x, y, size, 0, Math.PI * 2);
      this.context.strokeStyle = 'white';
      this.context.lineWidth = 2;
      this.context.stroke();
      // Close path
      this.context.closePath();
    }

    build() {
      let gradient = this.context.createLinearGradient(0, 0, this.width, 0);

      //Color Stops
      gradient.addColorStop(0, `rgb(255, 0, 0, 1.5)`);
      gradient.addColorStop(0.67, `rgb(0, 255, 0, 1.5)`);
      gradient.addColorStop(0.84, `rgb(255, 255, 0, 1.5)`);
      gradient.addColorStop(0.49, `rgb(0, 255, 255, 1.5)`);
      gradient.addColorStop(0.15, `rgb(255, 0, 255, 1.5)`);
      gradient.addColorStop(0.33, `rgb(0, 0, 255, 1.5)`);
      gradient.addColorStop(1, `rgb(255, 0, 0, 1.5)`);
      //Fill it
      this.context.fillStyle = gradient;
      this.context.fillRect(0, 0, this.width, this.height);

      //Apply black and white
      gradient = this.context.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${this.hsl})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      this.context.fillStyle = gradient;
      this.context.fillRect(0, 0, this.width, this.height);

      // Circles
      this.drawColorsPoint();
    }

    listenForEvents() {
      const onMouseDown = (e) => {
        let currentX = e.clientX - this.target.offsetLeft;
        let currentY = e.clientY - this.target.offsetTop;
        this.pickerCircle.x = currentX;
        this.pickerCircle.y = currentY;
        this.onChangeCallback(this.getPickedColor());
        this.build();
        this.drawCircle({
          x: this.pickerCircle.x,
          y: this.pickerCircle.y,
          size: this.pickerCircle.size,
        });
      };

      // const onMouseMove = (e) => {
      //   if (isMouseDown) {
      //     let currentX = e.clientX - this.target.offsetLeft;
      //     let currentY = e.clientY - this.target.offsetTop;
      //     this.pickerCircle.x = currentX;
      //     this.pickerCircle.y = currentY;
      //   }
      // };
      // const onMouseUp = () => {
      //   isMouseDown = false;
      // };

      //Register
      this.target.addEventListener('mousedown', onMouseDown);
    }

    getPickedColor() {
      const imageData = this.context.getImageData(
        this.pickerCircle.x,
        this.pickerCircle.y,
        1,
        1
      );
      return {
        color: `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`,
        coordinate: [this.pickerCircle.x, this.pickerCircle.y],
      };
    }

    onChange(callback) {
      this.onChangeCallback = callback;
    }
  }

  //   let picker = new Picker(document.getElementById('color-picker'), 450, 220);

  //Draw
  //   setInterval(() => picker.draw(), 1);

  //   picker.onChange((color) => {
  //     let selected = document.getElementsByClassName('selected')[0];
  //     selected.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  //   });

  return Picker;
})();
