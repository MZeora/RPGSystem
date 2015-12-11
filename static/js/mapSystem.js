function basicMapRender(mapData){
  tiles = [];
  var tileset = "/loadTileSet?name="+mapData.tileset;

  for(var l = 0; l < mapData.map.length; l++){
    tiles[l] = [];
    for(var i = 0; i < mapData.map[l].length; i++){
      tiles[l][i] = [];
      for(var j = 0; j < mapData.map[l][i].length; j++){
        tiles[l][i][j] = new Image();
        tileCount++;
        tiles[l][i][j].src = tileset;
        tiles[l][i][j].sX = mapData.map[l][i][j][0]*tileWidth;
        tiles[l][i][j].sY = mapData.map[l][i][j][1]*tileHeight;
        tiles[l][i][j].sWidth = tileWidth;
        tiles[l][i][j].sHeight = tileHeight;
        tiles[l][i][j].dWidth = tileWidth;
        tiles[l][i][j].dHeight = tileHeight;
        tiles[l][i][j].dX = j*tileWidth;
        tiles[l][i][j].dY = i*tileHeight;
        tiles[l][i][j].onload = function(){
          loadedTileCount++;

          if(tileCount == loadedTileCount){
            draw();
          }
        }
      }
    }
  }
}

function draw(){
  context.clearRect(0,0,canvas.width,canvas.height);

  for(var l = 0; l < tiles.length; l++){
    for(i = 0; i < canvas.height/tileHeight; i++){
      for(j = 0; j < canvas.width/tileWidth; j++){
        context.drawImage(tiles[l][i][j], tiles[l][i][j].sX, tiles[l][i][j].sY, tiles[l][i][j].sWidth, tiles[l][i][j].sHeight,
                          tiles[l][i][j].dX, tiles[l][i][j].dY, tiles[l][i][j].dWidth, tiles[l][i][j].dHeight)
      }
    }
  }

  context.fillStyle = "black";
  context.fillRect(vpWidth*tileWidth,0,canvas.width,canvas.height);
  context.fillRect(0,vpHeight*tileHeight,canvas.width,canvas.height);
}

function partDraw(layer,x,y){
  context.clearRect(x*tileHeight,y*tileWidth,tileHeight,tileWidth);
  context.drawImage(tiles[layer][x][y], tiles[layer][x][y].sX, tiles[layer][x][y].sY, tiles[layer][x][y].sWidth, tiles[layer][x][y].sHeight,
                    tiles[layer][x][y].dX, tiles[layer][x][y].dY, tiles[layer][x][y].dWidth, tiles[layer][x][y].dHeight)
}