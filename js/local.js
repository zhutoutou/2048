var Local =function(){
  // 游戏对象
  var game;

  // 绑定键盘事件
  var bindKeyEvent =function(){
    document.onkeydown =function(e){
      if(e.keyCode == 38){  // up
        game.move(0);
      }else if(e.keyCode == 39){  // right
        game.move(3);
      }else if(e.keyCode == 37){  // left
        game.move(1);
      }else if(e.keyCode == 40){  // down
        game.move(2);
      }
    }
  }


  // 开始
  var start =function(){
    var doms={
      gameDiv:document.getElementById('game'),
    }
    game=new Game();
    game.init(doms);
    bindKeyEvent();
  }

  // 导出API
  this.start =start;
}