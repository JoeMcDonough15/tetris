const GREEN = "rgb(0 255 0)";
const BLUE = "rgb(0 100 255)";
const RED = "rgb(255 0 0)";
const YELLOW = "rgb(255 255 0)";
const ORANGE = "rgb(255 127 0)";
const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext("2d");
const gameSpeed = 200;

class Block {
  constructor(xCoordinate, yCoordinate, color) {
    this.width = 20; // or 3% of the canvas width of 600px
    this.height = 20; // or 2.5% of the canvas height of 800px
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  clearBlock = () => {
    ctx.clearRect(this.xCoordinate, this.yCoordinate, this.width, this.height);
  };

  drawBlock = () => {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.borderColor;
    ctx.fillRect(this.xCoordinate, this.yCoordinate, this.width, this.height);
    ctx.strokeRect(this.xCoordinate, this.yCoordinate, this.width, this.height);
  };
}

class Shape {
  constructor(colorString) {
    // this.xCoordinate = 0;
    // this.yCoordinate = 0;
    this.numBlocks = 4;
    this.shapeColor = colorString;
    // this.individualBlockWidth = 20;
    // this.borderColor = "rgb(0 0 0)";
    // this.blocks = [0, 1, 2, 3];
    this.blocks = [];
    for (let i = 0; i < this.numBlocks; i++) {
      const newBlock = new Block(0, 0, this.shapeColor);
      this.blocks.push(newBlock);
    }
    this.initialBlock = this.blocks[0];
    console.log("blocks of shape ", this.blocks);
  }

  // methods

  placePiece = (interval) => {
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
  };

  fall = () => {
    const fallInterval = setInterval(() => {
      if (this.initialBlock.yCoordinate >= canvas.height - this.shapeHeight) {
        this.placePiece(fallInterval);
      }
      this.clearShape();
      this.initialBlock.yCoordinate += this.initialBlock.height;
      this.drawShape();
    }, gameSpeed);

    document.addEventListener("keydown", this.pieceControllerEvents);
  };

  moveLeft = () => {
    if (this.xCoordinate < this.individualBlockWidth) return;
    this.clearShape();
    this.xCoordinate -= this.individualBlockWidth;
    this.drawShape();
  };

  moveRight = () => {
    if (this.xCoordinate + this.shapeWidth >= canvas.width) return;
    this.clearShape();
    this.xCoordinate += this.individualBlockWidth;
    this.drawShape();
  };

  pieceControllerEvents = (e) => {
    const keyName = e.key;
    if (keyName === "ArrowRight") {
      this.moveRight();
    } else if (keyName === "ArrowLeft") {
      this.moveLeft();
    } else if (keyName === "r") {
      this.rotate();
    }
  };

  // TODO
  speedDown = () => {};
}

class Line extends Shape {
  constructor() {
    super(GREEN);
    this.shapeHeight = this.blocks[0].height * 2;
    this.shapeWidth = this.blocks[0].width * 4;
    this.rotation = "horizontal"; // horizontal or vertical
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.clearBlock();
      //   if (this.isRotated) {
      //     ctx.clearRect(
      //       this.xCoordinate,
      //       this.yCoordinate + this.individualBlockWidth * block,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   } else {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth * block,
      //       this.yCoordinate,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   }
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      // ctx.fillStyle = this.fillColor;
      // ctx.strokeStyle = this.borderColor;

      if (this.rotation === "horizontal") {
        block.xCoordinate = this.initialBlock.xCoordinate + block.width * index;
        block.yCoordinate = this.initialBlock.yCoordinate;
      } else if (this.rotation === "vertical") {
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate =
          this.initialBlock.yCoordinate + block.height * index;
      }

      block.drawBlock();

      // if (this.isRotated) {
      //   ctx.fillRect(
      //     this.xCoordinate,
      //     this.yCoordinate + this.individualBlockWidth * block,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      //   ctx.strokeRect(
      //     this.xCoordinate,
      //     this.yCoordinate + this.individualBlockWidth * block,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // } else {
      //   ctx.fillRect(
      //     this.xCoordinate + this.individualBlockWidth * block,
      //     this.yCoordinate,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      //   ctx.strokeRect(
      //     this.xCoordinate + this.individualBlockWidth * block,
      //     this.yCoordinate,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // }
    });
  };

  rotate = () => {
    this.clearShape();
    // this.isRotated = !this.isRotated;
    this.rotation = this.rotation === "horizontal" ? "vertical" : "horizontal";
    this.drawShape();
    if (this.rotation === "vertical") {
      this.shapeHeight = this.initialBlock.height * 5; // we seem to need one extra value for height
      this.shapeWidth = this.initialBlock.width;
    } else {
      this.shapeHeight = this.initialBlock.height * 2; // we seem to need one extra value for height
      this.shapeWidth = this.initialBlock.width * 4;
    }
    // if (this.isRotated) {
    //   this.shapeHeight = this.individualBlockWidth * 5; // we seem to need one extra value for height
    //   this.shapeWidth = this.individualBlockWidth;
    // } else {
    //   this.shapeHeight = this.individualBlockWidth * 2; // we seem to need one extra value for height
    //   this.shapeWidth = this.individualBlockWidth * 4;
    // }
  };
}

