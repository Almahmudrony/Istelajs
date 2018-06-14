
var OBJECTS = [];
var BG = [];

var MATH =
{
	vec2:function(XX,YY)
	{
		return {x:XX,y:YY};
	}
}

function SOUND_CLASS(src)
{

	this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }

}

function SScreen_class(imgsrc,MILISEC,canvass)
{
	this.img = new Image();
	this.img.onload = function() { console.log("A Slash Image is loaded!");}
	this.img.src = imgsrc;
	this.milisec = MILISEC;
	this.enable = true;
	this.scale = 0.3;
	this.count = 0;
	this.c = new MATH.vec2(canvass.width/2,canvass.height/2);
	this.update = function(delta)
	{
		if(this.count<this.milisec+1)
		{
			this.scale += 0.0009;
			this.count += delta;
		}
		if(this.count>this.milisec && this.enable)
		{
			this.enable = false;
		}
	}
	this.draw = function()
	{
		if(this.enable)
		{
			ARTIST.drawimage(this.img,0,0,this.img.width,this.img.height,this.c.x-(this.img.width/2)*this.scale,this.c.y-(this.img.height/2)*this.scale,this.img.width*this.scale,this.img.height*this.scale);
		}
	}
}

var OneDtoTwoD =
{
	OneDto1D:function(i,j,w)
	{
			return (i*w)+j;
	},
	OneDto2D:function(index,numOfcollumn)
	{
			return {x:index % numOfcollumn, y:(index - (index % numOfcollumn)) / numOfcollumn};//y=k-(this.x*this.w);
	}
}

function SINGLE_BG_LAYER_CLASS(imgsrc,canvass,SCALE)
{
	this.img = new Image();
	this.img.onload = function() { console.log("A layer Image is loaded!"); }
	this.img.src = imgsrc;
	this.imgScale = SCALE;
	this.center1 = new MATH.vec2((canvass.width/2),(canvass.height/2));
	this.center2 = new MATH.vec2(this.center1.x+((this.img.width)*this.imgScale),this.center1.y);
	this.enable = true;
	this.speed = -1;
	BG.push(this);
	this.update = function()
	{
		this.center1.x += this.speed;
		this.center2.x += this.speed;
		if(this.center1.x + ((this.img.width/2)*this.imgScale)<0)
		{
			this.center1.x = this.center2.x + (this.img.width)*this.imgScale;//+(this.img.width/2);
		}
		if(this.center2.x + ((this.img.width/2)*this.imgScale)<0)
		{
			this.center2.x = this.center1.x + (this.img.width)*this.imgScale;//+(this.img.width/2);
		}
	}
	this.draw = function()
	{
		if(this.enable)
		{
			ARTIST.drawimage(this.img,0,0,this.img.width,this.img.height,this.center1.x-(this.img.width/2)*this.imgScale,this.center1.y-(this.img.height/2)*this.imgScale,this.img.width*this.imgScale,this.img.height*this.imgScale);
			ARTIST.drawimage(this.img,0,0,this.img.width,this.img.height,this.center2.x-(this.img.width/2)*this.imgScale,this.center2.y-(this.img.height/2)*this.imgScale,this.img.width*this.imgScale,this.img.height*this.imgScale);
		}
	}
}

function SPRITE_SHEET(imgsrc,COLUMN,ROW,COUNT,MILISEC)
{
	this.img = new Image();
	this.img.onload = function() { console.log("A Sprite psheet Image is loaded!"); }
	this.img.src = imgsrc;
	this.row = ROW;
	this.column = COLUMN;
	this.count = COUNT;
	this.milisec = MILISEC;
	this.scale = 1;
	this.currentFrame = 0;
	this.FRAMES = [];
	this.relative = new MATH.vec2(0.0,0.0);
	this.enable = true;
	for(var i=0;i<this.count;i++)
	{
		var tileX = (this.img.width/this.column);
		var tileY = (this.img.height/this.row);
		var ij = new MATH.vec2(0,0);
		ij = OneDtoTwoD.OneDto2D(i,this.column);
		var newFrame = new ANIMATION_FRAME_CLASS((ij.x*tileX),(ij.y*tileY),tileX,tileY,i);
		this.FRAMES.push(newFrame);
	}
	this.update = function(delta,gobj)
	{
		this.currentFrame+=(this.count*delta)/this.milisec;
		if(this.currentFrame>this.count-1)
		{
			this.currentFrame = 0;
		}
		gobj.move(this.relative.x,this.relative.y);
	}
	this.draw = function(X,Y)
	{
		if(this.enable)
		{
			X -= ((this.img.width/this.column)/2)*this.scale;
			Y -= ((this.img.height/this.row)/2)*this.scale;
			ARTIST.drawimage(this.img,this.FRAMES[Math.round(this.currentFrame)].sx,this.FRAMES[Math.round(this.currentFrame)].sy,this.FRAMES[Math.round(this.currentFrame)].sw,this.FRAMES[Math.round(this.currentFrame)].sh,X,Y,this.FRAMES[Math.round(this.currentFrame)].sw*this.scale,this.FRAMES[Math.round(this.currentFrame)].sh*this.scale);

		}
	}
	this.reset = function()
	{
		this.currentFrame = 0;
	}

}

function ANIMATION_FRAME_CLASS(SX,SY,SW,SH/*,RELVEC*/,INDEX)
{
	this.sx = SX;
	this.sy = SY;
	this.sw = SW;
	this.sh = SH;
	//this.RelVec = RELVEC;
	this.index = INDEX;
}

function ANIMATION_CLASS()
{

}

