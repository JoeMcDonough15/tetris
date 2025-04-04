// Colors
const GREEN = "rgb(0 255 0)";
const BLUE = "rgb(0 100 255)";
const RED = "rgb(255 0 0)";
const YELLOW = "rgb(255 255 0)";
const ORANGE = "rgb(255 127 0)";
// Grid Specifications
const NUM_ROWS = 40;
const NUM_COLS = 30;
const GRID_SPACE = 20;
// Canvas
const canvas = document.getElementById("canvas");
canvas.width = NUM_COLS * GRID_SPACE; // 600
canvas.height = NUM_ROWS * GRID_SPACE; // 800
const ctx = canvas.getContext("2d");

class Block {
  constructor(xCoordinate, yCoordinate, color) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.isBottomLedge = false;
    this.isLeftLedge = false;
    this.isRightLedge = false;
  }

  clearBlock = () => {
    ctx.clearRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
  };

  resetLedges = () => {
    this.isBottomLedge = false;
    this.isLeftLedge = false;
    this.isRightLedge = false;
  };

  drawBlock = () => {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.borderColor;
    ctx.fillRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
    ctx.strokeRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
  };
}

class Shape {
  constructor(colorString, startingOffset) {
    this.numBlocks = 4;
    this.shapeColor = colorString;
    this.blocks = [];
    for (let i = 0; i < this.numBlocks; i++) {
      const newBlock = new Block(
        Math.floor(canvas.width / 2 - startingOffset),
        0,
        this.shapeColor
      );
      this.blocks.push(newBlock);
    }
    this.initialBlock = this.blocks[0];
  }
}

class Line extends Shape {
  constructor() {
    super(GREEN, 40);
    this.shapeHeight = GRID_SPACE;
    this.shapeWidth = GRID_SPACE * this.numBlocks;
    this.rotation = "horizontal"; // horizontal or vertical
    // this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE;
    // this.leftLedge = this.initialBlock.xCoordinate;
    // this.rightLedge =
    //   this.initialBlock.xCoordinate + GRID_SPACE * 4;
  }

  // resetLeftLedge = () => {
  //   // regardless of rotation, the left ledge is always lined up with the initial block's x-coordinate
  //   this.leftLedge = this.initialBlock.xCoordinate;
  // };

  // resetRightLedge = () => {
  //   // if the piece is horizontal, the right ledge should be 4 block's worth of width blocks over from the initialBlock
  //   if (this.rotation === "horizontal") {
  //     this.rightLedge =
  //       this.initialBlock.xCoordinate + GRID_SPACE * 4;
  //   } else if (this.rotation === "vertical") {
  //     // if the piece is vertical, the right ledge is one block's worth of width over from the initialBlock
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE;
  //   }
  // };

  // resetBottomLedge = () => {
  //   // a method that looks at the rotation of the shape, and determines where the bottom ledge is
  //   if (this.rotation === "horizontal") {
  //     this.bottomLedge =
  //       this.initialBlock.yCoordinate + GRID_SPACE;
  //   } else if (this.rotation === "vertical") {
  //     this.bottomLedge =
  //       this.initialBlock.yCoordinate + GRID_SPACE * 4;
  //   }
  // };

  clearShape = () => {
    this.blocks.forEach((block) => {
      // reset ledges to false
      block.resetLedges();
      // remove block from canvas
      block.clearBlock();
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "horizontal") {
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * index;
        block.yCoordinate = this.initialBlock.yCoordinate;
        block.isBottomLedge = true;
        block.isLeftLedge = index === 0;
        block.isRightLedge = index === 3;
      } else if (this.rotation === "vertical") {
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * index;
        block.isBottomLedge = index === 3;
        block.isLeftLedge = true;
        block.isRightLedge = true;
      }

      block.drawBlock();
    });