class Square extends Shape {
  constructor() {
    super(BLUE);
    this.shapeHeight = this.initialBlock.height * 3;
    this.shapeWidth = this.initialBlock.width * 2;
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.clearBlock();
      // if (block === 0) {
      //   ctx.clearRect(
      //     this.xCoordinate,
      //     this.yCoordinate,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // } else if (block === 1) {
      //   ctx.clearRect(
      //     this.xCoordinate + this.individualBlockWidth,
      //     this.yCoordinate,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // } else if (block === 2) {
      //   ctx.clearRect(
      //     this.xCoordinate,
      //     this.yCoordinate + this.individualBlockWidth,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // } else {
      //   ctx.clearRect(
      //     this.xCoordinate + this.individualBlockWidth,
      //     this.yCoordinate + this.individualBlockWidth,
      //     this.individualBlockWidth,
      //     this.individualBlockWidth
      //   );
      // }
    });
  };

  drawShape = () => {
    // this.blocks.forEach((block) => {
    // ctx.fillStyle = this.fillColor;
    // ctx.strokeStyle = this.borderColor;
    //   if (block === 0) {
    //     ctx.fillRect(
    //       this.xCoordinate,
    //       this.yCoordinate,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //     ctx.strokeRect(
    //       this.xCoordinate,
    //       this.yCoordinate,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //   } else if (block === 1) {
    //     ctx.fillRect(
    //       this.xCoordinate + this.individualBlockWidth,
    //       this.yCoordinate,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //     ctx.strokeRect(
    //       this.xCoordinate + this.individualBlockWidth,
    //       this.yCoordinate,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //   } else if (block === 2) {
    //     ctx.fillRect(
    //       this.xCoordinate,
    //       this.yCoordinate + this.individualBlockWidth,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //     ctx.strokeRect(
    //       this.xCoordinate,
    //       this.yCoordinate + this.individualBlockWidth,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //   } else {
    //     ctx.fillRect(
    //       this.xCoordinate + this.individualBlockWidth,
    //       this.yCoordinate + this.individualBlockWidth,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //     ctx.strokeRect(
    //       this.xCoordinate + this.individualBlockWidth,
    //       this.yCoordinate + this.individualBlockWidth,
    //       this.individualBlockWidth,
    //       this.individualBlockWidth
    //     );
    //   }
    // });
    this.blocks.forEach((block, index) => {
      if (index === 1) {
        block.xCoordinate = this.initialBlock.xCoordinate + block.width;
        block.yCoordinate = this.initialBlock.yCoordinate;
      } else if (index === 2) {
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate = this.initialBlock.yCoordinate + block.height;
      } else if (index === 3) {
        block.xCoordinate = this.initialBlock.xCoordinate + block.width;
        block.yCoordinate = this.initialBlock.yCoordinate + block.height;
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    return;
  };
}

class TShape extends Shape {
  constructor() {
    super(RED);
    this.shapeHeight = this.initialBlock.height * 2;
    this.shapeWidth = this.initialBlock.width * 3;
    this.rotation = "up"; // up, right, down, left
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.clearBlock();
      // if (this.rotation === "up") {
      //   if (block === 3) {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth,
      //       this.yCoordinate - this.individualBlockWidth,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   } else {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth * block,
      //       this.yCoordinate,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   }
      // } else if (this.rotation === "right") {
      //   if (block === 3) {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth,
      //       this.yCoordinate + this.individualBlockWidth,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   } else {
      //     ctx.clearRect(
      //       this.xCoordinate,
      //       this.yCoordinate + this.individualBlockWidth * block,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   }
      // } else if (this.rotation === "left") {
      //   if (block === 3) {
      //     ctx.clearRect(
      //       this.xCoordinate - this.individualBlockWidth,
      //       this.yCoordinate + this.individualBlockWidth,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   } else {
      //     ctx.clearRect(
      //       this.xCoordinate,
      //       this.yCoordinate + this.individualBlockWidth * block,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   }
      // } else if (this.rotation === "down") {
      //   if (block === 3) {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth,
      //       this.yCoordinate + this.individualBlockWidth,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   } else {
      //     ctx.clearRect(
      //       this.xCoordinate + this.individualBlockWidth * block,
      //       this.yCoordinate,
      //       this.individualBlockWidth,
      //       this.individualBlockWidth
      //     );
      //   }
      // }
    });
  };

  drawShape = () => {
    // this.blocks.forEach((block) => {
    //   ctx.fillStyle = this.fillColor;
    //   ctx.strokeStyle = this.borderColor;
    //   if (this.rotation === "up") {
    //     if (block === 3) {
    //       // place this block above the middle block
    //       ctx.fillRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate - this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate - this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     } else {
    //       // place blocks in a row
    //       ctx.fillRect(
    //         this.xCoordinate + this.individualBlockWidth * block,
    //         this.yCoordinate,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth * block,
    //         this.yCoordinate,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     }
    //   } else if (this.rotation === "right") {
    //     if (block === 3) {
    //       // put this block to the right of the middle block
    //       ctx.fillRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     } else {
    //       // stack the blocks vertically
    //       ctx.fillRect(
    //         this.xCoordinate,
    //         this.yCoordinate + this.individualBlockWidth * block,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate,
    //         this.yCoordinate + this.individualBlockWidth * block,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     }
    //   } else if (this.rotation === "left") {
    //     if (block === 3) {
    //       // put this block to the left of the middle block
    //       ctx.fillRect(
    //         this.xCoordinate - this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     } else {
    //       // stack the blocks vertically
    //       ctx.fillRect(
    //         this.xCoordinate,
    //         this.yCoordinate + this.individualBlockWidth * block,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate,
    //         this.yCoordinate + this.individualBlockWidth * block,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     }
    //   } else if (this.rotation === "down") {
    //     if (block === 3) {
    //       // put this block below the middle block
    //       ctx.fillRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth,
    //         this.yCoordinate + this.individualBlockWidth,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     } else {
    //       // place blocks in a row
    //       ctx.fillRect(
    //         this.xCoordinate + this.individualBlockWidth * block,
    //         this.yCoordinate,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //       ctx.strokeRect(
    //         this.xCoordinate + this.individualBlockWidth * block,
    //         this.yCoordinate,
    //         this.individualBlockWidth,
    //         this.individualBlockWidth
    //       );
    //     }
    //   }
    // });
    this.blocks.forEach((block, index) => {
      if (this.rotation === "up") {
        if (index === 3) {
          // place the final block above the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + block.width;
          block.yCoordinate = this.initialBlock.yCoordinate - block.height;

          // ctx.fillRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate - this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate - this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + block.width * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
          // ctx.fillRect(
          //   this.xCoordinate + this.individualBlockWidth * block,
          //   this.yCoordinate,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth * block,
          //   this.yCoordinate,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        }
      } else if (this.rotation === "right") {
        if (index === 3) {
          // put the final block to the right of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + block.width;
          block.yCoordinate = this.initialBlock.yCoordinate + block.height;
          // ctx.fillRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + block.height * index;
          // ctx.fillRect(
          //   this.xCoordinate,
          //   this.yCoordinate + this.individualBlockWidth * block,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate,
          //   this.yCoordinate + this.individualBlockWidth * block,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        }
      } else if (this.rotation === "left") {
        if (index === 3) {
          // put this block to the left of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate - block.width;
          block.yCoordinate = this.initialBlock.yCoordinate + block.height;
          // ctx.fillRect(
          //   this.xCoordinate - this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + block.height * index;
          // ctx.fillRect(
          //   this.xCoordinate,
          //   this.yCoordinate + this.individualBlockWidth * block,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate,
          //   this.yCoordinate + this.individualBlockWidth * block,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        }
      } else if (this.rotation === "down") {
        if (index === 3) {
          // put this block below the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + block.width;
          block.yCoordinate = this.initialBlock.yCoordinate + block.height;

          // ctx.fillRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth,
          //   this.yCoordinate + this.individualBlockWidth,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + block.width * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
          // ctx.fillRect(
          //   this.xCoordinate + this.individualBlockWidth * block,
          //   this.yCoordinate,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
          // ctx.strokeRect(
          //   this.xCoordinate + this.individualBlockWidth * block,
          //   this.yCoordinate,
          //   this.individualBlockWidth,
          //   this.individualBlockWidth
          // );
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    this.clearShape();
    if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = this.initialBlock.height * 4;
      this.shapeWidth = this.initialBlock.width * 2;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = this.initialBlock.height * 3;
      this.shapeWidth = this.initialBlock.width * 3;
    } else if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = this.initialBlock.height * 4;
      this.shapeWidth = this.initialBlock.width * 2;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = this.initialBlock.height * 2;
      this.shapeWidth = this.initialBlock.width * 3;
    }
    this.drawShape();
  };
}

class LShape extends Shape {
  constructor() {
    super(YELLOW);
    this.shapeHeight = this.individualBlockWidth * 4;
    this.shapeWidth = this.individualBlockWidth * 3;
    this.rotation = "down"; // down, up, left, right
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      if (this.rotation === "down") {
        if (block === 3) {
          // clear block on bottom right
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks vertically
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "right") {
        if (block === 3) {
          // clear block on top right
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks in a row
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "left") {
        if (block === 3) {
          // clear block on bottom left
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks in a row
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "up") {
        if (block === 3) {
          // clear the block on the top left
          ctx.clearRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks vertically
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      }
    });
  };

  drawShape = () => {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.borderColor;

    this.blocks.forEach((block) => {
      if (this.rotation === "down") {
        if (block === 3) {
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // stack blocks vertically
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "right") {
        if (block === 3) {
          // put block on top right
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // place blocks in a row
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "left") {
        if (block === 3) {
          // put block on bottom left
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // place blocks in a row
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "up") {
        if (block === 3) {
          ctx.fillRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // stack blocks vertically
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      }
    });
  };

  rotate = () => {
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = this.individualBlockWidth * 3;
      this.shapeWidth = this.individualBlockWidth * 4;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = this.individualBlockWidth * 4;
      this.shapeWidth = this.individualBlockWidth * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = this.individualBlockWidth * 2;
      this.shapeWidth = this.individualBlockWidth * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = this.individualBlockWidth * 4;
      this.shapeWidth = this.individualBlockWidth * 2;
    }
    this.drawShape();
  };
}

class JShape extends Shape {
  constructor() {
    super(ORANGE);
    this.shapeHeight = this.individualBlockWidth * 4;
    this.shapeWidth = this.individualBlockWidth * 3;
    this.rotation = "down"; // down, up, left, right
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      if (this.rotation === "down") {
        if (block === 3) {
          // clear the block on the bottom left
          ctx.clearRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear stacked vertical blocks
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "right") {
        if (block === 3) {
          // clear block on bottom right
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks in a row
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "left") {
        if (block === 3) {
          // clear block on top left
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks in a row
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "up") {
        if (block === 3) {
          // clear the block on the top right
          ctx.clearRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // clear blocks vertically
          ctx.clearRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      }
    });
  };

  drawShape = () => {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.borderColor;

    this.blocks.forEach((block) => {
      if (this.rotation === "down") {
        if (block === 3) {
          // put this block on the bottom left
          ctx.fillRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate - this.individualBlockWidth,
            this.yCoordinate + this.individualBlockWidth * 2,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // stack blocks vertically
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "right") {
        if (block === 3) {
          // put block on bottom right
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * 2,
            this.yCoordinate + this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // place blocks in a row
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "left") {
        if (block === 3) {
          // put block on top left
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate - this.individualBlockWidth,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // place blocks in a row
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth * block,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      } else if (this.rotation === "up") {
        if (block === 3) {
          // place this block on the top right
          ctx.fillRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate + this.individualBlockWidth,
            this.yCoordinate,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        } else {
          // stack blocks vertically
          ctx.fillRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
          ctx.strokeRect(
            this.xCoordinate,
            this.yCoordinate + this.individualBlockWidth * block,
            this.individualBlockWidth,
            this.individualBlockWidth
          );
        }
      }
    });
  };

  rotate = () => {
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = this.individualBlockWidth * 2;
      this.shapeWidth = this.individualBlockWidth * 4;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = this.individualBlockWidth * 4;
      this.shapeWidth = this.individualBlockWidth * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = this.individualBlockWidth * 3;
      this.shapeWidth = this.individualBlockWidth * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = this.individualBlockWidth * 4;
      this.shapeWidth = this.individualBlockWidth * 2;
    }
    this.drawShape();
  };
}

const dropShape = (shapeName) => {
  let shape;
  if (shapeName === "line") {
    shape = new Line();
  } else if (shapeName === "square") {
    shape = new Square();
  } else if (shapeName === "tShape") {
    shape = new TShape();
  } else if (shapeName === "lShape") {
    shape = new LShape();
  } else if (shapeName === "jShape") {
    shape = new JShape();
  }

  shape.fall();
};

dropShape("tShape");