function ANIMATOR_CLASS()
{

}

function OVERLAY_CLASS()
{

}

function GUI_CLASS()
{

}

function box_shape(WIDTH,HEIGHT)
{
	this.w = WIDTH;
	this.h = HEIGHT;
}

function circle_shape(CX,CY,RADIUS)
{
	this.cx = CX;
	this.cy = CY;
	this.r = RADIUS;
}

function GAME_OBJECT(CollShape,CX,CY,ISSTATIC,NAME)
{
	this.cx = CX;
	this.cy = CY;
	this.z = 0;
	this.shape = CollShape;
	this.IsStatic = ISSTATIC;
	this.name = NAME;
	this.enable = true;
	this.debug = false;
	this.currentAnim = 0;
	//this.play = true;
	//this.running = false;
	this.sprites = [];
	OBJECTS.push(this);

	this.addAnimation = function(spsheet)
	{
		this.sprites.push(spsheet);
	}

	this.update = function(delta)
	{
		this.sprites[this.currentAnim].update(delta,this);
	}
	this.move = function(dx,dy)
	{
		if(this.enable && !this.IsStatic)
		{
			this.cx += dx;
			this.cy += dy;
		}
		
	}
	this.draw = function()
	{
		if(this.enable)
		{
			this.sprites[this.currentAnim].draw(this.cx,this.cy);
			if(this.debug)
			{
				this.debugDraw();
			}
		}
		
	}
	this.debugDraw = function()
	{
		if(this.enable)
		{
			ARTIST.setLineWidth(1);
			ARTIST.setColor('rgb(200,0,0)');
			ARTIST.rect(this.cx-(this.shape.w/2),this.cy-(this.shape.h/2),this.shape.w,this.shape.h,false);
			UTILITY.drawCenter(this.cx,this.cy);
		}
	}
}

var RENDER =
{
	renderAll:function()
	{
		if(BG)
		{
			for(var i=0;i<BG.length;i++)
			{
				BG[i].draw();
			}
		}
		if(OBJECTS)
		{
			for(var i=0;i<OBJECTS.length;i++)
			{
				OBJECTS[i].draw();
			}
		}
	}
}

var PHYSICS =
{
	out_of_canvas_basic_physics_solver:function()
	{
		for(var i=0;i<OBJECTS.length;i++)
		{
			if((OBJECTS[i].cx-OBJECTS[i].shape.w/2)<0)
			{
				OBJECTS[i].cx = OBJECTS[i].shape.w/2;
			}
			if((OBJECTS[i].cy-OBJECTS[i].shape.h/2)<0)
			{
				OBJECTS[i].cy = OBJECTS[i].shape.h/2;
			}
			if((OBJECTS[i].cx+OBJECTS[i].shape.w/2)>canvas.width)
			{
				OBJECTS[i].cx = canvas.width-OBJECTS[i].shape.w/2;
			}
			if((OBJECTS[i].cy+OBJECTS[i].shape.h/2)>canvas.height)
			{
				OBJECTS[i].cy = canvas.height-OBJECTS[i].shape.h/2;
			}
		}
	}
}

function IMAGE_CLASS(src)
{
	this.img = new Image();
	this.img.src = src;
	//this.width = this.img.width;
	//this.height = this.img.height;
	this.draw = function(img,sX,sY,sW,sH,dX,dY,dW,dH)
	{
		ARTIST.drawimage(img,sX,sY,sW,sH,dX,dY,dW,dH);
	}
}


var ARTIST =
{
	setLineWidth:function(value)
	{
		ctx.lineWidth = value;
	},

	drawimage:function(img,sX,sY,sW,sH,dX,dY,dW,dH)
	{
		//ctx.drawImage(img, X-(img.width), Y-(img.height));
		ctx.drawImage(img,sX,sY,sW,sH,dX,dY,dW,dH);
	},
	putpixel:function(ID,X,Y,R,G,B,A)
	{
		var d = ID.data;
		d[0] = R;
		d[1] = G;
		d[2] = B;
		d[3] = A;
		ctx.putImageData(ID,X,Y);
	},

	triangle:function(x1,y1,x2,y2,x3,y3,stroke)
	{
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineTo(x3,y3);
		ctx.fill();
		if(stroke)
		{
			ctx.strokeStyle = "black";
			ctx.endPath();
			ctx.stroke();
		}
	},

	text:function(cx,cy,string)
	{
		ctx.font = "30px Agency FB";
		ctx.fillText(string,cx,xy);
	},

	circle:function(x,y,r,FILL) 
	{
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		if(FILL)
		{
			ctx.fill();
		}
		else
		{
			ctx.stroke();
		}
	},

	line:function(x0,y0,x1,y1)
	{
		ctx.beginPath();
		ctx.moveTo(x0,y0);
		ctx.lineTo(x1,y1);
		ctx.stroke();
	},

	rect:function(x,y,w,h,FILL) 
	{
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		if(FILL)
		{
			ctx.fill();
		}
		ctx.stroke();
	},
	setColor:function(color)//'rgb(r,g,b)'
	{
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
	},

	clearView:function(color)
	{
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		rect(0,0,canvas.width,canvas.height);
	}
}


var UTILITY =
{
	drawCenter:function(X,Y)
	{
		ARTIST.line(X-5,Y,X+5,Y);
		ARTIST.line(X,Y-5,X,Y+5);
	}
}


var ENGINE =
{
	clear:function() {ctx.clearRect(0, 0, canvas.width, canvas.height);},
	init:function() 
	{
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");
		id = ctx.createImageData(1,1);
		//return setInterval(main_loop, 200);
	}

}