    // every time we draw the shape (whether as it's falling, or when we move/rotate it), we have to reset the shape's ledges to reflect the shape's new position
    // this.resetBottomLedge();
    // this.resetLeftLedge();
    // this.resetRightLedge();
  };

  rotate = () => {
    if (
      (this.rotation === "vertical" && this.initialBlock.xCoordinate > 520) ||
      (this.rotation === "horizontal" && this.initialBlock.yCoordinate >= 720)
    ) {
      return;
    }
    this.clearShape();
    this.rotation = this.rotation === "horizontal" ? "vertical" : "horizontal";
    if (this.rotation === "vertical") {
      this.shapeHeight = GRID_SPACE * this.numBlocks;
      this.shapeWidth = GRID_SPACE;
    } else {
      this.shapeHeight = GRID_SPACE;
      this.shapeWidth = GRID_SPACE * this.numBlocks;
    }
    this.drawShape();
  };
}

class Square extends Shape {
  constructor() {
    super(BLUE, 20);
    this.shapeHeight = GRID_SPACE * (this.numBlocks / 2);
    this.shapeWidth = GRID_SPACE * (this.numBlocks / 2);
    // this.bottomLedge =
    //   this.initialBlock.yCoordinate + GRID_SPACE * 2;
    // this.leftLedge = this.initialBlock.xCoordinate;
    // this.rightLedge =
    //   this.initialBlock.xCoordinate + GRID_SPACE * 2;
  }

  // resetLeftLedge = () => {
  //   this.leftLedge = this.initialBlock.xCoordinate;
  // };

  // resetRightLedge = () => {
  //   this.rightLedge =
  //     this.initialBlock.xCoordinate + GRID_SPACE * 2;
  // };

  // resetBottomLedge = () => {
  //   this.bottomLedge =
  //     this.initialBlock.yCoordinate + GRID_SPACE * 2;
  // };

  clearShape = () => {
    this.blocks.forEach((block) => {
      // reset ledges to false
      block.resetLedges();
      // remove block from canvas
      block.clearBlock();
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      // handle ledges for each block
      if (index % 2 === 0) {
        block.isLeftLedge = true;
      } else {
        block.isRightLedge = true;
      }
      if (index > 1) {
        block.isBottomLedge = true;
      }
      // handle coordinates for each block
      if (index === 1) {
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.initialBlock.yCoordinate;
      } else if (index === 2) {
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
      } else if (index === 3) {
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
      }
      block.drawBlock();
    });

    // this.resetBottomLedge();
    // this.resetLeftLedge();
    // this.resetRightLedge();
  };

  rotate = () => {
    return;
  };
}

class TShape extends Shape {
  constructor() {
    super(RED, 40);
    this.shapeHeight = GRID_SPACE * (this.numBlocks / 2);
    this.shapeWidth = GRID_SPACE * (this.numBlocks - 1);
    this.rotation = "up"; // up, right, down, left
    // this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE;
    // this.leftLedge = this.initialBlock.xCoordinate;
    // this.rightLedge =
    //   this.initialBlock.xCoordinate + GRID_SPACE * 3;
  }

  // resetLeftLedge = () => {
  //   if (
  //     this.rotation === "up" ||
  //     this.rotation === "down" ||
  //     this.rotation === "right"
  //   ) {
  //     // if it's rotated up or down, the left edge is the aligned with the left side of the initialBlock
  //     this.leftLedge = this.initialBlock.xCoordinate;
  //   } else if (this.rotation === "left") {
  //     // if it's rotated to the left, the left edge now juts out, so it should be decreased from the initialBlock's x coordinate by one block's width
  //     this.leftLedge = this.initialBlock.xCoordinate - GRID_SPACE;
  //   }
  // };

  // resetRightLedge = () => {
  //   if (this.rotation === "up" || this.rotation === "down") {
  //     // if rotated up or down, the right edge is 3 blocks width from the initial block's left edge
  //     this.rightLedge =
  //       this.initialBlock.xCoordinate + GRID_SPACE * 3;
  //   } else if (this.rotation === "right") {
  //     // if rotated right, the right edge is 2 block's width from the initial block
  //     this.rightLedge =
  //       this.initialBlock.xCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "left") {
  //     // if the piece is rotated left, the right edge is one block's width from the initial block
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE;
  //   }
  // };

