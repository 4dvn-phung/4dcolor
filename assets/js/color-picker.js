const PC_WIDTH = 280; // Only support for this projetc;

const convertToPCCoordinate = ({ x, y, resolution }) => {
  const newX = x * (PC_WIDTH / resolution);
  const newY = y * (PC_WIDTH / resolution);
  return { x: newX.toFixed(3), y: newY.toFixed(3) };
};

const getAccurate = ({ x = 0, y = 0, resolution }) => {
  const newX = x * (resolution / PC_WIDTH);
  const newY = y * (resolution / PC_WIDTH);
  return { x: newX.toFixed(3), y: newY.toFixed(3) };
};

window.Picker = (function () {
  class Picker {
    constructor(
      target,
      {
        pickerCircle = { x: 10, y: 10, size: 6 },
        colors = [], // List [[x,y]]
        hsl = 0,
      } = {}
    ) {
      this.target = target;
      this.hsl = hsl;
      this.colors = colors;
      this.pickerCircle = pickerCircle;
      this.listenForEvents();
    }

    draw() {
      this.build();
    }

    drawColorsPoint() {
      //Circles
      this.colors.forEach(colorXY => {
        if (Array.isArray(colorXY)) {
          const { x, y } = getAccurate({
            x: +colorXY[0],
            y: +colorXY[1],
            resolution: this.target.width,
          });
          this.drawCircle({
            x,
            y,
            size: 1,
          });
        }
      });
    }

    drawCircle({ x, y, size = 1 }) {
      this.context.beginPath();
      this.context.arc(x, y, size + 2, 0, Math.PI * 2);
      this.context.strokeStyle = "black";
      this.context.lineWidth = 2;
      this.context.stroke();

      this.context.beginPath();
      this.context.arc(x, y, size, 0, Math.PI * 2);
      this.context.strokeStyle = "white";
      this.context.lineWidth = 2;
      this.context.stroke();
      // Close path
      this.context.closePath();
    }

    build() {
      const { width, height } = this.target.getBoundingClientRect();
      this.target.width = width;
      this.target.height = height;
      //Get context
      this.context = this.target.getContext("2d");
      let gradient = this.context.createLinearGradient(0, 0, width, 0);

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
      this.context.fillRect(0, 0, width, height);
      //Apply black and white
      gradient = this.context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${this.hsl})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
      this.context.fillStyle = gradient;
      this.context.fillRect(0, 0, width, height);

      // Circles
      this.drawColorsPoint();
    }

    listenForEvents() {
      const onMouseDown = e => {
        let currentX = e.layerX;
        let currentY = e.layerY;
        this.pickerCircle.x = currentX;
        this.pickerCircle.y = currentY;

        if (this.onChangeCallback) {
          this.build();
          this.onChangeCallback(this.getPickedColor());
          this.drawCircle({
            x: currentX,
            y: currentY,
            size: this.pickerCircle.size,
          });
        }
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
      this.target.addEventListener("mousedown", onMouseDown);
    }

    getPickedColor() {
      const { x, y } = convertToPCCoordinate({
        ...this.pickerCircle,
        resolution: this.target.width,
      });
      const imageData = this.context.getImageData(
        this.pickerCircle.x,
        this.pickerCircle.y,
        1,
        1
      );
      return {
        color: `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`,
        coordinate: `${x};${y}`,
      };
    }

    onChange(callback) {
      this.onChangeCallback = callback;
    }
  }
  return Picker;
})();