  // resetBottomLedge = () => {
  //   if (this.rotation === "up") {
  //     this.bottomLedge =
  //       this.initialBlock.yCoordinate + GRID_SPACE;
  //   } else if (this.rotation === "down") {
  //     this.bottomLedge =
  //       this.initialBlock.yCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "left" || this.rotation === "right") {
  //     this.bottomLedge =
  //       this.initialBlock.yCoordinate + GRID_SPACE * 3;
  //   }
  // };

  clearShape = () => {
    this.blocks.forEach((block) => {
      // reset ledges to false
      block.resetLedges();
      // clear the block from the canvas
      block.clearBlock();
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "up") {
        // handle left and right ledges
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index === 2 || index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates and bottom ledges
        if (index === 3) {
          // place the final block above the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row and list these as the bottom ledge blocks
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
          block.isBottomLedge = true;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index === 2 || index === 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 2 || index === 3) {
          block.isRightLedge = true;
        }
        if (index === 0 || index === 1 || index === 2) {
          block.isLeftLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put the final block to the right of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index === 2 || index === 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 2 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index === 0 || index === 1 || index === 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block to the left of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "down") {
        // handle ledges
        if (index === 0 || index === 2 || index === 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index === 2 || index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block below the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      }
      block.drawBlock();
    });

    // this.resetBottomLedge();
    // this.resetLeftLedge();
    // this.resetRightLedge();
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "down";
    } else if (
      this.rotation === "left" &&
      this.initialBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "left" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "up";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate === 0
    ) {
      this.rotation = "left";
    }
    this.clearShape();
    if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    }
    this.drawShape();
  };
}

class LShape extends Shape {
  constructor() {
    super(YELLOW, 20);
    this.shapeHeight = GRID_SPACE * 3;
    this.shapeWidth = GRID_SPACE * 2;
    this.rotation = "down"; // down, up, left, right
    // this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 3;
    // this.leftLedge = this.initialBlock.xCoordinate;
    // this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE * 2;
  }

  // resetLeftLedge = () => {
  //   if (
  //     this.rotation === "down" ||
  //     this.rotation === "left" ||
  //     this.rotation === "right"
  //   ) {
  //     this.leftLedge = this.initialBlock.xCoordinate;
  //   } else if (this.rotation === "up") {
  //     this.leftLedge = this.initialBlock.xCoordinate - GRID_SPACE;
  //   }
  // };

  // resetRightLedge = () => {
  //   if (this.rotation === "down") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "left" || this.rotation === "right") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE * 3;
  //   } else if (this.rotation === "up") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE;
  //   }
  // };

  // resetBottomLedge = () => {
  //   if (this.rotation === "up" || this.rotation === "down") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 3;
  //   } else if (this.rotation === "left") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "right") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE;
  //   }
  // };

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.clearBlock();
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "down") {
        if (index === 3) {
          // place this block on the bottom right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * 2;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "right") {
        if (index === 3) {
          // put block on top right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * 2;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "left") {
        if (index === 3) {
          // put block on bottom left
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "up") {
        if (index === 3) {
          // put this block on the top left
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      }
      block.drawBlock();
    });

    // this.resetBottomLedge();
    // this.resetLeftLedge();
    // this.resetRightLedge();
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "left" && this.initialBlock.xCoordinate === 0) {
      this.rotation = "up";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 580) {
      return;
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "right";
    }
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    }
    this.drawShape();
  };
}

class JShape extends Shape {
  constructor() {
    super(ORANGE, 0);
    this.shapeHeight = GRID_SPACE * 4;
    this.shapeWidth = GRID_SPACE * 3;
    this.rotation = "down"; // down, up, left, right
    // this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 3;
    // this.leftLedge = this.initialBlock.xCoordinate - GRID_SPACE;
    // this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE;
  }

  // resetLeftLedge = () => {
  //   if (this.rotation === "down") {
  //     this.leftLedge = this.initialBlock.xCoordinate - GRID_SPACE;
  //   } else if (
  //     this.rotation === "up" ||
  //     this.rotation === "left" ||
  //     this.rotation === "right"
  //   ) {
  //     this.leftLedge = this.initialBlock.xCoordinate;
  //   }
  // };

  // resetRightLedge = () => {
  //   if (this.rotation === "down") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE;
  //   } else if (this.rotation === "up") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "left" || this.rotation === "right") {
  //     this.rightLedge = this.initialBlock.xCoordinate + GRID_SPACE * 3;
  //   }
  // };

  // resetBottomLedge = () => {
  //   if (this.rotation === "up" || this.rotation === "down") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 3;
  //   } else if (this.rotation === "right") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE * 2;
  //   } else if (this.rotation === "left") {
  //     this.bottomLedge = this.initialBlock.yCoordinate + GRID_SPACE;
  //   }
  // };

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.clearBlock();
    });
  };

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "down") {
        if (index === 3) {
          // put this block on the bottom left
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * 2;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "right") {
        if (index === 3) {
          // put block on bottom right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * 2;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "left") {
        if (index === 3) {
          // put block on top left
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "up") {
        if (index === 3) {
          // place this block on the top right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      }
      block.drawBlock();
    });

    // this.resetBottomLedge();
    // this.resetLeftLedge();
    // this.resetRightLedge();
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.initialBlock.xCoordinate === 0) {
      this.rotation = "left";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "right";
    }
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    }
    this.drawShape();
  };
}

class Game {
  constructor() {
    this.gameOver = false;
    this.level = 1;
    this.gameSpeed = 500;
    this.rowsCleared = 0;
    this.grid = new Array(NUM_ROWS); // will be a 2d array
    this.availablePieces = ["line", "square", "tShape", "lShape", "jShape"];
    this.currentPiece = null; // will be an instance of a specific sub class of Shape based on the strings in this.availablePieces

    // populate the 2d grid - O(1) Time and Space.  There is a set number of rows and columns, so despite the nested loop, none of this is based on user input, so the Big O analysis of this operation would be considered constant.
    for (let i = 0; i < this.grid.length; i++) {
      // set all columns to false to denote unoccupied grid spaces.
      const newRow = new Array(NUM_COLS + 1).fill(false);
      newRow[newRow.length - 1] = 0; // override the last false value with a number to be used as the number of columns occupied in each row, initialized to 0.
      this.grid[i] = newRow;
    }
  }

  // methods

  placePiece = (interval) => {
    // clear the event listeners from the current piece, and stop setInterval
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
    // select a new piece to fall, making it unnecessary to return out of dropPiece.
    this.selectNewPiece();
  };

  dropPiece = () => {
    const fallInterval = setInterval(() => {
      if (this.currentPiece.bottomLedge >= canvas.height) {
        this.placePiece(fallInterval);
        return;
      }
      this.currentPiece.clearShape();
      this.currentPiece.initialBlock.yCoordinate += GRID_SPACE;
      this.currentPiece.drawShape();
    }, this.gameSpeed);

    document.addEventListener("keydown", this.pieceControllerEvents);
  };

  movePieceLeft = () => {
    if (this.currentPiece.leftLedge <= 0) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate -= GRID_SPACE;
    this.currentPiece.drawShape();
  };

  movePieceRight = () => {
    if (this.currentPiece.rightLedge >= canvas.width) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate += GRID_SPACE;
    this.currentPiece.drawShape();
  };

  pieceControllerEvents = (e) => {
    const keyName = e.key;
    if (keyName === "ArrowRight") {
      this.movePieceRight();
    } else if (keyName === "ArrowLeft") {
      this.movePieceLeft();
    } else if (keyName === "r") {
      this.currentPiece.rotate();
    }
  };

  selectNewPiece = () => {
    const generatedIndex = Math.floor(
      Math.random() * this.availablePieces.length
    );

    const pieceName = this.availablePieces[generatedIndex];
    let newPiece;
    if (pieceName === "line") {
      newPiece = new Line();
    } else if (pieceName === "square") {
      newPiece = new Square();
    } else if (pieceName === "tShape") {
      newPiece = new TShape();
    } else if (pieceName === "lShape") {
      newPiece = new LShape();
    } else if (pieceName === "jShape") {
      newPiece = new JShape();
    }

    this.currentPiece = newPiece;

    this.dropPiece();
  };

  // TODOS
  speedDown = () => {};
}

const game = new Game();

// for (let i = 0; i < game.grid.length; i++) {
// }

game.selectNewPiece(); // begins game
